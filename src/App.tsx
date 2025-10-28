import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import VerificationPage from '@/pages/VerificationPage'
import SignUpPage from '@/pages/SignUpPage'
import SignInPage from '@/pages/SignInPage'
import PublicLayout from '@/layouts/PublicLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Route>
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/signin" element={<SignInPage />} />
    </Routes>
  )
}

export default App
