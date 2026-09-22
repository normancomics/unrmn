import { useState } from 'react'
import { FeatureGate } from '../components/FeatureGate'
import { buildConfirmation } from '../services/chain/writeAdapter'
import { useAppState } from '../state/useAppState'
import { appConfig } from '../config/appConfig'

export function DexPage() {
  const { walletAddress } = useAppState()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const confirmation = walletAddress ? buildConfirmation('swap', walletAddress) : null

  return (
    <section className="stack">
      <article className="card">
        <h2>Robinhood Chain DEX surface</h2>
        <FeatureGate feature="swap" title="DEX routing" />
        <p className="meta">
          In-app routing stays gated. Live market is on µToken until a verified
          router is added to config.
        </p>
        <div className="inline">
          <input value="uNRMN" readOnly />
          <span>→</span>
          <input value="ETH" readOnly />
        </div>
        <div className="inline">
          <a className="button" href={appConfig.tradeUrl} target="_blank" rel="noreferrer">
            Open µToken market
          </a>
          <button
            className="button"
            type="button"
            disabled={!walletAddress}
            onClick={() => setShowConfirmation((current) => !current)}
          >
            Preview swap confirmation
          </button>
        </div>
      </article>
      {showConfirmation && confirmation && (
        <article className="card">
          <h3>Transaction confirmation preview</h3>
          <p>Action: {confirmation.action}</p>
          <p>Network: {confirmation.chainName}</p>
          <p>Wallet: {confirmation.walletAddress}</p>
          <p>Contract: {confirmation.contractAddress}</p>
          <p className="meta">
            {confirmation.enabled
              ? 'Feature flag + verified router are both set.'
              : 'Blocked: no verified DEX router.'}
          </p>
        </article>
      )}
    </section>
  )
}
