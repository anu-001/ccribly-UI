import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

