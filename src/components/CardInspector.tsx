import { useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { loadCardRecord, metadataJson, type CardRecord } from '../services/erc721Metadata'
import { svgToDataUri } from '../services/cardRenderer'
import { formatAmount, shortenAddress } from '../lib/format'
import { weiToEth } from '../services/utokenDesk'

export function CardInspector({ assetId }: { assetId: string }) {
  const [record, setRecord] = useState<CardRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    setRecord(null)
    setError(null)
    loadCardRecord(assetId)
      .then((next) => {
        if (live) setRecord(next)
      })
      .catch((err: unknown) => {
        if (live) setError(err instanceof Error ? err.message : 'load failed')
      })
    return () => {
      live = false
    }
  }, [assetId])

  if (error) return <p className="status warn">{error}</p>
  if (!record) return <p className="meta">Loading #{assetId} metadata…</p>

  const askEth = weiToEth(record.offerWei)
  const img = record.svg ? svgToDataUri(record.svg) : null

  return (
    <article className="card inspector">
      <div className="inspector-grid">
        <div className="card-art">
          {img ? (
            <img src={img} alt={`µNORMAN #${assetId}`} />
          ) : (
            <p className="meta">No on-chain SVG</p>
          )}
          <span className="card-art-id">#{assetId}</span>
          <span className={`card-art-badge ${record.svg ? 'onchain' : 'fallback'}`}>
            {record.source}
          </span>
        </div>
        <div>
          <h3>{record.metadata?.name || `µNORMAN #${assetId}`}</h3>
          <p className="meta">{record.metadata?.description}</p>
          <ul className="list">
            <li>Owner: {record.owner ? shortenAddress(record.owner) : '—'}</li>
            <li>
              Ask: {askEth != null ? `${formatAmount(askEth, 6)} ETH` : 'no ask \u00b7 curve floor'}
            </li>
            <li className="mono">Art {record.artContract}</li>
            <li className="mono">Token {record.tokenContract}</li>
            <li>Chain {record.chainId}</li>
          </ul>
          <div className="inline wrap">
            <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
              µToken wall
            </a>
            {record.metadata && (
              <button
                className="button"
                type="button"
                onClick={() => {
                  const blob = new Blob([metadataJson(record.metadata!)], {
                    type: 'application/json',
                  })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `unrmn-${assetId}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Download ERC-721 JSON
              </button>
            )}
          </div>
        </div>
      </div>
      {record.metadata && (
        <details className="meta-block">
          <summary>Attributes</summary>
          <ul className="list">
            {record.metadata.attributes.map((a) => (
              <li key={a.trait_type}>
                {a.trait_type}: {String(a.value)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}
