import { useState } from 'react'
import { FeatureGate } from '../components/FeatureGate'
import { UNRMN_TOKEN } from '../config/chain'
import { hybridAssets } from '../config/campaign'
import { UNISWAP_V4 } from '../config/uniswap'
import { lookupRobinhoodToken, type LookedUpToken } from '../services/tokenLookup'
import { useAppState } from '../state/useAppState'

export function StakingPage() {
  const { walletAddress } = useAppState()
  const [partner, setPartner] = useState('')
  const [lookedUp, setLookedUp] = useState<LookedUpToken | null>(null)
  const [unrmnAmount, setUnrmnAmount] = useState('1')
  const [partnerAmount, setPartnerAmount] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function resolvePartner() {
    setBusy(true)
    setError(null)
    try {
      const token = await lookupRobinhoodToken(partner.trim())
      setLookedUp(token)
    } catch (err) {
      setLookedUp(null)
      setError(err instanceof Error ? err.message : 'lookup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="stack">
      <article className="card">
        <h2>Dual-stake $uNRMN with any Robinhood token</h2>
        <FeatureGate feature="staking" title="Dual-stake hook" />
        <p className="meta">
          Resolve any ERC-20 on chain 4663, preview a v4 hook pair against $uNRMN, and
          keep the deposit button dead until a verified DualStake vault is wired.
        </p>
      </article>

      <article className="card">
        <h3>Partner token</h3>
        <div className="inline wrap">
          <input
            value={partner}
            onChange={(event) => setPartner(event.target.value)}
            placeholder="0x partner token on Robinhood Chain"
          />
          <button className="button" type="button" onClick={resolvePartner} disabled={busy}>
            {busy ? 'Looking up…' : 'Resolve on-chain'}
          </button>
        </div>
        <p className="meta">Shortcuts</p>
        <div className="inline wrap">
          {hybridAssets
            .filter((asset) => asset.address)
            .map((asset) => (
              <button
                key={asset.id}
                className="button"
                type="button"
                onClick={() => setPartner(asset.address || '')}
              >
                {asset.symbol}
              </button>
            ))}
        </div>
        {lookedUp && (
          <p className="status ok">
            {lookedUp.name} ({lookedUp.symbol}) · {lookedUp.decimals} decimals · {lookedUp.address}
          </p>
        )}
        {error && <p className="status warn">{error}</p>}
      </article>

      <article className="card">
        <h3>Deposit preview</h3>
        <div className="inline wrap">
          <label>
            $uNRMN
            <input value={unrmnAmount} onChange={(event) => setUnrmnAmount(event.target.value)} />
          </label>
          <label>
            {lookedUp?.symbol || 'partner'}
            <input
              value={partnerAmount}
              onChange={(event) => setPartnerAmount(event.target.value)}
            />
          </label>
        </div>
        <p className="meta">
          Pair: {UNRMN_TOKEN.symbol} / {lookedUp?.symbol || '???'} · wallet{' '}
          {walletAddress ?? 'not connected'}
        </p>
        <button className="button" type="button" disabled>
          Stake disabled — DualStake hook not verified
        </button>
      </article>

      <article className="card">
        <h3>v4 hook that this desk will use</h3>
        <ul className="list">
          <li>PoolManager {UNISWAP_V4.poolManager}</li>
          <li>beforeSwap — reject snipes and skim a staker fee</li>
          <li>afterAddLiquidity — mint a dual-stake receipt NFT</li>
          <li>beforeRemoveLiquidity — refuse pulls after graduation burn</li>
          <li>afterSwap — route hook fees to $uNRMN + partner stakers</li>
        </ul>
        <p className="meta">
          Spec lives in contracts/UNRMNDualStakeHook.sol. Do not send tokens to an
          unverified vault advertised as “Robinhood staking.”
        </p>
      </article>
    </section>
  )
}
