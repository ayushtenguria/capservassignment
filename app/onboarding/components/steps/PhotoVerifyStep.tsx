// /app/onboarding/components/steps/PhotoVerifyStep.tsx

'use client'

import { useState } from 'react'
import { Camera, CheckCircle, Info, Upload, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { KYCData, ValidationErrors, VerificationStatus } from '@/types/types'
import FileUpload from '@/components/FileUpload'

interface PhotoVerifyStepProps {
  data: KYCData
  errors: ValidationErrors
  verificationStatus: VerificationStatus
  onChange: (field: keyof KYCData, value: any) => void
  onValidate: (field: keyof KYCData) => void
  onVerify: (type: 'pan' | 'photo' | 'bank') => void
}

export default function PhotoVerifyStep({
  data,
  errors,
  verificationStatus,
  onChange,
  onValidate,
  onVerify
}: PhotoVerifyStepProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleFileSelect = (file: File | null) => {
    onChange('selfieImage', file)
    onChange('photoVerified', false)
    
    // Auto-verify when image is uploaded
    if (file) {
      // Create URL for the uploaded file immediately
      const fileUrl = URL.createObjectURL(file)
      onChange('selfieImageUrl', fileUrl)
      
      setTimeout(() => {
        setIsVerifying(true)
        onVerify('photo')
        
        // Simulate verification
        setTimeout(() => {
          onChange('photoVerified', true)
          setIsVerifying(false)
        }, 2000)
      }, 1500)
    } else {
      // Clear URL when file is removed
      onChange('selfieImageUrl', '')
    }
  }

  const handleFileUploadComplete = (url: string) => {
    onChange('selfieImageUrl', url)
  }

  const handleRemovePhoto = () => {
    // Clean up the URL if it exists
    if (data.selfieImageUrl && data.selfieImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(data.selfieImageUrl)
    }
    
    onChange('selfieImage', null)
    onChange('selfieImageUrl', '')
    onChange('photoVerified', false)
  }

  const handleRetakePhoto = () => {
    document.getElementById('photo-upload')?.click()
  }

  const photoGuidelines = [
    { text: 'Ensure good lighting', icon: '💡' },
    { text: 'Face should be clearly visible', icon: '👤' },
    { text: 'Remove glasses if possible', icon: '👓' },
    { text: 'Look directly at the camera', icon: '📷' },
    { text: 'Avoid shadows on face', icon: '🌤️' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <Camera className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Photo Verification</h3>
        <p className="mt-1 text-sm text-gray-600">
          Take a clear selfie or upload a photo for identity verification
        </p>
      </div>

      {/* Photo Upload/Display Area */}
      <div className="space-y-4">
        {!data.selfieImage ? (
          /* Main Upload Section - Show only when no photo is uploaded */
          <>
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-3 text-base font-medium text-gray-900">
                  Capture Your Photo
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Please take a clear photo of yourself or upload an existing one
                </p>
                
                {/* Upload Button */}
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            </div>

            {/* Photo Guidelines */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-3 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-600" />
                <h5 className="text-sm font-medium text-blue-900">Photo Guidelines</h5>
              </div>
              <ul className="space-y-2">
                {photoGuidelines.map((guideline, index) => (
                  <li key={index} className="flex items-center text-sm text-blue-800">
                    <span className="mr-2 text-base">{guideline.icon}</span>
                    <span>{guideline.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          /* Photo Display Section - Show when photo is uploaded */
          <div className="space-y-4">
            {/* Photo Preview */}
            <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-base font-medium text-gray-900">Uploaded Photo</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Photo Preview */}
              {data.selfieImageUrl || data.selfieImage ? (
                <div className="relative">
                  <img
                    src={data.selfieImageUrl || (data.selfieImage ? URL.createObjectURL(data.selfieImage) : '')}
                    alt="Uploaded selfie"
                    className="mx-auto max-h-64 rounded-lg object-cover"
                  />
                  
                  {/* Verification Status Overlay */}
                  {(isVerifying || verificationStatus.photo === 'verifying') && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50">
                      <div className="text-center text-white">
                        <RefreshCw className="mx-auto h-8 w-8 animate-spin" />
                        <p className="mt-2 text-sm">Verifying photo...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Camera className="mx-auto h-8 w-8" />
                  <p className="mt-2 text-sm">Photo processing...</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="mt-4 flex justify-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetakePhoto}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Retake Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          id="photo-upload"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
        />

        {/* Verification Success Status */}
        {data.photoVerified && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              Photo verified successfully! Your identity has been confirmed.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {errors.selfieImage && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-sm text-red-800">
              {errors.selfieImage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}