import { appConfig, canUseFeature } from '../../config/appConfig'

export interface TransactionConfirmation {
  action: 'mint' | 'staking' | 'swap'
  walletAddress: string
  contractAddress: string
  chainName: string
}

export function buildConfirmation(
  action: 'mint' | 'staking' | 'swap',
  walletAddress: string,
): TransactionConfirmation {
  const contractKey = action === 'mint' ? 'collection' : action === 'staking' ? 'stakingVault' : 'dexRouter'
  const contractAddress =
    appConfig.contracts.find((contract) => contract.key === contractKey)?.address ||
    'unconfigured'
  return {
    action,
    walletAddress,
    contractAddress,
    chainName: appConfig.chainName,
  }
}

export function assertFeatureEnabled(action: 'mint' | 'staking' | 'swap') {
  const feature = action === 'mint' ? 'mint' : action === 'staking' ? 'staking' : 'swap'
  if (!canUseFeature(feature)) {
    throw new Error(
      `${action} is not enabled: missing verified contract or feature flag`,
    )
  }
}
