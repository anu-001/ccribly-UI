import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, CheckCircle, XCircle, AlertCircle, RefreshCw, Smartphone, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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

export const MobileIDVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [idImage, setIdImage] = useState<File | null>(null)
  const [selfieImage, setSelfieImage] = useState<File | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [cameraMode, setCameraMode] = useState<'id' | 'selfie' | null>(null)
  
  const idFileRef = useRef<HTMLInputElement>(null)
  const selfieFileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    checkMobile()
  }, [])

  const steps: VerificationStep[] = [
    {
      id: 'upload-id',
      title: 'Scan ID Document',
      description: isMobile ? 'Use your camera to scan your government-issued ID' : 'Take a clear photo of your government-issued ID',
      icon: <Camera className="w-6 h-6" />,
      completed: !!idImage
    },
    {
      id: 'upload-selfie',
      title: 'Take Selfie',
      description: isMobile ? 'Use your front camera for a selfie' : 'Take a selfie to verify your identity',
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

  // Camera functionality
  const startCamera = async (mode: 'id' | 'selfie') => {
    try {
      setCameraMode(mode)
      setError(null)
      
      const constraints = {
        video: {
          facingMode: mode === 'selfie' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      setError('Camera access is required for verification. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraMode(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) return

      const file = new File([blob], `${cameraMode}-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      })

      // Validate and set image
      handleFileSelect(file, cameraMode!)
      
      // Stop camera
      stopCamera()
      
      // Auto-advance to next step
      if (cameraMode === 'id') {
        setCurrentStep(1)
      } else if (cameraMode === 'selfie') {
        setCurrentStep(2)
      }
    }, 'image/jpeg', 0.8)
  }

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
    } else {
      setSelfieImage(file)
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
      const [idImageUrl, selfieImageUrl] = await Promise.all([
        handleUpload(idImage, 'id'),
        handleUpload(selfieImage, 'selfie')
      ])

      await api.post('/verification/initiate', { idImageUrl, selfieImageUrl })
      
      // Start polling for status
      pollVerificationStatus()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
      setIsVerifying(false)
    }
  }

  const pollVerificationStatus = async () => {
    try {
      const response = await api.get('/verification/status')
      setVerificationStatus(response.data)
      
      if (response.data.status === 'pending') {
        setTimeout(pollVerificationStatus, 3000)
      } else {
        setIsVerifying(false)
      }
    } catch (err) {
      console.error('Status polling error:', err)
      setIsVerifying(false)
    }
  }

  const handleRetry = () => {
    setIdImage(null)
    setSelfieImage(null)
    setCurrentStep(0)
    setVerificationStatus(null)
    setError(null)
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
    if (!verificationStatus) return ''
    
    switch (verificationStatus.status) {
      case 'verified':
        return 'Identity verified successfully!'
      case 'failed':
        return `Verification failed: ${verificationStatus.failureReason || 'Unknown error'}`
      case 'pending':
        return 'Verification in progress...'
      default:
        return 'Verification status unknown'
    }
  }

  // Camera overlay component
  const CameraOverlay = () => {
    if (!cameraMode) return null

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black/50 text-white">
          <button onClick={stopCamera} className="text-white">
            <XCircle className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">
            {cameraMode === 'id' ? 'Scan ID Document' : 'Take Selfie'}
          </h2>
          <div className="w-6" />
        </div>

        {/* Camera View */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Camera Guidelines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white rounded-lg w-64 h-40 opacity-50">
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/50">
          <div className="flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Camera className="w-8 h-8 text-gray-800" />
            </button>
          </div>
          
          <p className="text-white text-center mt-4 text-sm">
            {cameraMode === 'id' 
              ? 'Position your ID within the frame and tap to capture'
              : 'Look at the camera and tap to capture'
            }
          </p>
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Mobile Detection Banner */}
      {isMobile && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Mobile Mode Detected</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Use your phone's camera for better image quality and easier verification.
          </p>
        </div>
      )}

      {/* Status Display */}
      {verificationStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold text-gray-900">{getStatusMessage()}</h3>
              {verificationStatus.status === 'failed' && verificationStatus.remainingAttempts > 0 && (
                <p className="text-sm text-gray-600">
                  {verificationStatus.remainingAttempts} attempts remaining
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-xs mt-2 text-center max-w-20">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="id-upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Scan Your ID Document</h2>
            <p className="text-gray-600 mb-6">
              {isMobile 
                ? 'Use your camera to scan your government-issued ID for better quality'
                : 'Upload a clear photo of your government-issued ID'
              }
            </p>

            {idImage ? (
              <div className="mb-6">
                <img
                  src={URL.createObjectURL(idImage)}
                  alt="ID Document"
                  className="max-w-full h-64 object-contain mx-auto border rounded-lg"
                />
                <p className="text-green-600 mt-2">✓ ID document uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-4">
                {isMobile ? (
                  <Button
                    onClick={() => startCamera('id')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Use Camera to Scan ID
                  </Button>
                ) : null}
                
                <Button
                  onClick={() => idFileRef.current?.click()}
                  variant="outline"
                  className="w-full py-3 px-4 rounded-lg font-medium"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload from Gallery
                </Button>
              </div>
            )}

            <input
              ref={idFileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file, 'id')
              }}
              className="hidden"
            />
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="selfie-upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Take a Selfie</h2>
            <p className="text-gray-600 mb-6">
              {isMobile 
                ? 'Use your front camera to take a clear selfie'
                : 'Take a clear selfie to verify your identity'
              }
            </p>

            {selfieImage ? (
              <div className="mb-6">
                <img
                  src={URL.createObjectURL(selfieImage)}
                  alt="Selfie"
                  className="max-w-full h-64 object-contain mx-auto border rounded-lg"
                />
                <p className="text-green-600 mt-2">✓ Selfie uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-4">
                {isMobile ? (
                  <Button
                    onClick={() => startCamera('selfie')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Use Front Camera
                  </Button>
                ) : null}
                
                <Button
                  onClick={() => selfieFileRef.current?.click()}
                  variant="outline"
                  className="w-full py-3 px-4 rounded-lg font-medium"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload from Gallery
                </Button>
              </div>
            )}

            <input
              ref={selfieFileRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file, 'selfie')
              }}
              className="hidden"
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Verify</h2>
            <p className="text-gray-600 mb-6">
              Review your images and start the verification process
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <img
                  src={URL.createObjectURL(idImage!)}
                  alt="ID Document"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <p className="text-sm text-gray-600 mt-1">ID Document</p>
              </div>
              <div>
                <img
                  src={URL.createObjectURL(selfieImage!)}
                  alt="Selfie"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <p className="text-sm text-gray-600 mt-1">Selfie</p>
              </div>
            </div>

            <Button
              onClick={handleVerification}
              disabled={isVerifying}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Start Verification
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retry Button */}
      {verificationStatus?.status === 'failed' && verificationStatus.remainingAttempts > 0 && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="py-2 px-4 rounded-lg font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Camera Overlay */}
      <CameraOverlay />
    </div>
  )
}
