import { defineChain } from 'viem'

export const ROBINHOOD_CHAIN_ID = 4663
export const ROBINHOOD_CHAIN_ID_HEX = '0x1237'

export const robinhoodChain = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.chain.robinhood.com'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://robinhoodchain.blockscout.com' },
  },
})

export const UNRMN_TOKEN = {
  address: '0x7ed16d612215b650434d7e45827cf080ea0d0f63' as const,
  name: 'uNORMAN',
  symbol: 'uNRMN',
  decimals: 18,
  totalSupply: 10_000,
}

export const explorerAddressUrl = (address: string) =>
  `${robinhoodChain.blockExplorers.default.url}/address/${address}`

export const explorerTokenUrl = (address: string) =>
  `${robinhoodChain.blockExplorers.default.url}/token/${address}`
