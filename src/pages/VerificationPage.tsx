import React from 'react'
import { motion } from 'framer-motion'
import { IDVerification } from '@/components/IDVerification'
import PublicLayout from '@/layouts/PublicLayout'

const VerificationPage: React.FC = () => {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12"
      >
        <div className="container mx-auto px-4">
          <IDVerification />
        </div>
      </motion.div>
    </PublicLayout>
  )
}

export default VerificationPage




