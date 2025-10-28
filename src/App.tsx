import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import VerificationPage from '@/pages/VerificationPage'
import PublicLayout from '@/layouts/PublicLayout'

function App() {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Routes>
    </PublicLayout>
  )
}

export default App
