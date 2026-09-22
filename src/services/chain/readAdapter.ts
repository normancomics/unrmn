import {
  createPublicClient,
  formatEther,
  formatUnits,
  http,
  type Address,
} from 'viem'
import type { AssetToken, CollectorProfile, TokenHolding } from '../../domain/models'
import { ROBINHOOD_CHAIN_ID, ROBINHOOD_CHAIN_ID_HEX, UNRMN_TOKEN, robinhoodChain } from '../../config/chain'
import heroCard from '../../assets/hero.png'

const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const

export interface WalletSnapshot {
  profile: CollectorProfile
  nftHoldings: AssetToken[]
  tokenHoldings: TokenHolding[]
}

const publicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(import.meta.env.VITE_RPC_URL || robinhoodChain.rpcUrls.default.http[0]),
})

function getInjectedProvider() {
  if (!window.ethereum) {
    throw new Error('No injected wallet found. Install Rabby, MetaMask, or Rainbow.')
  }
  return window.ethereum
}

async function ensureRobinhoodChain(provider: EthereumProvider) {
  const current = await provider.request({ method: 'eth_chainId' })
  if (String(current).toLowerCase() === ROBINHOOD_CHAIN_ID_HEX) return

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ROBINHOOD_CHAIN_ID_HEX }],
    })
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? Number(error.code) : 0
    if (code !== 4902) throw error
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: ROBINHOOD_CHAIN_ID_HEX,
          chainName: robinhoodChain.name,
          nativeCurrency: robinhoodChain.nativeCurrency,
          rpcUrls: [...robinhoodChain.rpcUrls.default.http],
          blockExplorerUrls: [robinhoodChain.blockExplorers.default.url],
        },
      ],
    })
  }
}

export async function connectWallet(): Promise<string> {
  const provider = getInjectedProvider()
  await ensureRobinhoodChain(provider)
  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[]
  const address = accounts[0]
  if (!address) throw new Error('Wallet did not return an account.')
  return address
}

export async function fetchWalletSnapshot(walletAddress: string): Promise<WalletSnapshot> {
  const address = walletAddress as Address
  const [ethBalance, tokenBalance] = await Promise.all([
    publicClient.getBalance({ address }),
    publicClient.readContract({
      address: UNRMN_TOKEN.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    }),
  ])

  const formattedToken = Number(formatUnits(tokenBalance, UNRMN_TOKEN.decimals))
  const wholeCards = Math.floor(formattedToken)

  return {
    profile: {
      walletAddress: address,
      displayName: `unrmn.${address.slice(2, 6)}`,
      roles: deriveRoles(formattedToken),
      chainId: ROBINHOOD_CHAIN_ID,
      ethBalance: Number(formatEther(ethBalance)),
    },
    nftHoldings: synthesizeCards(wholeCards),
    tokenHoldings: [
      {
        symbol: UNRMN_TOKEN.symbol,
        name: UNRMN_TOKEN.name,
        address: UNRMN_TOKEN.address,
        balance: formattedToken,
        raw: tokenBalance.toString(),
      },
    ],
  }
}

function deriveRoles(balance: number) {
  const roles = ['collector']
  if (balance >= 1) roles.push('card holder')
  if (balance >= 10) roles.push('whale fragment')
  return roles
}

function synthesizeCards(count: number): AssetToken[] {
  const visible = Math.min(Math.max(count, 0), 24)
  return Array.from({ length: visible }, (_, index) => ({
    id: `unrmn-${index + 1}`,
    name: `uNORMAN #${index + 1}`,
    image: heroCard,
    collection: 'uNORMAN',
    traits: ['µToken card', 'onchain layer', index === 0 ? 'oldest held' : 'synthetic slot'],
  }))
}
