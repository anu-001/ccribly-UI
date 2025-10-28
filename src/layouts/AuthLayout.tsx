import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold text-primary-600 mb-4">
              Welcome to Cribly
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find your perfect roommate and discover amazing properties in your city.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Verified profiles</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Smart matching</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Secure messaging</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

