import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appConfig, configValidationIssues } from '../config/appConfig'
import { campaign, hybridAssets } from '../config/campaign'
import { UNRMN_TOKEN, explorerTokenUrl } from '../config/chain'
import { FILE } from '../config/partners'
import { readBondingSnapshot, type BondingSnapshot } from '../services/bonding'
import { fetchDeskToken, type DeskToken } from '../services/utokenDesk'
import { formatAmount } from '../lib/format'

export function HomePage() {
  const [bond, setBond] = useState<BondingSnapshot | null>(null)
  const [desk, setDesk] = useState<DeskToken | null>(null)

  useEffect(() => {
    let live = true
    readBondingSnapshot()
      .then((next) => {
        if (live) setBond(next)
      })
      .catch(() => undefined)
    fetchDeskToken()
      .then((next) => {
        if (live) setDesk(next)
      })
      .catch(() => undefined)
    return () => {
      live = false
    }
  }, [])

  const progressPct = Math.round((bond?.progress ?? 0) * 100)

  return (
    <section className="stack">
      <article className="hero-card">
        <img className="banner" src={FILE.banner} alt="µNORMAN" />
        <p className="eyebrow">collector desk · not another launchpad feed</p>
        <h2>{campaign.headline}</h2>
        <p>{campaign.subhead}</p>
        <p className="meta">{campaign.cardRule}</p>
        <div className="inline wrap">
          <Link className="button" to="/market">Open the book</Link>
          <Link className="button" to="/staking">Dual-stake $uNRMN</Link>
          <a className="button" href={appConfig.tradeUrl} target="_blank" rel="noreferrer">Buy on µToken</a>
        </div>
      </article>
      <article className="card">
        <h3>Bond → 9.99 ETH → v4 graduate</h3>
        <p className="meta">
          Status: {bond?.status ?? 'reading chain…'} · raised {formatAmount(bond?.raisedEth ?? 0, 4)} /{' '}
          {campaign.targetEth} ETH · {formatAmount(bond?.remainingEth ?? campaign.targetEth, 4)} ETH left
        </p>
        <div className="meter" aria-label="bonding progress">
          <div className="meter-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="meta">{progressPct}% bonded. Graduation burns the LP NFT into Uniswap v4 so the issuer cannot pull the book.</p>
        <p className="meta">Sources: {bond?.sources.join(' · ') ?? 'loading'}</p>
        <p>
          ${formatAmount(desk?.priceUsd ?? 0, 2)} · mcap ${formatAmount(desk?.marketCapUsd ?? 0, 0)} ·
          24h ${formatAmount(desk?.volume24hUsd ?? 0, 2)} · {desk?.holdersCount ?? '—'} holders
        </p>
      </article>
      <article className="card">
        <h3>Why this desk exists</h3>
        <ul className="list">
          <li>utoken.gg is optimized for the next ticker, not for finishing this one.</li>
          <li>Secondary here is a kiosk book: named cards, standing bids, no chat sludge.</li>
          <li>Hybrid DeFi joins the µToken collection with mint.club sister assets.</li>
          <li>Stake $uNRMN with any Robinhood ERC-20 once the dual-stake hook is verified.</li>
        </ul>
      </article>
      <article className="card">
        <h3>Live token</h3>
        <p>
          {UNRMN_TOKEN.name} ({UNRMN_TOKEN.symbol}) · {UNRMN_TOKEN.decimals} decimals · cap{' '}
          {UNRMN_TOKEN.totalSupply.toLocaleString()}
        </p>
        <p className="meta">
          <a href={explorerTokenUrl(UNRMN_TOKEN.address)} target="_blank" rel="noreferrer">
            {UNRMN_TOKEN.address}
          </a>
        </p>
      </article>
      <article className="card">
        <h3>Hybrid stack</h3>
        <ul className="list">
          {hybridAssets.map((asset) => (
            <li key={asset.id}>
              <a href={asset.href} target="_blank" rel="noreferrer">{asset.title}</a>{' '}
              <span className="meta">{asset.venue} · {asset.kind}</span>
              <div className="meta">{asset.blurb}</div>
            </li>
          ))}
        </ul>
      </article>
      <article className="card">
        <h3>Readiness</h3>
        {configValidationIssues.length === 0 ? (
          <p className="status ok">Every mapped contract has a real address.</p>
        ) : (
          <ul className="list">{configValidationIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
        )}
      </article>
    </section>
  )
}
