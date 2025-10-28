import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ListingDetailPage from '@/pages/ListingDetailPage'
import CreateListingPage from '@/pages/CreateListingPage'
import ProfilePage from '@/pages/ProfilePage'
import VerificationPage from '@/pages/VerificationPage'
import SignUpPage from '@/pages/SignUpPage'
import SignInPage from '@/pages/SignInPage'
import QRVerificationPage from '@/pages/QRVerificationPage'
import MobileVerificationPage from '@/pages/MobileVerificationPage'
import FiltersPage from '@/pages/FiltersPage'
import RoommatesPage from '@/pages/RoommatesPage'
import FavoritesPage from '@/pages/FavoritesPage'
import InfoPage from '@/pages/InfoPage'
import PublicLayout from '@/layouts/PublicLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/roommates" element={<RoommatesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/filters" element={<FiltersPage />} />
      </Route>
      <Route path="/verification/qr" element={<QRVerificationPage />} />
      <Route path="/verification/mobile" element={<MobileVerificationPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/signin" element={<SignInPage />} />
    </Routes>
  )
}

export default App
