import { FeatureGate } from '../components/FeatureGate'
import { useAppState } from '../state/useAppState'
import { formatAmount } from '../lib/format'

export function YieldPage() {
  const { snapshot } = useAppState()
  return (
    <section className="stack">
      <article className="card">
        <h2>Yield + bonus view</h2>
        <FeatureGate feature="yield" title="Yield surfaces" />
        <p className="meta">
          Informational mode only. No vault address is verified, so nothing here
          can send a transaction.
        </p>
      </article>
      <article className="card">
        <h3>Bonus eligibility preview</h3>
        <ul className="list">
          {snapshot?.tokenHoldings.length ? (
            snapshot.tokenHoldings.map((token) => (
              <li key={token.symbol}>
                {token.symbol}: {formatAmount(token.balance)} held
              </li>
            ))
          ) : (
            <li>Connect wallet for token snapshot.</li>
          )}
        </ul>
      </article>
    </section>
  )
}
