import { useState } from 'react'
import { useAppState } from '../state/AppContext'

export function DashboardPage() {
  const { walletAddress, snapshot, preferences, addWatchlistSymbol, refresh } =
    useAppState()
  const [watchSymbol, setWatchSymbol] = useState('')

  return (
    <section className="stack">
      <article className="card">
        <h2>Collector dashboard</h2>
        <p className="meta">
          Wallet: {walletAddress ?? 'Not connected'} • NFTs:{' '}
          {snapshot?.nftHoldings.length ?? 0} • Tokens:{' '}
          {snapshot?.tokenHoldings.length ?? 0}
        </p>
        <button className="button" type="button" onClick={refresh}>
          Refresh indexed data
        </button>
      </article>

      <article className="card">
        <h3>Watchlist (persisted)</h3>
        <div className="inline">
          <input
            value={watchSymbol}
            onChange={(event) => setWatchSymbol(event.target.value)}
            placeholder="Add symbol"
          />
          <button
            className="button"
            type="button"
            onClick={() => {
              addWatchlistSymbol(watchSymbol)
              setWatchSymbol('')
            }}
          >
            Add
          </button>
        </div>
        <ul className="list">
          {preferences.watchlist.map((symbol) => (
            <li key={symbol}>{symbol}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}
