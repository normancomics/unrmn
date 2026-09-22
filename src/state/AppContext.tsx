import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { connectWallet } from '../services/chain/readAdapter'
import { buildCollectorSnapshot, buildPublicSnapshot } from '../services/indexer'
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
  const [snapshot, setSnapshot] = useState<CollectorSnapshot>(() => buildPublicSnapshot())
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences)
  const [seenFeedIds, setSeenFeedIds] = useState<string[]>(loadFeedCache)
  const [connecting, setConnecting] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const refreshWithWallet = useCallback(async (address: string) => {
    const nextSnapshot = await buildCollectorSnapshot(address)
    setSnapshot(nextSnapshot)
    setSeenFeedIds(nextSnapshot.feed.map((item) => item.id))
  }, [])

  const connect = useCallback(async () => {
    setConnecting(true)
    setLastError(null)
    try {
      const address = await connectWallet()
      setWalletAddress(address)
      trackEvent({ name: 'wallet_connected', payload: { address } })
      await refreshWithWallet(address)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown'
      setLastError(message)
      reportError('wallet_connect', message)
    } finally {
      setConnecting(false)
    }
  }, [refreshWithWallet])

  const disconnect = useCallback(() => {
    setWalletAddress(null)
    setSnapshot(buildPublicSnapshot())
    setLastError(null)
    trackEvent({ name: 'wallet_disconnected' })
  }, [])

  const refresh = useCallback(async () => {
    if (!walletAddress) {
      setSnapshot(buildPublicSnapshot())
      return
    }
    try {
      await refreshWithWallet(walletAddress)
      trackEvent({ name: 'collector_snapshot_refreshed' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown'
      setLastError(message)
      reportError('collector_snapshot_refresh', message)
    }
  }, [walletAddress, refreshWithWallet])

  const addWatchlistSymbol = useCallback((symbol: string) => {
    const normalized = symbol.trim().toUpperCase()
    if (!normalized) return
    setPreferences((current) => ({
      ...current,
      watchlist: Array.from(new Set([...current.watchlist, normalized])),
    }))
  }, [])

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
      connecting,
      lastError,
      connect,
      disconnect,
      refresh,
      addWatchlistSymbol,
    }),
    [
      walletAddress,
      snapshot,
      preferences,
      seenFeedIds,
      connecting,
      lastError,
      connect,
      disconnect,
      refresh,
      addWatchlistSymbol,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
