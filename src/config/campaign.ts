export const GRADUATION_TARGET_ETH = 9.99

export const campaign = {
  headline: 'Graduate uNORMAN. Take the book back.',
  subhead:
    'µToken is busy minting the next ticker. This desk exists so $uNRMN can finish the 9.99 ETH bond, burn LP into Uniswap v4, and run a cleaner secondary than the launchpad that forgot it.',
  targetEth: GRADUATION_TARGET_ETH,
  maxSupply: 10_000,
  cardRule: 'One card mints per whole $uNRMN received. Fractions do not mint. Transfers do not mint. Sells burn newest-first.',
}

export interface HybridAsset {
  id: string
  venue: 'utoken' | 'mintclub'
  kind: 'collection' | 'token' | 'nft1155'
  symbol: string
  title: string
  href: string
  address?: string
  blurb: string
}

export const hybridAssets: HybridAsset[] = [
  {
    id: 'unrmn-collection',
    venue: 'utoken',
    kind: 'collection',
    symbol: 'uNRMN',
    title: 'uNORMAN collection',
    href: 'https://utoken.gg/collection/unrmn',
    address: '0x7ed16d612215b650434d7e45827cf080ea0d0f63',
    blurb: 'The token is the art. Bond here. Graduate to a burned v4 book.',
  },
  {
    id: 'unrmn-token',
    venue: 'utoken',
    kind: 'token',
    symbol: 'uNRMN',
    title: '$uNRMN ERC-20',
    href: 'https://utoken.gg/token/unrmn',
    address: '0x7ed16d612215b650434d7e45827cf080ea0d0f63',
    blurb: '10,000 supply. Creator cap 1%. Rising max-wallet anti-snipe.',
  },
  {
    id: 'upepecash',
    venue: 'mintclub',
    kind: 'nft1155',
    symbol: 'UPEPECASH',
    title: 'UPEPECASH',
    href: 'https://mint.club/nft/robinhood/UPEPECASH',
    blurb: 'Mint.club bonding-curve ERC-1155 on Robinhood. Hybrid sister asset.',
  },
  {
    id: 'ufeelsfake',
    venue: 'mintclub',
    kind: 'token',
    symbol: 'UFEELSFAKE',
    title: 'UFEELSFAKE',
    href: 'https://mint.club/token/robinhood/UFEELSFAKE',
    blurb: 'Mint.club token. Eligible partner for dual-stake with $uNRMN.',
  },
]
