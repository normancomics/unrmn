import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CollectorSnapshot } from '../domain/models'
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

interface AppState {
  walletAddress: string | null
  snapshot: CollectorSnapshot | null
  preferences: UserPreferences
  seenFeedIds: string[]
  connect: () => Promise<void>
  refresh: () => Promise<void>
  addWatchlistSymbol: (symbol: string) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<CollectorSnapshot | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences)
  const [seenFeedIds, setSeenFeedIds] = useState<string[]>(loadFeedCache)

  async function refreshWithWallet(address: string) {
    const nextSnapshot = await buildCollectorSnapshot(address)
    setSnapshot(nextSnapshot)
    setSeenFeedIds(nextSnapshot.feed.map((item) => item.id))
  }

  async function connect() {
    try {
      const address = await connectWallet()
      setWalletAddress(address)
      trackEvent({ name: 'wallet_connected', payload: { address } })
      await refreshWithWallet(address)
    } catch (error) {
      reportError('wallet_connect', error instanceof Error ? error.message : 'unknown')
    }
  }

  async function refresh() {
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
  }

  function addWatchlistSymbol(symbol: string) {
    const normalized = symbol.trim().toUpperCase()
    if (!normalized) return
    const nextWatchlist = Array.from(new Set([...preferences.watchlist, normalized]))
    setPreferences((current) => ({ ...current, watchlist: nextWatchlist }))
  }

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
    [walletAddress, snapshot, preferences, seenFeedIds],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider')
  }
  return context
}
