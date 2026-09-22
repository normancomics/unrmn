import { FeatureGate } from '../components/FeatureGate'
import { useAppState } from '../state/useAppState'
import { formatAmount } from '../lib/format'
import { currentYieldQuarters, previewQuarterlyYield } from '../services/yieldSchedule'

export function YieldPage() {
  const { snapshot, walletAddress } = useAppState()
  const held = snapshot?.tokenHoldings[0]?.balance ?? 0
  const whole = Math.floor(held)
  const preview = previewQuarterlyYield(whole)
  const quarters = currentYieldQuarters()

  return (
    <section className="stack">
      <article className="card">
        <h2>Quarterly collector yield</h2>
        <FeatureGate feature="yield" title="Yield vault" />
        <p className="meta">
          Published rule from the µToken listing: hodlers earn quarterly yield for
          displaying µNORMAN cards as social PFPs. This desk previews the schedule.
          It cannot pay until a verified vault exists.
        </p>
      </article>

      <article className="card">
        <h3>This quarter</h3>
        <p>
          Wallet {walletAddress ? 'connected' : 'not connected'} · {formatAmount(held, 4)} $uNRMN ·{' '}
          {whole} whole cards
        </p>
        {preview.eligible ? (
          <p className="status ok">
            Eligible preview: {formatAmount(preview.units, 4)} collector units at {preview.ratePct}% of
            whole cards. Claim stays disabled.
          </p>
        ) : (
          <p className="status warn">
            Need at least 1 whole $uNRMN / 1 revealed card to enter the quarter snapshot.
          </p>
        )}
        <ul className="list">
          <li>Whole token held at quarter close</li>
          <li>PFP display on X / socials (self-attested until a vault can prove it)</li>
          <li>Bonus stack: NFTs, tokens, original art, merch — not a phony APY vault</li>
        </ul>
      </article>

      <article className="card">
        <h3>2026 board</h3>
        <table className="matrix">
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Window</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {quarters.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                <td>
                  {row.start} → {row.end}
                </td>
                <td>{row.status}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="button" type="button" disabled>
          Claim disabled — no yield vault mapped
        </button>
      </article>
    </section>
  )
}
