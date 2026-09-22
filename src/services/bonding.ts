import { createPublicClient, formatEther, http } from 'viem'
import { robinhoodChain, UNRMN_TOKEN } from '../config/chain'
import { WETH } from '../config/uniswap'
import { GRADUATION_TARGET_ETH } from '../config/campaign'

const publicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(import.meta.env.VITE_RPC_URL || robinhoodChain.rpcUrls.default.http[0]),
})

export interface BondingSnapshot {
  targetEth: number
  raisedEth: number
  remainingEth: number
  progress: number
  status: 'bonding' | 'ready' | 'graduated'
  sources: string[]
}

export async function readBondingSnapshot(): Promise<BondingSnapshot> {
  const sources: string[] = []
  let raised = Number(import.meta.env.VITE_BOND_ETH_RAISED || 0)
  if (raised > 0) sources.push('manual env override')

  try {
    const [native, weth] = await Promise.all([
      publicClient.getBalance({ address: UNRMN_TOKEN.address }),
      publicClient.readContract({
        address: WETH,
        abi: [
          {
            type: 'function',
            name: 'balanceOf',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ type: 'uint256' }],
          },
        ] as const,
        functionName: 'balanceOf',
        args: [UNRMN_TOKEN.address],
      }),
    ])
    const onchain = Number(formatEther(native)) + Number(formatEther(weth))
    if (onchain > raised) {
      raised = onchain
      sources.push('token contract ETH/WETH')
    }
  } catch {
    sources.push('rpc read failed — showing configured progress only')
  }

  const graduated = import.meta.env.VITE_GRADUATED === 'true' || raised >= GRADUATION_TARGET_ETH
  const remaining = Math.max(GRADUATION_TARGET_ETH - raised, 0)
  const progress = Math.min(raised / GRADUATION_TARGET_ETH, 1)

  return {
    targetEth: GRADUATION_TARGET_ETH,
    raisedEth: raised,
    remainingEth: remaining,
    progress,
    status: graduated ? 'graduated' : remaining <= 0.05 ? 'ready' : 'bonding',
    sources: sources.length ? sources : ['no on-curve reserve visible on the token address yet'],
  }
}
