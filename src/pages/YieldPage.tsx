import { FeatureGate } from '../components/FeatureGate'
import { useAppState } from '../state/AppContext'

export function YieldPage() {
  const { snapshot } = useAppState()
  return (
    <section className="stack">
      <article className="card">
        <h2>Yield + bonus view</h2>
        <FeatureGate feature="yield" title="Yield surfaces" />
        <p className="meta">
          Informational mode defaults on until verified contracts are enabled.
        </p>
      </article>
      <article className="card">
        <h3>Bonus eligibility preview</h3>
        <ul className="list">
          {snapshot?.tokenHoldings.map((token) => (
            <li key={token.symbol}>
              {token.symbol}: {token.balance.toLocaleString()} units
            </li>
          )) ?? <li>Connect wallet for token snapshot.</li>}
        </ul>
      </article>
    </section>
  )
}
