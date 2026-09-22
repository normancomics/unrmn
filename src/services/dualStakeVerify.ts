import { createPublicClient, http, isAddress, keccak256, toBytes, type Address, type Hex } from 'viem'
import { UNRMN_TOKEN, robinhoodChain } from '../config/chain'

const client = createPublicClient({
  chain: robinhoodChain,
  transport: http(robinhoodChain.rpcUrls.default.http[0]),
})

export type DualStakeCheck = {
  key: string
  ok: boolean
  detail: string
}

export type DualStakeReport = {
  address: string | null
  candidate: string | null
  checks: DualStakeCheck[]
  verified: boolean
  canEnableWrites: boolean
}

async function readAddressFn(to: Address, data: Hex): Promise<Address | null> {
  try {
    const res = await client.call({ to, data })
    if (!res.data || res.data.length < 66) return null
    return `0x${res.data.slice(-40)}` as Address
  } catch {
    return null
  }
}

async function codeSize(address: Address) {
  const code = await client.getBytecode({ address })
  return code && code !== '0x' ? (code.length - 2) / 2 : 0
}

/** On-chain dual-stake verification checklist. Never auto-enables writes. */
export async function verifyDualStake(candidate?: string | null): Promise<DualStakeReport> {
  const envCandidate = (import.meta.env.VITE_STAKING_VAULT as string | undefined)?.trim() || null
  const raw = (candidate || envCandidate || '').trim()
  const address = raw && isAddress(raw) ? (raw as Address) : null
  const checks: DualStakeCheck[] = []

  if (!address) {
    checks.push({
      key: 'address',
      ok: false,
      detail: 'No candidate DualStake address. Set VITE_STAKING_VAULT or paste one.',
    })
    return {
      address: null,
      candidate: raw || null,
      checks,
      verified: false,
      canEnableWrites: false,
    }
  }

  const bytes = await codeSize(address)
  checks.push({
    key: 'code',
    ok: bytes > 0,
    detail: bytes > 0 ? `Contract bytecode present (${bytes} bytes)` : 'No code at address (EOA or empty)',
  })

  const unrmnSel = keccak256(toBytes('unrmn()')).slice(0, 10) as Hex
  const partnerSel = keccak256(toBytes('partner()')).slice(0, 10) as Hex
  const graduatedSel = keccak256(toBytes('graduated()')).slice(0, 10) as Hex
  const targetSel = keccak256(toBytes('graduationTargetWei()')).slice(0, 10) as Hex

  const unrmn = await readAddressFn(address, unrmnSel)
  checks.push({
    key: 'unrmn',
    ok: !!unrmn && unrmn.toLowerCase() === UNRMN_TOKEN.address.toLowerCase(),
    detail: unrmn
      ? `unrmn() → ${unrmn}${unrmn.toLowerCase() === UNRMN_TOKEN.address.toLowerCase() ? ' (matches $uNRMN)' : ' (mismatch)'}`
      : 'unrmn() not readable — contract may not implement IUNRMNDualStakeHook',
  })

  const partner = await readAddressFn(address, partnerSel)
  checks.push({
    key: 'partner',
    ok: partner !== null,
    detail: partner ? `partner() → ${partner}` : 'partner() not readable (optional until set)',
  })

  try {
    const g = await client.call({ to: address, data: graduatedSel })
    const graduated = g.data && BigInt(g.data) !== 0n
    checks.push({
      key: 'graduated',
      ok: true,
      detail: `graduated() → ${graduated}`,
    })
  } catch {
    checks.push({ key: 'graduated', ok: false, detail: 'graduated() not readable' })
  }

  try {
    const t = await client.call({ to: address, data: targetSel })
    if (t.data) {
      const wei = BigInt(t.data)
      checks.push({
        key: 'target',
        ok: wei === 9990000000000000000n || wei > 0n,
        detail: `graduationTargetWei() → ${wei.toString()}`,
      })
    }
  } catch {
    checks.push({ key: 'target', ok: false, detail: 'graduationTargetWei() not readable' })
  }

  const flagOn = import.meta.env.VITE_ENABLE_STAKING === 'true'
  checks.push({
    key: 'flag',
    ok: flagOn,
    detail: flagOn
      ? 'VITE_ENABLE_STAKING=true'
      : 'VITE_ENABLE_STAKING is not true — writes stay off even if the hook matches',
  })

  const structural =
    checks.find((c) => c.key === 'code')?.ok && checks.find((c) => c.key === 'unrmn')?.ok

  return {
    address,
    candidate: address,
    checks,
    verified: Boolean(structural),
    canEnableWrites: Boolean(structural && flagOn),
  }
}
