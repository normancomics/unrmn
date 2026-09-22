import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  keccak256,
  toBytes,
  type Address,
  type Hex,
} from 'viem'
import { UNRMN_ART } from '../config/art'
import { UNRMN_POOL, UNRMN_TOKEN, robinhoodChain } from '../config/chain'
import { UNISWAP_V4 } from '../config/uniswap'

const client = createPublicClient({
  chain: robinhoodChain,
  transport: http(robinhoodChain.rpcUrls.default.http[0]),
})

export type InspectionCheck = {
  key: string
  severity: 'critical' | 'warn' | 'info'
  ok: boolean
  detail: string
}

export type HookInspection = {
  address: string | null
  checks: InspectionCheck[]
  score: number
  structuralPass: boolean
  /** Safe to flip VITE_ENABLE_STAKING only after human review of this report */
  recommendEnable: boolean
}

const KNOWN_BAD = new Set(
  [
    '0x0000000000000000000000000000000000000000',
    UNRMN_TOKEN.address.toLowerCase(),
    UNRMN_ART.address.toLowerCase(),
    UNRMN_POOL.address.toLowerCase(),
    UNRMN_POOL.factory.toLowerCase(),
  ].map((a) => a.toLowerCase()),
)

async function codeSize(address: Address) {
  const code = await client.getBytecode({ address })
  return code && code !== '0x' ? (code.length - 2) / 2 : 0
}

async function readAddr(to: Address, sig: string): Promise<Address | null> {
  try {
    const sel = keccak256(toBytes(sig)).slice(0, 10) as Hex
    const res = await client.call({ to, data: sel })
    if (!res.data || res.data.length < 66) return null
    return getAddress(`0x${res.data.slice(-40)}`)
  } catch {
    return null
  }
}

async function readBool(to: Address, sig: string): Promise<boolean | null> {
  try {
    const sel = keccak256(toBytes(sig)).slice(0, 10) as Hex
    const res = await client.call({ to, data: sel })
    if (!res.data) return null
    return BigInt(res.data) !== 0n
  } catch {
    return null
  }
}

async function readUint(to: Address, sig: string): Promise<bigint | null> {
  try {
    const sel = keccak256(toBytes(sig)).slice(0, 10) as Hex
    const res = await client.call({ to, data: sel })
    if (!res.data) return null
    return BigInt(res.data)
  } catch {
    return null
  }
}

/**
 * Deep DualStake / v4 hook inspection.
 * Never auto-enables writes — only scores and recommends.
 */
export async function inspectHook(candidate?: string | null): Promise<HookInspection> {
  const env = (import.meta.env.VITE_STAKING_VAULT as string | undefined)?.trim() || null
  const raw = (candidate || env || '').trim()
  const checks: InspectionCheck[] = []

  if (!raw || !isAddress(raw)) {
    checks.push({
      key: 'address',
      severity: 'critical',
      ok: false,
      detail: 'No candidate. Paste a hook address or set VITE_STAKING_VAULT.',
    })
    return { address: null, checks, score: 0, structuralPass: false, recommendEnable: false }
  }

  let address: Address
  try {
    address = getAddress(raw)
  } catch {
    checks.push({
      key: 'address',
      severity: 'critical',
      ok: false,
      detail: 'Invalid checksum / address format',
    })
    return { address: null, checks, score: 0, structuralPass: false, recommendEnable: false }
  }

  const lower = address.toLowerCase()
  checks.push({
    key: 'not-known-system',
    severity: 'critical',
    ok: !KNOWN_BAD.has(lower),
    detail: KNOWN_BAD.has(lower)
      ? 'Address collides with token, art, pool, factory, or zero — refuse'
      : 'Not a known system address',
  })

  const bytes = await codeSize(address)
  checks.push({
    key: 'bytecode',
    severity: 'critical',
    ok: bytes > 100,
    detail:
      bytes === 0
        ? 'EOA or empty — not a contract'
        : bytes < 100
          ? `Suspiciously small bytecode (${bytes} bytes)`
          : `Contract bytecode ${bytes} bytes`,
  })

  const unrmn = await readAddr(address, 'unrmn()')
  const unrmnOk = !!unrmn && unrmn.toLowerCase() === UNRMN_TOKEN.address.toLowerCase()
  checks.push({
    key: 'unrmn',
    severity: 'critical',
    ok: unrmnOk,
    detail: unrmn
      ? `unrmn() → ${unrmn}${unrmnOk ? ' \u2713' : ' (mismatch $uNRMN)'}`
      : 'unrmn() missing — not IUNRMNDualStakeHook',
  })

  const partner = await readAddr(address, 'partner()')
  checks.push({
    key: 'partner',
    severity: 'warn',
    ok: partner !== null,
    detail: partner ? `partner() → ${partner}` : 'partner() unread (ok until pair set)',
  })

  const graduated = await readBool(address, 'graduated()')
  checks.push({
    key: 'graduated',
    severity: 'info',
    ok: graduated !== null,
    detail: graduated === null ? 'graduated() unread' : `graduated() → ${graduated}`,
  })

  const target = await readUint(address, 'graduationTargetWei()')
  const targetOk = target !== null && (target === 9990000000000000000n || target > 0n)
  checks.push({
    key: 'graduation-target',
    severity: 'warn',
    ok: targetOk,
    detail:
      target === null
        ? 'graduationTargetWei() unread'
        : target === 9990000000000000000n
          ? 'graduationTargetWei() = 9.99 ETH \u2713'
          : `graduationTargetWei() = ${target.toString()} wei`,
  })

  checks.push({
    key: 'pool-manager-config',
    severity: 'info',
    ok: Boolean(UNISWAP_V4.poolManager),
    detail: `Desk PoolManager mapping: ${UNISWAP_V4.poolManager}`,
  })

  const addrBig = BigInt(address)
  const beforeSwap = (addrBig & (1n << 7n)) !== 0n
  const afterSwap = (addrBig & (1n << 6n)) !== 0n
  const afterAdd = (addrBig & (1n << 2n)) !== 0n
  const beforeRemove = (addrBig & (1n << 3n)) !== 0n
  checks.push({
    key: 'v4-permission-bits',
    severity: 'info',
    ok: beforeSwap || afterSwap || afterAdd || beforeRemove,
    detail: `Address flag bits — beforeSwap:${beforeSwap} afterSwap:${afterSwap} afterAddLiquidity:${afterAdd} beforeRemoveLiquidity:${beforeRemove} (vanity-mined hooks set these)`,
  })

  const flagOn = import.meta.env.VITE_ENABLE_STAKING === 'true'
  checks.push({
    key: 'feature-flag',
    severity: 'critical',
    ok: flagOn,
    detail: flagOn
      ? 'VITE_ENABLE_STAKING=true'
      : 'VITE_ENABLE_STAKING not true — desk will not send stake txs',
  })

  const criticalOk = checks.filter((c) => c.severity === 'critical').every((c) => c.ok)
  const structuralPass =
    checks.find((c) => c.key === 'bytecode')!.ok &&
    checks.find((c) => c.key === 'unrmn')!.ok &&
    checks.find((c) => c.key === 'not-known-system')!.ok

  const score = (checks.filter((c) => c.ok).length / checks.length) * 100

  return {
    address,
    checks,
    score: Math.round(score),
    structuralPass,
    recommendEnable: structuralPass && flagOn && criticalOk,
  }
}
