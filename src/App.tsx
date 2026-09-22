import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CommunityPage } from './pages/CommunityPage'
import { DashboardPage } from './pages/DashboardPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { HybridPage } from './pages/HybridPage'
import { MarketPage } from './pages/MarketPage'
import { StakingPage } from './pages/StakingPage'
import { YieldPage } from './pages/YieldPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/dex" element={<MarketPage />} />
        <Route path="/hybrid" element={<HybridPage />} />
        <Route path="/yield" element={<YieldPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/staking" element={<StakingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
