import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Smartphone, CheckCircle, Clock, RefreshCw, ArrowRight, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { api } from '@/services/api'
import toast from 'react-hot-toast'

interface QRVerificationData {
  qrCode: string // Base64 encoded SVG or data URL
  sessionToken: string
  expiresAt: string
}

interface VerificationStatus {
  status: 'pending' | 'scanning' | 'scanned' | 'verified' | 'failed' | 'expired'
  message: string
  data?: any // Verification data or error details
}

export const QRVerificationFlow: React.FC = () => {
  console.log('QRVerificationFlow component rendered') // Debug log

  const [qrData, setQrData] = useState<QRVerificationData | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    status: 'pending',
    message: 'Preparing verification...'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  // Generate QR code for verification
  const generateQRCode = async () => {
    console.log('Generating QR code...') // Debug log
    setIsGenerating(true)
    setVerificationStatus({
      status: 'pending',
      message: 'Generating verification code...'
    })

    try {
      console.log('Making API call to /verification/generate-qr') // Debug log
      const response = await api.post('/verification/generate-qr')
      // Some backends wrap payloads as { statusCode, message, data }
      const payload: QRVerificationData = (response.data && response.data.data) ? response.data.data : response.data
      console.log('API payload:', payload) // Debug log
      setQrData(payload)
      setVerificationStatus({
        status: 'scanning',
        message: 'Scan the QR code with your mobile device'
      })
      const expiryTime = payload.expiresAt ? new Date(payload.expiresAt).getTime() : NaN
      const seconds = Number.isFinite(expiryTime) ? Math.max(0, Math.floor((expiryTime - Date.now()) / 1000)) : 300
      setTimeLeft(seconds)
      toast.success('QR code generated successfully!')
    } catch (error: any) {
      console.error('QR generation error:', error) // Debug log
      const errorMessage = error.response?.data?.message || 'Failed to generate QR code. Please try again.'
      setVerificationStatus({
        status: 'failed',
        message: errorMessage
      })
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  // Countdown timer effect
  useEffect(() => {
    if (
      qrData &&
      Number.isFinite(timeLeft) &&
      timeLeft > 0 &&
      verificationStatus.status !== 'verified' &&
      verificationStatus.status !== 'failed'
    ) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (
      qrData &&
      Number.isFinite(timeLeft) &&
      timeLeft === 0 &&
      verificationStatus.status !== 'verified' &&
      verificationStatus.status !== 'failed'
    ) {
      setVerificationStatus({ status: 'expired', message: 'QR code expired. Please generate a new one.' })
      toast.error('QR code expired. Please generate a new one.')
    }
  }, [qrData, timeLeft, verificationStatus.status])

  // Polling for verification status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null

    if (qrData && (verificationStatus.status === 'pending' || verificationStatus.status === 'scanning' || verificationStatus.status === 'scanned')) {
      pollInterval = setInterval(async () => {
        try {
          console.log(`Polling QR status for session: ${qrData.sessionToken}`) // Debug log
          const response = await api.get(`/verification/qr-status/${qrData.sessionToken}`)
          const statusPayload: VerificationStatus = (response.data && response.data.data) ? response.data.data : response.data
          console.log('Polling payload:', statusPayload) // Debug log
          setVerificationStatus(statusPayload)

          if (statusPayload.status === 'verified') {
            toast.success('Identity verified successfully! Redirecting...')
            if (pollInterval) clearInterval(pollInterval)
            setTimeout(() => {
              window.location.href = '/' // Redirect to homepage on success
            }, 3000)
          } else if (statusPayload.status === 'failed' || statusPayload.status === 'expired') {
            toast.error(statusPayload.message)
            if (pollInterval) clearInterval(pollInterval)
          }
        } catch (err: any) {
          console.error('Polling error:', err) // Debug log
          const errorMessage = err.response?.data?.message || 'Failed to fetch verification status.'
          setVerificationStatus(prev => ({ ...prev, status: 'failed', message: errorMessage }))
          toast.error(errorMessage)
          if (pollInterval) clearInterval(pollInterval)
        }
      }, 2000) // Poll every 2 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [qrData, verificationStatus.status])

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '—'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusIcon = () => {
    switch (verificationStatus.status) {
      case 'verified':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      case 'failed':
      case 'expired':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto" />
      case 'scanned':
      case 'pending':
      case 'scanning':
      default:
        return <RefreshCw className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
    }
  }

  const getStatusMessage = () => {
    return verificationStatus.message
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Verify Your Identity
      </h2>
      <p className="text-gray-600 mb-8">
        Scan the QR code below with your mobile phone to complete identity verification.
      </p>

      {/* Error Display */}
      {verificationStatus.status === 'failed' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {verificationStatus.message}</span>
        </motion.div>
      )}

      {/* Initial State / Generate QR Button */}
      {!qrData && !isGenerating && (
        <Button
          onClick={generateQRCode}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium flex items-center space-x-2 mx-auto"
        >
          <QrCode className="w-5 h-5" />
          <span>Generate QR Code</span>
        </Button>
      )}

      {/* QR Code Display and Status */}
      {qrData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="relative w-64 h-64 mx-auto bg-gray-100 p-4 rounded-lg shadow-inner flex items-center justify-center">
            {qrData.qrCode ? (
              <img src={qrData.qrCode} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <div className="text-gray-500">Loading QR Code...</div>
            )}
            {verificationStatus.status === 'expired' && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                <span className="text-white text-lg font-bold">EXPIRED</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>Expires in: {formatTime(timeLeft)}</span>
          </div>

          <div className="text-center space-y-4">
            {getStatusIcon()}
            <p className={`text-lg font-medium ${
              verificationStatus.status === 'verified' ? 'text-green-600' :
              (verificationStatus.status === 'failed' || verificationStatus.status === 'expired') ? 'text-red-600' : 'text-blue-600'
            }`}>
              {getStatusMessage()}
            </p>
          </div>

          {(verificationStatus.status === 'failed' || verificationStatus.status === 'expired') && (
            <Button
              onClick={generateQRCode}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Generate New QR Code</span>
            </Button>
          )}

          {verificationStatus.status === 'verified' && (
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center space-x-2 mx-auto"
            >
              <span>Go to Homepage</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </motion.div>
      )}

      {isGenerating && (
        <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Generating QR Code...</span>
        </div>
      )}
    </div>
  )
}