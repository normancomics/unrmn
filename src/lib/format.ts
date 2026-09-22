export function shortenAddress(address: string, size = 4) {
  if (address.length < size * 2 + 2) return address
  return `${address.slice(0, size + 2)}…${address.slice(-size)}`
}

export function formatAmount(value: number, digits = 4) {
  if (!Number.isFinite(value)) return '0'
  if (value === 0) return '0'
  if (value >= 1_000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return value.toLocaleString(undefined, { maximumFractionDigits: digits })
}
