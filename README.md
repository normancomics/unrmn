# uNORMAN Collector + Discovery dApp

Persistent web dApp for **uNORMAN / $uNRMN** on Robinhood Chain with strict trust boundaries.

## Collector campaign

Target: bond **9.99 ETH**, graduate, burn LP into Uniswap v4, run a cleaner card book than utoken.gg.

- `/` bonding meter and enlist desk
- `/market` named-card book + v4 rails
- `/hybrid` µToken collection + mint.club sister assets
- `/staking` resolve any Robinhood ERC-20 and preview $uNRMN dual-stake
- Hook spec: `contracts/UNRMNDualStakeHook.sol`

## Live contracts

| Surface | Address | State |
| --- | --- | --- |
| `$uNRMN` / collection | `0x7ed16d612215b650434d7e45827cf080ea0d0f63` | verified (read) |
| Uniswap v4 PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` | official rails |
| mint.club token factory | `0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387` | official rails |
| DualStake hook | unset | disabled |

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Optional env:

- `VITE_BOND_ETH_RAISED` if the curve reserve is not sitting on the token address
- `VITE_GRADUATED=true` after LP is burned into v4
- `VITE_ENABLE_STAKING=true` only after a verified DualStake hook is mapped
