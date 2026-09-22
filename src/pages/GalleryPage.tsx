import { useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { CardArt } from '../components/CardArt'
import { CardInspector } from '../components/CardInspector'
import { useAppState } from '../state/useAppState'
import { fetchAssets, type DeskAsset } from '../services/utokenDesk'
import { shortenAddress } from '../lib/format'

export function GalleryPage() {
  const { snapshot, walletAddress } = useAppState()
  const [assets, setAssets] = useState<DeskAsset[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [wallFailed, setWallFailed] = useState(false)
  const wholeTokens = Math.floor(snapshot?.tokenHoldings[0]?.balance ?? 0)

  useEffect(() => {
    fetchAssets(48)
      .then((rows) => {
        setAssets(rows)
        if (rows[0] && !selected) setSelected(rows[0].assetId)
      })
      .catch(() => undefined)
  }, [])

  return (
    <section className="stack">
      <article className="card">
        <h2>µNORMAN layers</h2>
        <p className="meta">
          Cards render from the µToken art store on-chain SVG (selector 0xeb3fbd83). ERC-721
          metadata is composed by this desk — µToken does not publish tokenURI.
        </p>
        <p className="meta">
          Your whole cards: {walletAddress ? wholeTokens : 0} · indexer rows: {assets.length}
        </p>
        <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
          Open full reveal wall
        </a>
      </article>

      {selected && <CardInspector assetId={selected} />}

      <article className="card wall-wrap">
        <p className="eyebrow">official reveal wall</p>
        {wallFailed ? (
          <p className="status warn">Embed blocked. Use the button above.</p>
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
          <button
            key={asset.assetId}
            type="button"
            className={`card gallery-item ${selected === asset.assetId ? 'selected' : ''}`}
            onClick={() => setSelected(asset.assetId)}
          >
            <CardArt assetId={asset.assetId} />
            <h4>#{asset.assetId}</h4>
            <p className="meta">{shortenAddress(asset.owner)}</p>
          </button>
        ))}
        {assets.length === 0 && (
          <article className="card">
            <p>Indexer hydrating… or CORS is blocking assets outside the Vite proxy.</p>
          </article>
        )}
      </div>
    </section>
  )
}
