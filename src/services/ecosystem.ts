import type { EcosystemEndpoint, FeedItem } from '../domain/models'

export const ecosystemEndpoints: EcosystemEndpoint[] = [
  {
    id: 'unrmn-collection',
    type: 'collection',
    title: 'uNORMAN Collection',
    href: 'https://utoken.gg/collection/unrmn',
  },
  {
    id: 'upepecash-nft',
    type: 'collection',
    title: 'UPEPECASH NFT',
    href: 'https://mint.club/nft/robinhood/UPEPECASH',
  },
  {
    id: 'unrmn-token',
    type: 'token',
    title: 'uNRMN Token',
    href: 'https://utoken.gg/token/unrmn',
  },
  {
    id: 'ufeelsfake-token',
    type: 'token',
    title: 'UFEELSFAKE Token',
    href: 'https://mint.club/token/robinhood/UFEELSFAKE',
  },
]

export function seedCommunityFeed(): FeedItem[] {
  return [
    {
      id: 'x-1',
      source: 'x',
      title: '@uNORMANCOMICS',
      href: 'https://x.com/uNORMANCOMICS',
      summary: 'Campaign and collector updates.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'tg-1',
      source: 'telegram',
      title: 'uNORMAN Telegram',
      href: 'https://t.me/+E3QAvdB1r281ZjAx',
      summary: 'Collector chat and launch-room updates.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'chain-1',
      source: 'onchain',
      title: 'Robinhood Chain Activity',
      href: 'https://utoken.gg/collection/unrmn',
      summary: 'Collection-level onchain event mirror (read-only seed).',
      timestamp: new Date().toISOString(),
    },
  ]
}
