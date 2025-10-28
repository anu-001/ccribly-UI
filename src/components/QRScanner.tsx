import React, { useState, useEffect } from 'react'
import { Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { api } from '@/services/api'

interface QRScannerProps {
  onQRScanned: (data: string) => void
  onClose: () => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ onQRScanned, onClose }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    // Check camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true)
        setIsScanning(true)
      })
      .catch(() => {
        setHasPermission(false)
        setError('Camera permission is required to scan QR codes')
      })
  }, [])

  const handleQRCodeDetected = (data: string) => {
    try {
      // Parse QR code data
      const qrData = JSON.parse(data)
      
      if (qrData.type === 'verification' && qrData.sessionToken) {
        // Redirect to mobile verification page
        window.location.href = `/verification/mobile?token=${qrData.sessionToken}`
      } else {
        setError('Invalid QR code. Please scan the verification QR code.')
      }
    } catch (err) {
      setError('Invalid QR code format. Please try again.')
    }
  }

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg m-4 max-w-sm w-full">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Camera Permission Required</h2>
            <p className="text-gray-600 mb-4">
              Please allow camera access to scan QR codes for verification.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/50 text-white">
        <button onClick={onClose} className="text-white">
          <XCircle className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Scan QR Code</h2>
        <div className="w-6" />
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {isScanning ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <p className="text-lg">Point camera at QR code</p>
              <p className="text-sm text-gray-400 mt-2">
                QR code will be detected automatically
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <p className="text-lg">Initializing camera...</p>
            </div>
          </div>
        )}

        {/* QR Code Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-white rounded-lg w-64 h-64 opacity-50">
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 bg-black/50 text-white text-center">
        <p className="text-sm">
          Position the QR code within the frame above
        </p>
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  )
}

// Mobile Verification Page Component
interface MobileVerificationPageProps {
  sessionToken?: string
}

export const MobileVerificationPage: React.FC<MobileVerificationPageProps> = ({ sessionToken }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verificationData, setVerificationData] = useState<any>(null)

  useEffect(() => {
    if (sessionToken) {
      // Validate session token and get verification data
      validateSessionToken(sessionToken)
    } else {
      setError('Invalid session token')
      setIsLoading(false)
    }
  }, [sessionToken])

  const validateSessionToken = async (token: string) => {
    try {
      const response = await api.get(`/verification/validate-session/${token}`)
      setVerificationData(response.data)
      setIsLoading(false)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid or expired session')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mobile Verification
          </h1>
          <p className="text-gray-600">
            Complete your identity verification on this device
          </p>
        </div>

        {/* Import and use MobileIDVerification component here */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-gray-600">
            Mobile verification interface will be loaded here.
            This will use the MobileIDVerification component we created earlier.
          </p>
          <div className="mt-4 text-center">
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Complete Verification
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
