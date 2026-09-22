# uNORMAN Collector + Discovery dApp

Persistent web dApp foundation for uNORMAN on Robinhood Chain with strict trust boundaries:

- Wallet-connected collector dashboard
- NFT gallery and holdings views
- Yield and bonus informational views (gated until verified)
- Community feed surface (X, Telegram, onchain seed)
- Staking and DEX entry points with feature/contract gating
- Contract/config verification matrix to avoid implying unverified live pools

## Run locally

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```

## Environment flags

Optional Vite environment variables:

- `VITE_APP_ENV` = `development | staging | production`
- `VITE_ENABLE_MINT` = `true | false`
- `VITE_ENABLE_STAKING` = `true | false`
- `VITE_ENABLE_SWAP` = `true | false`
- `VITE_ENABLE_YIELD` = `true | false`

All transaction-capable surfaces remain gated unless feature flags are enabled and matching contracts are marked as verified.
