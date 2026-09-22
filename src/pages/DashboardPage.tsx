import { useState } from 'react'
import { useAppState } from '../state/useAppState'
import { formatAmount, shortenAddress } from '../lib/format'
import { explorerAddressUrl, explorerTokenUrl } from '../config/chain'

export function DashboardPage() {
  const { walletAddress, snapshot, preferences, addWatchlistSymbol, refresh, connect } =
    useAppState()
  const [watchSymbol, setWatchSymbol] = useState('')

  return (
    <section className="stack">
      <article className="card">
        <h2>Collector dashboard</h2>
        {walletAddress ? (
          <>
            <p className="meta">
              Wallet{' '}
              <a href={explorerAddressUrl(walletAddress)} target="_blank" rel="noreferrer">
                {shortenAddress(walletAddress)}
              </a>{' '}
              • {snapshot?.profile.displayName} • ETH {formatAmount(snapshot?.profile.ethBalance ?? 0)}
            </p>
            <p className="meta">Roles: {snapshot?.profile.roles.join(', ') || 'none'}</p>
            <button className="button" type="button" onClick={refresh}>
              Refresh indexed data
            </button>
          </>
        ) : (
          <>
            <p className="meta">Connect a wallet on Robinhood Chain to hydrate holdings.</p>
            <button className="button" type="button" onClick={connect}>
              Connect wallet
            </button>
          </>
        )}
      </article>

      <article className="card">
        <h3>Token holdings</h3>
        {snapshot?.tokenHoldings.length ? (
          <ul className="list">
            {snapshot.tokenHoldings.map((token) => (
              <li key={token.symbol}>
                <a href={explorerTokenUrl(token.address)} target="_blank" rel="noreferrer">
                  {token.name} ({token.symbol})
                </a>
                : {formatAmount(token.balance)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="meta">No token snapshot yet.</p>
        )}
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
