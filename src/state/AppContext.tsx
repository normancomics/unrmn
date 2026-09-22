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
    const address = await connectWallet()
    setWalletAddress(address)
    await refreshWithWallet(address)
  }

  async function refresh() {
    if (!walletAddress) return
    await refreshWithWallet(walletAddress)
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
