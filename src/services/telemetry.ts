type AnalyticsEvent = {
  name: string
  payload?: Record<string, string | number | boolean>
}

const EVENT_CACHE_KEY = 'unrmn.analytics-events.v1'

export function trackEvent(event: AnalyticsEvent) {
  const existing = loadCachedEvents()
  const next = [...existing, { ...event, timestamp: new Date().toISOString() }]
  localStorage.setItem(EVENT_CACHE_KEY, JSON.stringify(next.slice(-100)))
}

export function reportError(source: string, message: string) {
  trackEvent({ name: 'app_error', payload: { source, message } })
}

function loadCachedEvents() {
  try {
    const value = localStorage.getItem(EVENT_CACHE_KEY)
    return value ? (JSON.parse(value) as Array<Record<string, unknown>>) : []
  } catch {
    return []
  }
}
