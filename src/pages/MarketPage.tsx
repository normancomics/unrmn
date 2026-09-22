import { useMemo, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { campaign } from '../config/campaign'
import { UNISWAP_V4 } from '../config/uniswap'
import { seedMarketBook } from '../services/marketBook'
import { useAppState } from '../state/useAppState'

export function MarketPage() {
  const { snapshot, walletAddress } = useAppState()
  const [tab, setTab] = useState<'book' | 'v4'>('book')
  const listings = useMemo(
    () => seedMarketBook(snapshot?.nftHoldings ?? []),
    [snapshot?.nftHoldings],
  )

  return (
    <section className="stack">
      <article className="card">
        <h2>Collector book</h2>
        <p className="meta">
          Cleaner than the launchpad grid. Named cards. Standing bids. Curve until{' '}
          {campaign.targetEth} ETH, then Uniswap v4 with burned LP.
        </p>
        <div className="inline">
          <button className="button" type="button" onClick={() => setTab('book')}>
            Card book
          </button>
          <button className="button" type="button" onClick={() => setTab('v4')}>
            v4 rails
          </button>
          <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
            Official collection
          </a>
        </div>
      </article>

      {tab === 'book' ? (
        <article className="card">
          <table className="matrix">
            <thead>
              <tr>
                <th>Side</th>
                <th>Item</th>
                <th>ETH</th>
                <th>Maker</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((row) => (
                <tr key={row.id}>
                  <td>{row.side}</td>
                  <td>{row.item}</td>
                  <td>{row.priceEth}</td>
                  <td>{row.maker}</td>
                  <td>{row.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {listings.length === 0 && (
            <p className="meta">Connect a wallet that holds whole cards to seed personal asks.</p>
          )}
          <p className="meta">
            {walletAddress
              ? 'Asks above are previews from your inferred card slots.'
              : 'Guest book shows standing bids only.'}
          </p>
        </article>
      ) : (
        <article className="card">
          <h3>Uniswap v4 after graduation</h3>
          <ul className="list">
            <li>PoolManager {UNISWAP_V4.poolManager}</li>
            <li>PositionManager {UNISWAP_V4.positionManager}</li>
            <li>Universal Router {UNISWAP_V4.universalRouter}</li>
          </ul>
          <p className="meta">
            Hook plan: beforeSwap anti-snipe while bonding, afterSwap fee split to dual-stakers,
            beforeRemoveLiquidity refuse LP pulls, graduation mints the position NFT to burn.
          </p>
        </article>
      )}
    </section>
  )
}
