import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { connectWallet } from '../services/chain/readAdapter'
import { buildCollectorSnapshot } from '../services/indexer'
import {
  loadFeedCache,
  loadPreferences,
  saveFeedCache,
  savePreferences,
  type UserPreferences,
} from '../services/persistence'
import { reportError, trackEvent } from '../services/telemetry'
import { AppStateContext } from './AppStateContext'
import type { CollectorSnapshot } from '../domain/models'

export function AppProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<CollectorSnapshot | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences)
  const [seenFeedIds, setSeenFeedIds] = useState<string[]>(loadFeedCache)

  const refreshWithWallet = useCallback(async (address: string) => {
    const nextSnapshot = await buildCollectorSnapshot(address)
    setSnapshot(nextSnapshot)
    setSeenFeedIds(nextSnapshot.feed.map((item) => item.id))
  }, [])

  const connect = useCallback(async () => {
    try {
      const address = await connectWallet()
      setWalletAddress(address)
      trackEvent({ name: 'wallet_connected', payload: { address } })
      await refreshWithWallet(address)
    } catch (error) {
      reportError('wallet_connect', error instanceof Error ? error.message : 'unknown')
    }
  }, [refreshWithWallet])

  const refresh = useCallback(async () => {
    if (!walletAddress) return
    try {
      await refreshWithWallet(walletAddress)
      trackEvent({ name: 'collector_snapshot_refreshed' })
    } catch (error) {
      reportError(
        'collector_snapshot_refresh',
        error instanceof Error ? error.message : 'unknown',
      )
    }
  }, [walletAddress, refreshWithWallet])

  const addWatchlistSymbol = useCallback(
    (symbol: string) => {
      const normalized = symbol.trim().toUpperCase()
      if (!normalized) return
      const nextWatchlist = Array.from(
        new Set([...preferences.watchlist, normalized]),
      )
      setPreferences((current) => ({ ...current, watchlist: nextWatchlist }))
    },
    [preferences.watchlist],
  )

  useEffect(() => {
    savePreferences(preferences)
  }, [preferences])

  useEffect(() => {
    saveFeedCache(seenFeedIds)
  }, [seenFeedIds])

  useEffect(() => {
    const onUnhandledError = (event: ErrorEvent) => {
      reportError('window_error', event.message)
    }

    window.addEventListener('error', onUnhandledError)
    return () => window.removeEventListener('error', onUnhandledError)
  }, [])

  const value = useMemo(
    () => ({
      walletAddress,
      snapshot,
      preferences,
      seenFeedIds,
      connect,
      refresh,
      addWatchlistSymbol,
    }),
    [walletAddress, snapshot, preferences, seenFeedIds, connect, refresh, addWatchlistSymbol],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
