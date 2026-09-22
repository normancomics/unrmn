export interface CollectorProfile {
  walletAddress: string
  displayName: string
  roles: string[]
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
  balance: number
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
  type: 'collection' | 'token'
  title: string
  href: string
}

export interface CollectorSnapshot {
  profile: CollectorProfile
  nftHoldings: AssetToken[]
  tokenHoldings: TokenHolding[]
  feed: FeedItem[]
}
