import type { CollectorSnapshot } from '../domain/models'
import { seedCommunityFeed } from './ecosystem'
import { fetchWalletSnapshot } from './chain/readAdapter'

export function buildPublicSnapshot(): CollectorSnapshot {
  return {
    profile: {
      walletAddress: '',
      displayName: 'anonymous collector',
      roles: ['visitor'],
      chainId: 4663,
      ethBalance: 0,
    },
    nftHoldings: [],
    tokenHoldings: [],
    feed: seedCommunityFeed(),
  }
}

export async function buildCollectorSnapshot(walletAddress: string): Promise<CollectorSnapshot> {
  const walletSnapshot = await fetchWalletSnapshot(walletAddress)
  return {
    profile: walletSnapshot.profile,
    nftHoldings: walletSnapshot.nftHoldings,
    tokenHoldings: walletSnapshot.tokenHoldings,
    feed: seedCommunityFeed(),
  }
}
