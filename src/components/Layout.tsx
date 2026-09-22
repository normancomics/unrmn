import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { appConfig } from '../config/appConfig'
import { useAppState } from '../state/AppContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/yield', label: 'Yield' },
  { to: '/community', label: 'Community' },
  { to: '/staking', label: 'Staking' },
  { to: '/dex', label: 'DEX' },
]

export function Layout({ children }: { children: ReactNode }) {
  const { walletAddress, connect } = useAppState()
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">{appConfig.chainName}</p>
          <h1>
            {appConfig.appName} {appConfig.symbol}
          </h1>
        </div>
        <button type="button" className="button" onClick={connect}>
          {walletAddress ? `Connected: ${walletAddress}` : 'Connect wallet'}
        </button>
      </header>

      <nav className="top-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main>{children}</main>
    </div>
  )
}
