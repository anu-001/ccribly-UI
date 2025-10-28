import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { LogOut, User, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'
import toast from 'react-hot-toast'

export default function Header() {
  const { user, isAuthenticated, clearAuth, setUser } = useAuthStore()

  // Sync user on mount so verification badge updates after redirects
  useEffect(()=>{
    const run = async()=>{
      try{
        if (!isAuthenticated) return
        const u = await authApi.getMe()
        if (u && u.verificationStatus && user?.verificationStatus !== u.verificationStatus){
          setUser(u)
        }
      }catch(_){ /* ignore */ }
    }
    run()
  },[isAuthenticated])

  const handleLogout = async () => {
    try {
      await authApi.logout()
      clearAuth()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth() // Clear local state even if API call fails
      toast.success('Logged out successfully')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏠</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Cribly</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/rent" className="text-blue-600 border-b-2 border-blue-600 pb-1 font-medium">Rent</Link>
            <Link to="/roommates" className="text-gray-600 hover:text-gray-900 font-medium">Find Roommate</Link>
            <Link to="/favorites" className="text-gray-600 hover:text-gray-900 font-medium">Favorites</Link>
            <Link to="/listings/new" className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">Add Listing</Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <Link to="/profile" className="text-sm font-medium text-gray-700 flex items-center gap-2 hover:text-gray-900">
                    {user.firstName} {user.lastName}
                    {user.verificationStatus === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/signin" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
