import { useAppState } from '../state/AppContext'

export function CommunityPage() {
  const { snapshot, seenFeedIds } = useAppState()
  const feed = snapshot?.feed ?? []

  return (
    <section className="stack">
      <article className="card">
        <h2>Community feed</h2>
        <p className="meta">
          X + Telegram + onchain activity aggregation with local cache tracking.
        </p>
        <p className="meta">Cached feed ids: {seenFeedIds.join(', ') || 'none'}</p>
      </article>
      <div className="stack">
        {feed.map((item) => (
          <article key={item.id} className="card">
            <h4>{item.title}</h4>
            <p>{item.summary}</p>
            <p className="meta">
              {item.source} • {new Date(item.timestamp).toLocaleString()}
            </p>
            <a href={item.href} target="_blank" rel="noreferrer">
              Open source
            </a>
          </article>
        ))}
        {feed.length === 0 && <article className="card">Connect wallet to hydrate feed.</article>}
      </div>
    </section>
  )
}
