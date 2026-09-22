import { appConfig, canUseFeature, type FeatureKey } from '../config/appConfig'

export function FeatureGate({
  feature,
  title,
}: {
  feature: FeatureKey
  title: string
}) {
  const enabled = canUseFeature(feature)
  if (enabled) {
    return (
      <p className="status ok">
        {title} is enabled with verified contract wiring.
      </p>
    )
  }
  const contractStates = appConfig.contracts
    .filter((contract) => contract.feature === feature)
    .map((contract) => `${contract.label}: ${contract.state}`)
    .join(' • ')

  return (
    <div className="status warn">
      <p>
        {title} is gated: showing informational surface only until flags and contracts
        are verified.
      </p>
      <p className="meta">{contractStates || 'No contract mapping yet.'}</p>
    </div>
  )
}
