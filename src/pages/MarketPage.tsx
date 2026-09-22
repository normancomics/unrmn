import { useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import { FILE } from '../config/partners'
import { UNISWAP_V4 } from '../config/uniswap'
import { tap } from '../lib/sound'
import { formatAmount, shortenAddress } from '../lib/format'
import {
  fetchAssets,
  fetchDeskToken,
  fetchRegistry,
  fileUrl,
  weiToEth,
  type DeskAsset,
  type DeskToken,
} from '../services/utokenDesk'
import { readActivityFeed, type ActivityItem } from '../services/activityFeed'
import { CardArt } from '../components/CardArt'

export function MarketPage() {
  const [tab, setTab] = useState<'kiosk' | 'registry' | 'tape'>('kiosk')
  const [token, setToken] = useState<DeskToken | null>(null)
  const [assets, setAssets] = useState<DeskAsset[]>([])
  const [registry, setRegistry] = useState<DeskToken[]>([])
  const [tape, setTape] = useState<ActivityItem[]>([])

  useEffect(() => {
    fetchDeskToken().then(setToken).catch(() => undefined)
    fetchAssets(32).then(setAssets).catch(() => undefined)
    fetchRegistry(48).then(setRegistry).catch(() => undefined)
    readActivityFeed().then(setTape).catch(() => undefined)
  }, [])

  const floorUsd = token?.priceUsd ?? 0
  const floorEth = token?.priceQuote ?? 0
  const listed = assets.filter((asset) => asset.offerWei)
  const rows = listed.length ? listed : assets.map((asset) => ({ ...asset, offerWei: null }))

  return (
    <section className="stack">
      <article className="card">
        <img className="banner" src={FILE.banner} alt="µNORMAN banner" />
        <h2>Kiosk + registry</h2>
        <p className="meta">
          Live µToken price is the card implied floor: 1 card = 1 $uNRMN. Asks use
          offerWei when a holder posted one; otherwise the book shows the curve print.
        </p>
        <p>
          ${formatAmount(floorUsd, 2)} · {formatAmount(floorEth, 6)} ETH · 24h $
          {formatAmount(token?.volume24hUsd ?? 0, 2)} · {token?.holdersCount ?? '—'} holders
        </p>
        <div className="inline wrap">
          <button className="button" type="button" onClick={() => { setTab('kiosk'); tap('open') }}>Card kiosk</button>
          <button className="button" type="button" onClick={() => { setTab('registry'); tap('open') }}>All µToken collections</button>
          <button className="button" type="button" onClick={() => { setTab('tape'); tap('open') }}>Prints</button>
          <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">Official collection</a>
        </div>
      </article>
      {tab === 'kiosk' && (
        <article className="card">
          <table className="matrix">
            <thead><tr><th>Card</th><th>Owner</th><th>Ask ETH</th><th>Implied USD</th><th>Venue</th></tr></thead>
            <tbody>
              {rows.map((row) => {
                const ask = weiToEth(row.offerWei)
                return (
                  <tr key={row.assetId}>
                    <td>
                      <div className="kiosk-thumb">
                        <CardArt assetId={row.assetId} />
                        <span>#{row.assetId}</span>
                      </div>
                    </td>
                    <td>{shortenAddress(row.owner)}</td>
                    <td>{ask != null ? formatAmount(ask, 5) : formatAmount(floorEth, 5)}</td>
                    <td>{ask != null ? formatAmount(ask * (floorUsd / Math.max(floorEth, 1e-12)), 2) : formatAmount(floorUsd, 2)}</td>
                    <td>{ask != null ? 'posted offer' : 'curve floor'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </article>
      )}
      {tab === 'registry' && (
        <article className="card">
          <table className="matrix">
            <thead><tr><th></th><th>Token</th><th>USD</th><th>24h</th><th>Bond</th></tr></thead>
            <tbody>
              {registry.map((item) => (
                <tr key={item.id}>
                  <td>{item.logoUrl ? <img className="tiny" src={fileUrl(item.logoUrl) || ''} alt="" /> : null}</td>
                  <td><a href={`https://utoken.gg/token/${item.slug || item.address}`} target="_blank" rel="noreferrer">{item.symbol}</a></td>
                  <td>${formatAmount(item.priceUsd || 0, 4)}</td>
                  <td>${formatAmount(item.volume24hUsd || 0, 0)}</td>
                  <td>{Math.round((item.bondingProgress || 0) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      )}
      {tab === 'tape' && (
        <article className="card">
          <ul className="list">
            {tape.map((item) => (
              <li key={item.id}>{item.side} {formatAmount(item.amount, 2)} $uNRMN · {shortenAddress(item.maker)}</li>
            ))}
          </ul>
          <p className="meta">PoolManager {UNISWAP_V4.poolManager}</p>
        </article>
      )}
    </section>
  )
}
