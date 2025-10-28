import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useUIStore } from '@/stores'

export default function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed lg:relative z-30 lg:z-auto"
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

