import { useAppState } from '../state/useAppState'
import { appConfig } from '../config/appConfig'

export function GalleryPage() {
  const { snapshot, walletAddress } = useAppState()
  const nftHoldings = snapshot?.nftHoldings ?? []
  const wholeTokens = Math.floor(snapshot?.tokenHoldings[0]?.balance ?? 0)

  return (
    <section className="stack">
      <article className="card">
        <h2>NFT holdings / gallery</h2>
        <p className="meta">
          µToken mints one card per whole $uNRMN. This gallery renders local card
          slots from on-chain balance until a dedicated metadata indexer is wired.
        </p>
        <p className="meta">
          Whole cards inferred: {walletAddress ? wholeTokens : 0}
        </p>
      </article>
      <div className="gallery-grid">
        {nftHoldings.map((item) => (
          <article key={item.id} className="card gallery-item">
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p className="meta">{item.collection}</p>
            <p className="meta">{item.traits.join(' • ')}</p>
          </article>
        ))}
        {nftHoldings.length === 0 && (
          <article className="card">
            <p>Connect a wallet that holds whole $uNRMN to render card slots.</p>
            <p className="meta">
              Official art layers live on{' '}
              <a href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
                utoken.gg/collection/unrmn
              </a>
              .
            </p>
          </article>
        )}
      </div>
    </section>
  )
}
