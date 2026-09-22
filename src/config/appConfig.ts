export type AppEnvironment = 'development' | 'staging' | 'production'
export type FeatureKey = 'mint' | 'staking' | 'swap' | 'yield'
export type VerificationState = 'verified' | 'informational' | 'disabled'

type FeatureConfig = Record<FeatureKey, boolean>

export interface ContractEntry {
  key: string
  label: string
  address: string
  feature: FeatureKey
  state: VerificationState
}

const appEnvironment = (import.meta.env.VITE_APP_ENV as AppEnvironment) || 'development'

export const featureFlags: FeatureConfig = {
  mint: import.meta.env.VITE_ENABLE_MINT === 'true',
  staking: import.meta.env.VITE_ENABLE_STAKING === 'true',
  swap: import.meta.env.VITE_ENABLE_SWAP === 'true',
  yield: import.meta.env.VITE_ENABLE_YIELD === 'true',
}

export const contractsByEnv: Record<AppEnvironment, ContractEntry[]> = {
  development: [
    {
      key: 'collection',
      label: 'uNORMAN Collection Registry',
      address: '0x0000000000000000000000000000000000000000',
      feature: 'mint',
      state: 'informational',
    },
    {
      key: 'stakingVault',
      label: 'uNORMAN Staking Vault',
      address: '0x0000000000000000000000000000000000000000',
      feature: 'staking',
      state: 'disabled',
    },
    {
      key: 'dexRouter',
      label: 'Robinhood Chain DEX Router',
      address: '0x0000000000000000000000000000000000000000',
      feature: 'swap',
      state: 'disabled',
    },
    {
      key: 'yieldVault',
      label: 'Yield/Bounty Vault',
      address: '0x0000000000000000000000000000000000000000',
      feature: 'yield',
      state: 'informational',
    },
  ],
  staging: [],
  production: [],
}

const fallbackContracts = contractsByEnv.development

export const appConfig = {
  appName: 'uNORMAN',
  symbol: '$uNRMN',
  chainName: 'Robinhood Chain',
  appEnvironment,
  featureFlags,
  contracts:
    contractsByEnv[appEnvironment].length > 0
      ? contractsByEnv[appEnvironment]
      : fallbackContracts,
}

export const configValidationIssues = appConfig.contracts
  .filter((contract) => contract.address === '0x0000000000000000000000000000000000000000')
  .map((contract) => `${contract.label} is not wired`)

export function getContract(key: string) {
  return appConfig.contracts.find((contract) => contract.key === key)
}

export function canUseFeature(feature: FeatureKey) {
  const contractMatches = appConfig.contracts.filter(
    (contract) => contract.feature === feature,
  )
  return (
    appConfig.featureFlags[feature] &&
    contractMatches.length > 0 &&
    contractMatches.every((contract) => contract.state === 'verified')
  )
}
