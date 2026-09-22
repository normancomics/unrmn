import { useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { FILE } from '../config/partners'
import { useAppState } from '../state/useAppState'
import { fetchAssets, type DeskAsset } from '../services/utokenDesk'
import { shortenAddress } from '../lib/format'

export function GalleryPage() {
  const { snapshot, walletAddress } = useAppState()
  const [assets, setAssets] = useState<DeskAsset[]>([])
  const wholeTokens = Math.floor(snapshot?.tokenHoldings[0]?.balance ?? 0)

  useEffect(() => {
    fetchAssets(40).then(setAssets).catch(() => undefined)
  }, [])

  return (
    <section className="stack">
      <article className="card">
        <h2>µNORMAN layers</h2>
        <p className="meta">
          Official art from the µToken collection and @uNORMANCOMICS. Cards are
          generated on-chain layer by layer; this desk shows live token ids + the
          collection gif until a pixel renderer is ported.
        </p>
        <p className="meta">
          Your whole cards: {walletAddress ? wholeTokens : 0} · revealed on indexer:{' '}
          {assets.length}
        </p>
        <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
          Open full reveal wall
        </a>
      </article>
      <div className="gallery-grid">
        {assets.map((asset) => (
          <article key={asset.assetId} className="card gallery-item">
            <img src={FILE.logo} alt={`µNORMAN #${asset.assetId}`} />
            <h4>#{asset.assetId}</h4>
            <p className="meta">{shortenAddress(asset.owner)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
