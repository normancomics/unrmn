import type {
  AssetToken,
  CollectorProfile,
  TokenHolding,
} from '../../domain/models'

export interface WalletSnapshot {
  profile: CollectorProfile
  nftHoldings: AssetToken[]
  tokenHoldings: TokenHolding[]
}

export async function connectWallet(): Promise<string> {
  return Promise.resolve('0x71a8...nrmn')
}

export async function fetchWalletSnapshot(
  walletAddress: string,
): Promise<WalletSnapshot> {
  return Promise.resolve({
    profile: {
      walletAddress,
      displayName: 'rare pepe scientist',
      roles: ['collector', 'hodlr', 'xcp og'],
    },
    nftHoldings: [
      {
        id: 'unrmn-001',
        name: 'uNORMAN Genesis Layer',
        image:
          'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&w=800&q=80',
        collection: 'uNORMAN',
        traits: ['pixel', 'onchain-layer', 'immutable'],
      },
      {
        id: 'unrmn-002',
        name: 'uNORMAN Fake Rare Fragment',
        image:
          'https://images.unsplash.com/photo-1614851099511-773084f6911d?auto=format&fit=crop&w=800&q=80',
        collection: 'uNORMAN',
        traits: ['rare-pepe', 'collector-boost'],
      },
    ],
    tokenHoldings: [
      { symbol: 'uNRMN', balance: 42000 },
      { symbol: 'UFEELSFAKE', balance: 1337 },
    ],
  })
}
