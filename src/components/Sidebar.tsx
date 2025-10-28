import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut,
  Plus,
  Map
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { useUIStore } from '@/stores'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'My Listings', href: '/dashboard/listings', icon: Map },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarOpen ? 280 : 0,
        opacity: sidebarOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="bg-white border-r border-gray-200 h-full overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors duration-200 group"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 group-hover:text-primary-600 transition-colors duration-200" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/dashboard/listings/new"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200 group mb-3"
            onClick={() => setSidebarOpen(false)}
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">New Listing</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 group w-full"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-600 transition-colors duration-200" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

