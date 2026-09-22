export interface YieldQuarter {
  id: string
  label: string
  start: string
  end: string
  status: 'settled' | 'open' | 'upcoming'
  note: string
}

export const QUARTERLY_RATE = 0.025

export function currentYieldQuarters(now = new Date()): YieldQuarter[] {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const currentQ = Math.floor(month / 3) + 1
  const rows: YieldQuarter[] = []
  for (let q = 1; q <= 4; q += 1) {
    const startMonth = (q - 1) * 3
    const start = new Date(Date.UTC(year, startMonth, 1))
    const end = new Date(Date.UTC(year, startMonth + 3, 0))
    let status: YieldQuarter['status'] = 'upcoming'
    if (q < currentQ) status = 'settled'
    if (q === currentQ) status = 'open'
    rows.push({
      id: `${year}-Q${q}`,
      label: `Q${q} ${year}`,
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      status,
      note:
        q === 3 && year === 2026
          ? 'First live quarter after the Aug 27 µToken launch.'
          : status === 'open'
            ? 'Snapshot at quarter close. PFP display is part of the published reward rule.'
            : status === 'settled'
              ? 'No vault was live — preview only, nothing to claim.'
              : 'Opens when the prior quarter snapshots.',
    })
  }
  return rows
}

export function previewQuarterlyYield(wholeTokens: number) {
  const eligible = wholeTokens >= 1
  return {
    eligible,
    wholeTokens,
    units: eligible ? wholeTokens * QUARTERLY_RATE : 0,
    ratePct: QUARTERLY_RATE * 100,
  }
}
