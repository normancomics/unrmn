import { useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { CardArt } from '../components/CardArt'
import { useAppState } from '../state/useAppState'
import { fetchAssets, type DeskAsset } from '../services/utokenDesk'
import { shortenAddress } from '../lib/format'

export function GalleryPage() {
  const { snapshot, walletAddress } = useAppState()
  const [assets, setAssets] = useState<DeskAsset[]>([])
  const wholeTokens = Math.floor(snapshot?.tokenHoldings[0]?.balance ?? 0)

  useEffect(() => {
    fetchAssets(48).then(setAssets).catch(() => undefined)
  }, [])

  return (
    <section className="stack">
      <article className="card">
        <h2>µNORMAN layers</h2>
        <p className="meta">
          Live token ids from the µToken indexer. µToken composes each 49×49 card
          in their client from on-chain layer chunks — they do not publish a render
          URL — so the official reveal wall is embedded below and each tile links out.
        </p>
        <p className="meta">
          Your whole cards: {walletAddress ? wholeTokens : 0} · indexer rows: {assets.length}
        </p>
      </article>
      <article className="card wall-wrap">
        <p className="eyebrow">official reveal wall</p>
        <iframe className="reveal-wall" title="µNORMAN collection" src={appConfig.collectionUrl} />
      </article>
      <div className="gallery-grid">
        {assets.map((asset) => (
          <a
            key={asset.assetId}
            className="card gallery-item"
            href={appConfig.collectionUrl}
            target="_blank"
            rel="noreferrer"
          >
            <CardArt assetId={asset.assetId} />
            <h4>#{asset.assetId}</h4>
            <p className="meta">{shortenAddress(asset.owner)}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
