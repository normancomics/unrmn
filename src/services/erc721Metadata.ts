import { UNRMN_ART } from '../config/art'
import { UNRMN_TOKEN } from '../config/chain'
import { appConfig } from '../config/appConfig'
import { renderCardSvg, svgToDataUri } from './cardRenderer'
import { fetchAssets, type DeskAsset } from './utokenDesk'

/** OpenSea / ERC-721 metadata shape (synthetic — µToken has no public tokenURI). */
export type CardMetadata = {
  name: string
  description: string
  image: string
  external_url: string
  background_color: string
  attributes: Array<{ trait_type: string; value: string | number }>
  animation_url?: string
}

export type CardRecord = {
  assetId: string
  owner: string | null
  offerWei: string | null
  mintTx: string | null
  svg: string | null
  metadata: CardMetadata | null
  artContract: string
  tokenContract: string
  chainId: number
  source: 'on-chain-svg+indexer' | 'indexer-only' | 'empty'
}

function buildMetadata(assetId: string, svg: string | null, asset?: DeskAsset | null): CardMetadata {
  const image = svg ? svgToDataUri(svg) : ''
  const attrs: CardMetadata['attributes'] = [
    { trait_type: 'Collection', value: 'µNORMAN' },
    { trait_type: 'Token', value: UNRMN_TOKEN.symbol },
    { trait_type: 'Asset ID', value: assetId },
    { trait_type: 'Canvas', value: `${UNRMN_ART.canvas}×${UNRMN_ART.canvas}` },
    { trait_type: 'Renderer', value: 'on-chain SVG (µToken art store)' },
  ]
  if (asset?.owner) attrs.push({ trait_type: 'Owner', value: asset.owner })
  if (asset?.offerWei) attrs.push({ trait_type: 'Ask wei', value: asset.offerWei })
  if (asset?.mintTx) attrs.push({ trait_type: 'Mint tx', value: asset.mintTx })

  return {
    name: `µNORMAN #${assetId}`,
    description:
      'Hybrid-DeFi generative pixel card from the µNORMAN collection on Robinhood Chain. ' +
      '1 whole $uNRMN = 1 card. Image is the official on-chain SVG from the µToken art store; ' +
      'this JSON is composed by the collector desk because µToken does not expose tokenURI.',
    image,
    external_url: appConfig.collectionUrl,
    background_color: '1a1c2c',
    attributes: attrs,
  }
}

/** Load a card: indexer row + on-chain SVG + synthetic ERC-721 metadata. */
export async function loadCardRecord(assetId: string): Promise<CardRecord> {
  const [svg, assets] = await Promise.all([
    renderCardSvg(assetId),
    fetchAssets(64).catch(() => [] as DeskAsset[]),
  ])
  const asset = assets.find((a) => a.assetId === assetId) || null
  const metadata = svg || asset ? buildMetadata(assetId, svg, asset) : null
  return {
    assetId,
    owner: asset?.owner ?? null,
    offerWei: asset?.offerWei ?? null,
    mintTx: asset?.mintTx ?? null,
    svg,
    metadata,
    artContract: UNRMN_ART.address,
    tokenContract: UNRMN_TOKEN.address,
    chainId: appConfig.chainId,
    source: svg ? 'on-chain-svg+indexer' : asset ? 'indexer-only' : 'empty',
  }
}

export function metadataJson(meta: CardMetadata) {
  return JSON.stringify(meta, null, 2)
}
