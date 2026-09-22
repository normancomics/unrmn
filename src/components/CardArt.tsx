import { FILE } from '../config/partners'

export function CardArt({
  assetId,
  alt,
}: {
  assetId: string
  alt?: string
}) {
  return (
    <div className="card-art">
      <img src={FILE.logo} alt={alt || `µNORMAN #${assetId}`} />
      <span className="card-art-id">#{assetId}</span>
    </div>
  )
}
