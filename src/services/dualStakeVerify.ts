import { inspectHook } from './hookInspection'

export type DualStakeCheck = {
  key: string
  ok: boolean
  detail: string
}

export type DualStakeReport = {
  address: string | null
  candidate: string | null
  checks: DualStakeCheck[]
  verified: boolean
  canEnableWrites: boolean
  score?: number
}

/** Back-compat wrapper around deep hook inspection. */
export async function verifyDualStake(candidate?: string | null): Promise<DualStakeReport> {
  const report = await inspectHook(candidate)
  return {
    address: report.address,
    candidate: report.address,
    checks: report.checks.map((c) => ({
      key: c.key,
      ok: c.ok,
      detail: `[${c.severity}] ${c.detail}`,
    })),
    verified: report.structuralPass,
    canEnableWrites: report.recommendEnable,
    score: report.score,
  }
}
