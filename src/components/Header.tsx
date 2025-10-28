import { Link } from 'react-router-dom'

export default function Header() {
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
          </nav>

          {/* Sign Up and Sign In Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/auth/signin" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
