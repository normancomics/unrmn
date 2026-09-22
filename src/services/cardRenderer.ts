import { createPublicClient, decodeAbiParameters, http, type Hex } from 'viem'
import { UNRMN_ART } from '../config/art'
import { robinhoodChain } from '../config/chain'

const client = createPublicClient({
  chain: robinhoodChain,
  transport: http(robinhoodChain.rpcUrls.default.http[0]),
})

const cache = new Map<string, string>()

function callData(assetId: string): Hex {
  const id = BigInt(assetId)
  return `${UNRMN_ART.tokenSvgSelector}${id.toString(16).padStart(64, '0')}` as Hex
}

/** Fetch the official on-chain SVG for a µNORMAN card (same path utoken.gg uses). */
export async function renderCardSvg(assetId: string): Promise<string | null> {
  if (cache.has(assetId)) return cache.get(assetId) || null
  try {
    const result = await client.call({
      to: UNRMN_ART.address,
      data: callData(assetId),
    })
    if (!result.data || result.data === '0x') return null
    const [svg] = decodeAbiParameters([{ type: 'string' }], result.data)
    if (!svg || !svg.includes('<svg')) return null
    cache.set(assetId, svg)
    return svg
  } catch {
    return null
  }
}

export function svgToDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
