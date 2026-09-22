export interface UserPreferences {
  theme: 'dark' | 'light'
  watchlist: string[]
}

const PREFERENCES_KEY = 'unrmn.preferences.v1'
const FEED_CACHE_KEY = 'unrmn.feed-cache.v1'

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  watchlist: ['uNRMN'],
}

export function loadPreferences(): UserPreferences {
  try {
    const value = localStorage.getItem(PREFERENCES_KEY)
    if (!value) return defaultPreferences
    const parsed = JSON.parse(value) as UserPreferences
    return {
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : ['uNRMN'],
    }
  } catch {
    return defaultPreferences
  }
}

export function savePreferences(preferences: UserPreferences) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
}

export function loadFeedCache() {
  try {
    const value = localStorage.getItem(FEED_CACHE_KEY)
    if (!value) return []
    return JSON.parse(value) as string[]
  } catch {
    return []
  }
}

export function saveFeedCache(feedIds: string[]) {
  localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(feedIds))
}
