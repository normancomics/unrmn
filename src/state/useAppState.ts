import { useContext } from 'react'
import { AppStateContext } from './AppStateContext'

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider')
  }
  return context
}
