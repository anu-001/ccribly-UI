import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks'
import { api } from '@/services/api'

interface VerificationStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  error?: string
}

interface VerificationStatus {
  status: 'unverified' | 'pending' | 'verified' | 'failed'
  lastAttemptAt?: string
  completedAt?: string
  failureReason?: string
  remainingAttempts: number
}

export const IDVerification: React.FC = () => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [idImage, setIdImage] = useState<File | null>(null)
  const [selfieImage, setSelfieImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const idFileRef = useRef<HTMLInputElement>(null)
  const selfieFileRef = useRef<HTMLInputElement>(null)

  const steps: VerificationStep[] = [
    {
      id: 'upload-id',
      title: 'Upload ID Document',
      description: 'Take a clear photo of your government-issued ID',
      icon: <Camera className="w-6 h-6" />,
      completed: !!idImage
    },
    {
      id: 'upload-selfie',
      title: 'Take Selfie',
      description: 'Take a selfie to verify your identity',
      icon: <Camera className="w-6 h-6" />,
      completed: !!selfieImage
    },
    {
      id: 'verify',
      title: 'Verification',
      description: 'Our AI will verify your identity',
      icon: <CheckCircle className="w-6 h-6" />,
      completed: verificationStatus?.status === 'verified'
    }
  ]

  const handleFileSelect = (file: File, type: 'id' | 'selfie') => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError(null)
    
    if (type === 'id') {
      setIdImage(file)
      if (currentStep === 0) setCurrentStep(1)
    } else {
      setSelfieImage(file)
      if (currentStep === 1) setCurrentStep(2)
    }
  }

  const handleUpload = async (file: File, type: 'id' | 'selfie'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('useCase', type === 'id' ? 'VERIFICATION_DOCUMENT' : 'AVATAR')

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.data.url
  }

  const handleVerification = async () => {
    if (!idImage || !selfieImage) {
      setError('Please upload both ID and selfie images')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      // Upload images
      const [idImageUrl, selfieImageUrl] = await Promise.all([
        handleUpload(idImage, 'id'),
        handleUpload(selfieImage, 'selfie')
      ])

      // Initiate verification
      const response = await api.post('/verification/initiate', {
        idImageUrl,
        selfieImageUrl
      })

      // Start polling for status
      pollVerificationStatus()
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed')
      setIsVerifying(false)
    }
  }

  const pollVerificationStatus = async () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get('/verification/status')
        const status = response.data.data
        
        setVerificationStatus(status)
        
        if (status.status === 'verified' || status.status === 'failed') {
          clearInterval(pollInterval)
          setIsVerifying(false)
          
          if (status.status === 'verified') {
            setCurrentStep(3) // Success step
          } else {
            setError(status.failureReason || 'Verification failed')
          }
        }
      } catch (err) {
        console.error('Error polling verification status:', err)
      }
    }, 3000) // Poll every 3 seconds

    // Clear interval after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      setIsVerifying(false)
    }, 300000)
  }

  const handleRetry = () => {
    setIdImage(null)
    setSelfieImage(null)
    setCurrentStep(0)
    setError(null)
    setVerificationStatus(null)
  }

  const getStatusIcon = () => {
    if (!verificationStatus) return null
    
    switch (verificationStatus.status) {
      case 'verified':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />
      case 'pending':
        return <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusMessage = () => {
    if (!verificationStatus) return null
    
    switch (verificationStatus.status) {
      case 'verified':
        return 'Your identity has been successfully verified!'
      case 'failed':
        return `Verification failed: ${verificationStatus.failureReason}`
      case 'pending':
        return 'Verification in progress...'
      default:
        return 'Please complete verification to continue'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Identity Verification
        </h1>
        <p className="text-gray-600">
          Verify your identity to access all features
        </p>
      </div>

      {/* Status Display */}
      {verificationStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white rounded-lg shadow-lg border"
        >
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">
            {getStatusMessage()}
          </h3>
          {verificationStatus.remainingAttempts > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {verificationStatus.remainingAttempts} attempts remaining today
            </p>
          )}
        </motion.div>
      )}

      {/* Steps */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Upload ID Document</h3>
            <p className="text-gray-600 mb-6">
              Take a clear photo of your government-issued ID (driver's license, passport, etc.)
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
              <Button
                onClick={() => idFileRef.current?.click()}
                variant="outline"
              >
                Choose File
              </Button>
              <input
                ref={idFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file, 'id')
                }}
              />
            </div>
            
            {idImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(idImage)}
                  alt="ID Document"
                  className="max-w-xs mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Take Selfie</h3>
            <p className="text-gray-600 mb-6">
              Take a clear selfie to verify your identity
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
              <Button
                onClick={() => selfieFileRef.current?.click()}
                variant="outline"
              >
                Choose File
              </Button>
              <input
                ref={selfieFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file, 'selfie')
                }}
              />
            </div>
            
            {selfieImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(selfieImage)}
                  alt="Selfie"
                  className="max-w-xs mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Ready to Verify</h3>
            <p className="text-gray-600 mb-6">
              Review your images and click verify to start the process
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium mb-2">ID Document</h4>
                <img
                  src={URL.createObjectURL(idImage!)}
                  alt="ID Document"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Selfie</h4>
                <img
                  src={URL.createObjectURL(selfieImage!)}
                  alt="Selfie"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <Button
              onClick={handleVerification}
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Identity'
              )}
            </Button>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Verification Complete!</h3>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You now have access to all features.
            </p>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </div>

      {/* Retry Button */}
      {verificationStatus?.status === 'failed' && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            disabled={verificationStatus.remainingAttempts === 0}
          >
            Try Again
          </Button>
          {verificationStatus.remainingAttempts === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No attempts remaining today. Try again tomorrow.
            </p>
          )}
        </div>
      )}
    </div>
  )
}





