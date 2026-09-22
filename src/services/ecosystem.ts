import type { EcosystemEndpoint, FeedItem } from '../domain/models'
import { explorerTokenUrl, UNRMN_TOKEN } from '../config/chain'

export const ecosystemEndpoints: EcosystemEndpoint[] = [
  {
    id: 'unrmn-collection',
    type: 'collection',
    title: 'uNORMAN on µToken',
    href: 'https://utoken.gg/collection/unrmn',
  },
  {
    id: 'unrmn-token',
    type: 'token',
    title: '$uNRMN token page',
    href: 'https://utoken.gg/token/unrmn',
  },
  {
    id: 'unrmn-explorer',
    type: 'token',
    title: 'Blockscout contract',
    href: explorerTokenUrl(UNRMN_TOKEN.address),
  },
  {
    id: 'manifesto',
    type: 'docs',
    title: 'MEME MIGRATION',
    href: 'https://paragraph.com/@officialnormancomics/meme-migration',
  },
  {
    id: 'x-unorman',
    type: 'social',
    title: '@uNORMANCOMICS',
    href: 'https://x.com/uNORMANCOMICS',
  },
  {
    id: 'telegram',
    type: 'social',
    title: 'uNORMAN Telegram',
    href: 'https://t.me/+E3QAvdB1r281ZjAx',
  },
]

export function seedCommunityFeed(): FeedItem[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'x-1',
      source: 'x',
      title: '@uNORMANCOMICS',
      href: 'https://x.com/uNORMANCOMICS',
      summary: 'Campaign surface for $uNRMN collectors and fake-rare homies.',
      timestamp: now,
    },
    {
      id: 'x-2',
      source: 'x',
      title: '$uNRMN cashtag',
      href: 'https://x.com/search?q=%24uNRMN&src=typed_query',
      summary: 'Live cashtag search across X.',
      timestamp: now,
    },
    {
      id: 'tg-1',
      source: 'telegram',
      title: 'uNORMAN Telegram',
      href: 'https://t.me/+E3QAvdB1r281ZjAx',
      summary: 'Collector chat and launch-room updates.',
      timestamp: now,
    },
    {
      id: 'chain-1',
      source: 'onchain',
      title: 'Collection on µToken',
      href: 'https://utoken.gg/collection/unrmn',
      summary: 'Buy mints a card per whole token. Sells burn newest-first.',
      timestamp: now,
    },
    {
      id: 'chain-2',
      source: 'onchain',
      title: 'Verified token contract',
      href: explorerTokenUrl(UNRMN_TOKEN.address),
      summary: `${UNRMN_TOKEN.address} on Robinhood Chain.`,
      timestamp: now,
    },
  ]
}
