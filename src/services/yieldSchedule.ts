export interface YieldQuarter {
  id: string
  label: string
  start: string
  end: string
  status: 'settled' | 'open' | 'upcoming' | 'pre-yield'
  note: string
}

export const QUARTERLY_RATE = 0.025
export const YIELD_OPENS_AT = Date.UTC(2026, 9, 1)

export function yieldHasOpened(now = new Date()) {
  return now.getTime() >= YIELD_OPENS_AT
}

export function currentYieldQuarters(now = new Date()): YieldQuarter[] {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const currentQ = Math.floor(month / 3) + 1
  const opened = yieldHasOpened(now)
  const rows: YieldQuarter[] = []

  for (let q = 1; q <= 4; q += 1) {
    const startMonth = (q - 1) * 3
    const start = new Date(Date.UTC(year, startMonth, 1))
    const end = new Date(Date.UTC(year, startMonth + 3, 0))
    const isFirstLive = year === 2026 && q === 4
    let status: YieldQuarter['status'] = 'upcoming'

    if (year === 2026 && q < 4) {
      status = 'pre-yield'
    } else if (isFirstLive && !opened) {
      status = 'upcoming'
    } else if (q < currentQ) {
      status = 'settled'
    } else if (q === currentQ && opened) {
      status = 'open'
    }

    rows.push({
      id: `${year}-Q${q}`,
      label: `Q${q} ${year}`,
      start: isFirstLive ? '2026-10-01' : start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      status,
      note: isFirstLive
        ? opened
          ? 'First live yield quarter. Snapshot at year close. PFP display is part of the published rule.'
          : 'Yield does not start until October 1, 2026.'
        : status === 'pre-yield'
          ? 'Before the Oct 1 start. No snapshot, no claim.'
          : status === 'open'
            ? 'Snapshot at quarter close. PFP display is part of the published reward rule.'
            : status === 'settled'
              ? 'Closed quarter.'
              : 'Opens when the prior quarter snapshots.',
    })
  }

  return rows
}

export function previewQuarterlyYield(wholeTokens: number, now = new Date()) {
  const eligible = yieldHasOpened(now) && wholeTokens >= 1
  return {
    eligible,
    opened: yieldHasOpened(now),
    wholeTokens,
    units: eligible ? wholeTokens * QUARTERLY_RATE : 0,
    ratePct: QUARTERLY_RATE * 100,
  }
}
