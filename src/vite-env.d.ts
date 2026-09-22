/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string
  readonly VITE_ENABLE_MINT?: string
  readonly VITE_ENABLE_STAKING?: string
  readonly VITE_ENABLE_SWAP?: string
  readonly VITE_ENABLE_YIELD?: string
  readonly VITE_STAKING_VAULT?: string
  readonly VITE_RPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
}

interface Window {
  ethereum?: EthereumProvider
}
