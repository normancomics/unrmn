import type { AssetToken } from '../domain/models'

export interface MarketListing {
  id: string
  side: 'ask' | 'bid'
  item: string
  priceEth: number
  maker: string
  venue: 'curve' | 'v4' | 'kiosk'
  note: string
}

export function seedMarketBook(holdings: AssetToken[]): MarketListing[] {
  const asks: MarketListing[] = holdings.slice(0, 8).map((item, index) => ({
    id: `ask-${item.id}`,
    side: 'ask',
    item: item.name,
    priceEth: Number((0.01 + index * 0.002).toFixed(4)),
    maker: 'you',
    venue: 'kiosk',
    note: 'Local ask preview. Live fill stays on µToken / v4 until the book contract is verified.',
  }))

  const bids: MarketListing[] = [
    {
      id: 'bid-floor',
      side: 'bid',
      item: 'uNORMAN any whole card',
      priceEth: 0.008,
      maker: 'open bid',
      venue: 'kiosk',
      note: 'Standing bid template for post-grad kiosk. Not an on-chain order.',
    },
    {
      id: 'bid-genesis',
      side: 'bid',
      item: 'uNORMAN #1',
      priceEth: 0.03,
      maker: 'collector desk',
      venue: 'kiosk',
      note: 'Named card bid. Cleaner than scrolling a launchpad chat.',
    },
  ]

  return [...asks, ...bids]
}
