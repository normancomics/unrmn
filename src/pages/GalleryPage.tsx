import { useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { CardArt } from '../components/CardArt'
import { useAppState } from '../state/useAppState'
import { fetchAssets, type DeskAsset } from '../services/utokenDesk'
import { shortenAddress } from '../lib/format'

export function GalleryPage() {
  const { snapshot, walletAddress } = useAppState()
  const [assets, setAssets] = useState<DeskAsset[]>([])
  const [wallFailed, setWallFailed] = useState(false)
  const wholeTokens = Math.floor(snapshot?.tokenHoldings[0]?.balance ?? 0)

  useEffect(() => {
    fetchAssets(48).then(setAssets).catch(() => undefined)
  }, [])

  return (
    <section className="stack">
      <article className="card">
        <h2>µNORMAN layers</h2>
        <p className="meta">
          Live token ids from the µToken indexer. µToken composes each 49×49 card in
          their client from on-chain layer chunks and does not publish a public render
          URL, so the official reveal wall is embedded when the browser allows it.
        </p>
        <p className="meta">
          Your whole cards: {walletAddress ? wholeTokens : 0} · indexer rows: {assets.length}
        </p>
        <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
          Open full reveal wall
        </a>
      </article>

      <article className="card wall-wrap">
        <p className="eyebrow">official reveal wall</p>
        {wallFailed ? (
          <p className="status warn">
            Embed blocked by the host. Use the button above to open the live wall on µToken.
          </p>
        ) : (
          <iframe
            className="reveal-wall"
            title="µNORMAN collection"
            src={appConfig.collectionUrl}
            onError={() => setWallFailed(true)}
          />
        )}
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
        {assets.length === 0 && (
          <article className="card">
            <p>Indexer hydrating… or CORS is blocking the asset list outside the Vite proxy.</p>
          </article>
        )}
      </div>
    </section>
  )
}
