# uNORMAN Collector + Discovery dApp

Persistent web dApp for **uNORMAN / $uNRMN** on Robinhood Chain with strict trust boundaries:

- Wallet connect with automatic switch/add of Robinhood Chain (`4663`)
- Live `$uNRMN` balance reads against the verified token
- Gallery card slots inferred from whole-token holdings (µToken mint rule)
- Yield / staking / DEX surfaces stay informational until contracts are verified
- Community feed seed (X, Telegram, onchain)
- Contract/config verification matrix so unverified pools are never implied live

## Live contracts

| Surface | Address | State |
| --- | --- | --- |
| `$uNRMN` / collection | `0x7ed16d612215b650434d7e45827cf080ea0d0f63` | verified (read) |
| Staking vault | unset | disabled |
| DEX router | unset | disabled |
| Yield vault | unset | informational |

Collection / market: [utoken.gg/collection/unrmn](https://utoken.gg/collection/unrmn)

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```

## Environment flags

- `VITE_APP_ENV` = `development | staging | production`
- `VITE_ENABLE_MINT` / `VITE_ENABLE_STAKING` / `VITE_ENABLE_SWAP` / `VITE_ENABLE_YIELD` = `true | false`
- `VITE_RPC_URL` optional public or private Robinhood Chain RPC

Transaction-capable surfaces stay gated unless the matching feature flag is enabled **and** the mapped contract is `verified`.
