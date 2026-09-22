import { appConfig } from '../config/appConfig'
import { ecosystemEndpoints } from '../services/ecosystem'

export function HomePage() {
  return (
    <section className="stack">
      <article className="hero-card">
        <p className="eyebrow">collector + discovery dApp</p>
        <h2>Welcome to uNORMAN on Robinhood Chain</h2>
        <p>
          A hybrid DeFi + immutable art home for collectors, frens, degens, chads,
          based trench dwellers, btc maxis, fake rare homies, and cryptoart plebs.
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
                <td>{contract.address}</td>
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
    </section>
  )
}
