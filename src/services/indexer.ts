import type { CollectorSnapshot } from '../domain/models'
import { seedCommunityFeed } from './ecosystem'
import { fetchWalletSnapshot } from './chain/readAdapter'

export async function buildCollectorSnapshot(
  walletAddress: string,
): Promise<CollectorSnapshot> {
  const [walletSnapshot] = await Promise.all([fetchWalletSnapshot(walletAddress)])
  const feed = seedCommunityFeed()
  return {
    profile: walletSnapshot.profile,
    nftHoldings: walletSnapshot.nftHoldings,
    tokenHoldings: walletSnapshot.tokenHoldings,
    feed,
  }
}
