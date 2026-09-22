import { useEffect, useState } from 'react'
import { UTOKEN } from '../config/utoken'
import { readActivityFeed, type ActivityItem } from '../services/activityFeed'
import { formatAmount, shortenAddress } from '../lib/format'

function label(item: ActivityItem) {
  const amt = formatAmount(item.amount, 2)
  const who = shortenAddress(item.maker)
  if (item.side === 'BUY') return `BUY ${amt} $uNRMN by ${who}`
  if (item.side === 'SELL') return `SELL ${amt} $uNRMN by ${who}`
  return `SEND ${amt} $uNRMN from ${who}`
}

export function LiveTicker() {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    const load = () => {
      readActivityFeed()
        .then((next) => {
          if (!live) return
          setItems(next)
          setError(next.length ? null : 'waiting on first $uNRMN print')
        })
        .catch((err: unknown) => {
          if (!live) return
          setError(err instanceof Error ? err.message : 'feed failed')
        })
    }
    load()
    const timer = window.setInterval(load, 20000)
    return () => {
      live = false
      window.clearInterval(timer)
    }
  }, [])

  const tape = items.length ? [...items, ...items] : []

  return (
    <div className="ticker" aria-label="live $uNRMN tape">
      <a className="ticker-source" href={UTOKEN.tokenPage} target="_blank" rel="noreferrer">
        LIVE $uNRMN
      </a>
      <div className="ticker-window">
        {tape.length ? (
          <div className="ticker-track">
            {tape.map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                className={`ticker-item ${item.side.toLowerCase()}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {label(item)}
                {item.usd != null ? ` · $${item.usd.toFixed(2)}` : ''}
              </a>
            ))}
          </div>
        ) : (
          <p className="ticker-empty">{error ?? 'loading tape…'}</p>
        )}
      </div>
    </div>
  )
}
