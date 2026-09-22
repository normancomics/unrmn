import { appConfig, configValidationIssues } from '../config/appConfig'
import { explorerTokenUrl, UNRMN_TOKEN } from '../config/chain'
import { ecosystemEndpoints } from '../services/ecosystem'

export function HomePage() {
  return (
    <section className="stack">
      <article className="hero-card">
        <p className="eyebrow">collector + discovery dApp</p>
        <h2>Welcome to uNORMAN on Robinhood Chain</h2>
        <p>
          The token is the art. $uNRMN lives on µToken: a buy mints one card per whole
          token received, and sells burn newest-first. This app stays read-first —
          transaction surfaces stay gated until a matching vault or router is verified.
        </p>
        <div className="inline">
          <a className="button" href={appConfig.collectionUrl} target="_blank" rel="noreferrer">
            Open collection
          </a>
          <a className="button" href={appConfig.tradeUrl} target="_blank" rel="noreferrer">
            Trade on µToken
          </a>
          <a className="button" href={appConfig.manifestoUrl} target="_blank" rel="noreferrer">
            Read manifesto
          </a>
        </div>
      </article>

      <article className="card">
        <h3>Live token</h3>
        <p>
          {UNRMN_TOKEN.name} ({UNRMN_TOKEN.symbol}) · {UNRMN_TOKEN.decimals} decimals ·
          capped supply {UNRMN_TOKEN.totalSupply.toLocaleString()}
        </p>
        <p className="meta">
          <a href={explorerTokenUrl(UNRMN_TOKEN.address)} target="_blank" rel="noreferrer">
            {UNRMN_TOKEN.address}
          </a>
        </p>
      </article>

      <article className="card">
        <h3>Contract & config verification matrix</h3>
        <table className="matrix">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Address</th>
              <th>Feature</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {appConfig.contracts.map((contract) => (
              <tr key={contract.key}>
                <td>{contract.label}</td>
                <td className="mono">{contract.address}</td>
                <td>{contract.feature}</td>
                <td>{contract.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="card">
        <h3>Ecosystem endpoints</h3>
        <ul className="list">
          {ecosystemEndpoints.map((endpoint) => (
            <li key={endpoint.id}>
              <a href={endpoint.href} target="_blank" rel="noreferrer">
                {endpoint.title}
              </a>{' '}
              <span className="meta">({endpoint.type})</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h3>Environment readiness checks</h3>
        {configValidationIssues.length === 0 ? (
          <p className="status ok">All configured contracts have non-placeholder addresses.</p>
        ) : (
          <ul className="list">
            {configValidationIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}
