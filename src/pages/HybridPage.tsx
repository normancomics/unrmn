import { hybridAssets } from '../config/campaign'
import { mintClubVenues, robinhoodPartners } from '../config/partners'
import { MINT_CLUB, UNISWAP_V4 } from '../config/uniswap'

export function HybridPage() {
  return (
    <section className="stack">
      <article className="card">
        <h2>Hybrid DeFi stack</h2>
        <p className="meta">
          One collection on µToken. Sister assets on mint.club. Settlement on
          Uniswap v4 after the 9.99 ETH bond fills.
        </p>
      </article>
      {hybridAssets.map((asset) => (
        <article key={asset.id} className="card">
          <p className="eyebrow">{asset.venue} · {asset.kind}</p>
          <h3>{asset.title} ({asset.symbol})</h3>
          <p>{asset.blurb}</p>
          {asset.address && <p className="mono meta">{asset.address}</p>}
          <a className="button" href={asset.href} target="_blank" rel="noreferrer">Open venue</a>
        </article>
      ))}
      <article className="card">
        <h3>mint.club factories on Robinhood</h3>
        <ul className="list">
          <li>Token factory {MINT_CLUB.tokenFactory}</li>
          <li>Bond {MINT_CLUB.bond}</li>
          <li>Zap {MINT_CLUB.zap}</li>
        </ul>
      </article>
      <article className="card">
        <h3>mint.club sister venues</h3>
        <ul className="list">
          {mintClubVenues.map((venue) => (
            <li key={venue.symbol}>
              <a href={venue.href} target="_blank" rel="noreferrer">{venue.title}</a>{' '}
              <span className="meta">{venue.kind}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="card">
        <h3>Official Robinhood pair legs</h3>
        <ul className="list">
          {robinhoodPartners.map((token) => (
            <li key={token.symbol}>{token.symbol} · {token.address}</li>
          ))}
        </ul>
      </article>
      <article className="card">
        <h3>v4 settlement</h3>
        <p className="meta">PositionManager {UNISWAP_V4.positionManager}</p>
      </article>
    </section>
  )
}
