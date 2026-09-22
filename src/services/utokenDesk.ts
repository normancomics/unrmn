import { UTOKEN } from '../config/utoken'

async function pullJson<T>(paths: string[]): Promise<T | null> {
  for (const path of paths) {
    const urls = [`/utoken-api${path}`, `${UTOKEN.origin}${path}`]
    for (const url of urls) {
      try {
        const response = await fetch(url)
        if (!response.ok) continue
        return (await response.json()) as T
      } catch {
        continue
      }
    }
  }
  return null
}

export interface DeskToken {
  id: string
  address: string
  slug: string | null
  name: string
  symbol: string
  priceUsd: number
  priceQuote: number
  marketCapUsd: number
  volume24hUsd: number
  holdersCount: number
  bondingProgress: number
  change24hPct: number
  logoUrl: string | null
  family: string | null
}

export interface DeskAsset {
  assetId: string
  owner: string
  offerWei: string | null
  mintTx: string | null
}

export interface DeskComment {
  id: string
  content: string
  createdAt: string
  author: { address: string; username: string | null }
}

export async function fetchDeskToken() {
  return pullJson<DeskToken>([`/api/tokens/${UTOKEN.tokenId}`])
}

export async function fetchRegistry(take = 40) {
  const data = await pullJson<{ items: DeskToken[] }>([`/api/tokens?take=${take}`])
  return data?.items ?? []
}

export async function fetchAssets(take = 24) {
  const data = await pullJson<{ items: DeskAsset[] }>([
    `/api/tokens/${UTOKEN.tokenId}/assets?take=${take}&sort=revealed`,
  ])
  return data?.items ?? []
}

export async function fetchComments() {
  const data = await pullJson<DeskComment[]>([`/api/tokens/${UTOKEN.tokenId}/comments`])
  return data ?? []
}

export function fileUrl(path: string | null) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${UTOKEN.origin}${path}`
}

export function weiToEth(offerWei: string | null) {
  if (!offerWei) return null
  try {
    return Number(offerWei) / 1e18
  } catch {
    return null
  }
}
