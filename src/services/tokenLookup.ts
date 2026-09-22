import { createPublicClient, http, isAddress, type Address } from 'viem'
import { robinhoodChain } from '../config/chain'

const erc20Abi = [
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
] as const

const publicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(import.meta.env.VITE_RPC_URL || robinhoodChain.rpcUrls.default.http[0]),
})

export interface LookedUpToken {
  address: Address
  name: string
  symbol: string
  decimals: number
}

export async function lookupRobinhoodToken(raw: string): Promise<LookedUpToken> {
  if (!isAddress(raw)) throw new Error('Not a valid address.')
  const address = raw as Address
  const [name, symbol, decimals] = await Promise.all([
    publicClient.readContract({ address, abi: erc20Abi, functionName: 'name' }),
    publicClient.readContract({ address, abi: erc20Abi, functionName: 'symbol' }),
    publicClient.readContract({ address, abi: erc20Abi, functionName: 'decimals' }),
  ])
  return { address, name, symbol, decimals }
}
