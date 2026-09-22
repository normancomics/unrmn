import { useState } from 'react'
import { FeatureGate } from '../components/FeatureGate'
import { buildConfirmation } from '../services/chain/writeAdapter'
import { useAppState } from '../state/useAppState'

export function StakingPage() {
  const { walletAddress } = useAppState()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const confirmation = walletAddress
    ? buildConfirmation('staking', walletAddress)
    : null

  return (
    <section className="stack">
      <article className="card">
        <h2>Staking entry points</h2>
        <FeatureGate feature="staking" title="Staking" />
        <button
          className="button"
          type="button"
          disabled={!walletAddress}
          onClick={() => setShowConfirmation((current) => !current)}
        >
          Preview confirmation
        </button>
      </article>

      {showConfirmation && confirmation && (
        <article className="card">
          <h3>Transaction confirmation preview</h3>
          <p>Action: {confirmation.action}</p>
          <p>Network: {confirmation.chainName}</p>
          <p>Wallet: {confirmation.walletAddress}</p>
          <p>Contract: {confirmation.contractAddress}</p>
        </article>
      )}
    </section>
  )
}
