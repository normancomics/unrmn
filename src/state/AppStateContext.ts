import { createContext } from 'react'
import type { CollectorSnapshot } from '../domain/models'
import type { UserPreferences } from '../services/persistence'

export interface AppState {
  walletAddress: string | null
  snapshot: CollectorSnapshot | null
  preferences: UserPreferences
  seenFeedIds: string[]
  connecting: boolean
  lastError: string | null
  connect: () => Promise<void>
  disconnect: () => void
  refresh: () => Promise<void>
  addWatchlistSymbol: (symbol: string) => void
}

export const AppStateContext = createContext<AppState | undefined>(undefined)
