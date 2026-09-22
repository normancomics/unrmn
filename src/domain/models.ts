export interface CollectorProfile {
  walletAddress: string
  displayName: string
  roles: string[]
  chainId: number
  ethBalance: number
}

export interface AssetToken {
  id: string
  name: string
  image: string
  collection: string
  traits: string[]
}

export interface TokenHolding {
  symbol: string
  name: string
  address: string
  balance: number
  raw: string
}

export interface FeedItem {
  id: string
  source: 'x' | 'telegram' | 'onchain'
  title: string
  href: string
  summary: string
  timestamp: string
}

export interface EcosystemEndpoint {
  id: string
  type: 'collection' | 'token' | 'docs' | 'social'
  title: string
  href: string
}

export interface CollectorSnapshot {
  profile: CollectorProfile
  nftHoldings: AssetToken[]
  tokenHoldings: TokenHolding[]
  feed: FeedItem[]
}
