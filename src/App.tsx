import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { DexPage } from './pages/DexPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { StakingPage } from './pages/StakingPage'
import { YieldPage } from './pages/YieldPage'
import { CommunityPage } from './pages/CommunityPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/yield" element={<YieldPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/staking" element={<StakingPage />} />
        <Route path="/dex" element={<DexPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
