import { createPublicClient, formatEther, http } from 'viem'
import { robinhoodChain, UNRMN_POOL, UNRMN_TOKEN } from '../config/chain'
import { WETH } from '../config/uniswap'
import { GRADUATION_TARGET_ETH } from '../config/campaign'
import { fetchUtokenToken } from './utokenMarket'

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
  priceUsd: number | null
  holders: number | null
}

export async function readBondingSnapshot(): Promise<BondingSnapshot> {
  const sources: string[] = []
  let raised = Number(import.meta.env.VITE_BOND_ETH_RAISED || 0)
  let priceUsd: number | null = null
  let holders: number | null = null

  if (raised > 0) sources.push('manual env override')

  try {
    const market = await fetchUtokenToken()
    if (market) {
      priceUsd = market.priceUsd
      holders = market.holdersCount
      const fromProgress = market.bondingProgress * GRADUATION_TARGET_ETH
      if (fromProgress > raised) {
        raised = fromProgress
        sources.push('µToken bondingProgress')
      }
    }
  } catch {
    sources.push('µToken API blocked in this origin')
  }

  try {
    const [poolNative, tokenNative, tokenWeth] = await Promise.all([
      publicClient.getBalance({ address: UNRMN_POOL.address }),
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
    const poolEth = Number(formatEther(poolNative))
    const tokenEth = Number(formatEther(tokenNative)) + Number(formatEther(tokenWeth))
    if (poolEth > raised) {
      raised = poolEth
      sources.push('curve pool ETH')
    }
    if (tokenEth > raised) {
      raised = tokenEth
      sources.push('token contract ETH/WETH')
    }
  } catch {
    sources.push('rpc reserve read failed')
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
    sources: sources.length ? sources : ['waiting on pool + µToken reads'],
    priceUsd,
    holders,
  }
}
