import { useEffect, useState } from 'react'
import { FILE } from '../config/partners'
import { renderCardSvg, svgToDataUri } from '../services/cardRenderer'

export function CardArt({
  assetId,
  alt,
}: {
  assetId: string
  alt?: string
}) {
  const [src, setSrc] = useState<string>(FILE.logo)
  const [status, setStatus] = useState<'loading' | 'onchain' | 'fallback'>('loading')

  useEffect(() => {
    let live = true
    setStatus('loading')
    setSrc(FILE.logo)
    renderCardSvg(assetId)
      .then((svg) => {
        if (!live) return
        if (svg) {
          setSrc(svgToDataUri(svg))
          setStatus('onchain')
        } else {
          setStatus('fallback')
        }
      })
      .catch(() => {
        if (live) setStatus('fallback')
      })
    return () => {
      live = false
    }
  }, [assetId])

  return (
    <div className="card-art">
      <img src={src} alt={alt || `µNORMAN #${assetId}`} />
      <span className="card-art-id">#{assetId}</span>
      <span className={`card-art-badge ${status}`}>
        {status === 'onchain' ? 'on-chain' : status === 'loading' ? '…' : 'logo'}
      </span>
    </div>
  )
}
