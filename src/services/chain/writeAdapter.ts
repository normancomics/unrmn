import { appConfig, canUseFeature, getContract } from '../../config/appConfig'

export interface TransactionConfirmation {
  action: 'mint' | 'staking' | 'swap'
  walletAddress: string
  contractAddress: string
  chainName: string
  enabled: boolean
}

export function buildConfirmation(
  action: 'mint' | 'staking' | 'swap',
  walletAddress: string,
): TransactionConfirmation {
  const contractKey =
    action === 'mint' ? 'collection' : action === 'staking' ? 'stakingVault' : 'dexRouter'
  const contract = getContract(contractKey)
  const feature = action === 'mint' ? 'mint' : action === 'staking' ? 'staking' : 'swap'

  return {
    action,
    walletAddress,
    contractAddress: contract?.address || 'unconfigured',
    chainName: appConfig.chainName,
    enabled: canUseFeature(feature),
  }
}

export function assertFeatureEnabled(action: 'mint' | 'staking' | 'swap') {
  const feature = action === 'mint' ? 'mint' : action === 'staking' ? 'staking' : 'swap'
  if (!canUseFeature(feature)) {
    throw new Error(`${action} is not enabled: missing verified contract or feature flag`)
  }
}
