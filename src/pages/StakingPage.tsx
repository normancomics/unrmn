import { useEffect, useState } from 'react'
import { FeatureGate } from '../components/FeatureGate'
import { UNRMN_TOKEN } from '../config/chain'
import { hybridAssets } from '../config/campaign'
import { robinhoodPartners } from '../config/partners'
import { UNISWAP_V4 } from '../config/uniswap'
import { lookupRobinhoodToken, type LookedUpToken } from '../services/tokenLookup'
import { useAppState } from '../state/useAppState'
import { verifyDualStake, type DualStakeReport } from '../services/dualStakeVerify'

export function StakingPage() {
  const { walletAddress } = useAppState()
  const [partner, setPartner] = useState('')
  const [lookedUp, setLookedUp] = useState<LookedUpToken | null>(null)
  const [unrmnAmount, setUnrmnAmount] = useState('1')
  const [partnerAmount, setPartnerAmount] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [vaultInput, setVaultInput] = useState('')
  const [report, setReport] = useState<DualStakeReport | null>(null)
  const [verifying, setVerifying] = useState(false)

  async function runVerify(addr?: string) {
    setVerifying(true)
    try {
      setReport(await verifyDualStake(addr ?? vaultInput))
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    void runVerify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function resolvePartner() {
    setBusy(true)
    setError(null)
    try {
      setLookedUp(await lookupRobinhoodToken(partner.trim()))
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
        <h3>DualStake verification</h3>
        <p className="meta">
          Paste a deployed hook address or set VITE_STAKING_VAULT. Checks bytecode +
          unrmn()/partner()/graduated() against the published interface. Writes stay
          off until the address matches and VITE_ENABLE_STAKING=true.
        </p>
        <div className="inline wrap">
          <input
            value={vaultInput}
            onChange={(e) => setVaultInput(e.target.value)}
            placeholder="0x DualStake / hook address"
          />
          <button className="button" type="button" onClick={() => runVerify()} disabled={verifying}>
            {verifying ? 'Checking…' : 'Verify on-chain'}
          </button>
        </div>
        {report && (
          <>
            <p className={report.verified ? 'status ok' : 'status warn'}>
              {report.verified
                ? report.canEnableWrites
                  ? 'Structural match + flag on — writes may be enabled in appConfig.'
                  : 'Structural match. Set VITE_ENABLE_STAKING=true and mark stakingVault verified in appConfig to unlock writes.'
                : 'Not verified yet.'}
            </p>
            <ul className="list">
              {report.checks.map((check) => (
                <li key={check.key}>
                  {check.ok ? '✓' : '✗'} {check.detail}
                </li>
              ))}
            </ul>
          </>
        )}
      </article>

      <article className="card">
        <h3>Partner token</h3>
        <div className="inline wrap">
          <input
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            placeholder="0x partner token on Robinhood Chain"
          />
          <button className="button" type="button" onClick={resolvePartner} disabled={busy}>
            {busy ? 'Looking up…' : 'Resolve on-chain'}
          </button>
        </div>
        <p className="meta">Shortcuts</p>
        <div className="inline wrap">
          {robinhoodPartners.map((asset) => (
            <button key={asset.symbol} className="button" type="button" onClick={() => setPartner(asset.address)}>
              $uNRMN/{asset.symbol}
            </button>
          ))}
          {hybridAssets
            .filter((asset) => asset.address)
            .map((asset) => (
              <button key={asset.id} className="button" type="button" onClick={() => setPartner(asset.address || '')}>
                {asset.symbol}
              </button>
            ))}
        </div>
        <p className="meta">Official legs: WETH, USDG, NVDA, AAPL. Paste any other Robinhood ERC-20 address to resolve.</p>
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
            <input value={unrmnAmount} onChange={(e) => setUnrmnAmount(e.target.value)} />
          </label>
          <label>
            {lookedUp?.symbol || 'partner'}
            <input value={partnerAmount} onChange={(e) => setPartnerAmount(e.target.value)} />
          </label>
        </div>
        <p className="meta">
          Pair: {UNRMN_TOKEN.symbol} / {lookedUp?.symbol || '???'} · wallet{' '}
          {walletAddress ?? 'not connected'}
        </p>
        <button className="button" type="button" disabled={!report?.canEnableWrites}>
          {report?.canEnableWrites
            ? 'Stake (hook verified + flag on)'
            : 'Stake disabled — DualStake hook not verified'}
        </button>
      </article>

      <article className="card">
        <h3>Create a pool</h3>
        <p className="meta">
          Intended initialize: $uNRMN + resolved partner on Uniswap v4 PoolManager.
          Create stays off until the DualStake hook address is verified.
        </p>
        <button className="button" type="button" disabled>
          Create $uNRMN / {lookedUp?.symbol || 'partner'} pool — not verified
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
