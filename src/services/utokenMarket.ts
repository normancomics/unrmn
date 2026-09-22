import { utokenApiCandidates } from '../config/utoken'

export interface UtokenMarket {
  priceUsd: number
  holdersCount: number
  bondingProgress: number
  volume24hUsd: number
  marketCapUsd: number
  change24hPct: number
}

export async function fetchUtokenToken(): Promise<UtokenMarket | null> {
  for (const url of utokenApiCandidates) {
    try {
      const response = await fetch(url)
      if (!response.ok) continue
      const data = (await response.json()) as Partial<UtokenMarket>
      if (typeof data.bondingProgress !== 'number') continue
      return {
        priceUsd: Number(data.priceUsd || 0),
        holdersCount: Number(data.holdersCount || 0),
        bondingProgress: Number(data.bondingProgress || 0),
        volume24hUsd: Number(data.volume24hUsd || 0),
        marketCapUsd: Number(data.marketCapUsd || 0),
        change24hPct: Number(data.change24hPct || 0),
      }
    } catch {
      continue
    }
  }
  return null
}
