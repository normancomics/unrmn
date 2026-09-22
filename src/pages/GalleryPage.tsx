import { useAppState } from '../state/AppContext'

export function GalleryPage() {
  const { snapshot } = useAppState()
  const nftHoldings = snapshot?.nftHoldings ?? []

  return (
    <section className="stack">
      <article className="card">
        <h2>NFT holdings/gallery</h2>
        <p className="meta">
          Collection-centric, owner-centric, and token-level read-only views.
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
            <p>Connect wallet to render holdings.</p>
          </article>
        )}
      </div>
    </section>
  )
}
