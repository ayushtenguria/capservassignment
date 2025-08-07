// /app/onboarding/components/steps/PANVerifyStep.tsx

'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Check, AlertCircle, Loader2, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { KYCData, ValidationErrors, VerificationStatus } from '@/types/types'
import FileUpload from '@/components/FileUpload'

interface PANVerifyStepProps {
  data: KYCData
  errors: ValidationErrors
  verificationStatus: VerificationStatus
  onChange: (field: keyof KYCData, value: any) => void
  onValidate: (field: keyof KYCData) => void
  onVerify: (type: 'pan' | 'photo' | 'bank') => void
}

export default function PANVerifyStep({
  data,
  errors,
  verificationStatus,
  onChange,
  onValidate,
  onVerify
}: PANVerifyStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isVerifying, setIsVerifying] = useState(false)

  // Auto-verify PAN when valid format is entered
  useEffect(() => {
    if (data.panNumber && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber) && !data.panVerified) {
      handlePANVerification()
    }
  }, [data.panNumber])

  const handlePANVerification = async () => {
    setIsVerifying(true)
    onVerify('pan')
    
    // Simulate verification delay
    setTimeout(() => {
      onChange('panVerified', true)
      setIsVerifying(false)
    }, 2000)
  }

  const handlePANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length <= 10) {
      onChange('panNumber', value)
      // Reset verification if PAN is changed
      if (data.panVerified && value !== data.panNumber) {
        onChange('panVerified', false)
      }
    }
  }

  const handleBlur = (field: keyof KYCData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    onValidate(field)
  }

  const handleFileSelect = (file: File | null) => {
    onChange('panCardImage', file)
  }

  const handleFileUploadComplete = (url: string) => {
    onChange('panCardImageUrl', url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <CreditCard className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">PAN Verification</h3>
        <p className="mt-1 text-sm text-gray-600">
          Please provide your PAN details for identity verification
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* PAN Number */}
        <div>
          <Label htmlFor="pan" className="flex items-center text-sm font-medium text-gray-700">
            PAN Number <span className="ml-1 text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <Input
              id="pan"
              type="text"
              value={data.panNumber}
              onChange={handlePANChange}
              onBlur={() => handleBlur('panNumber')}
              placeholder="ABCDE1234F"
              className={`
                font-mono uppercase
                ${errors.panNumber && touched.panNumber 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : data.panVerified
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : ''
                }
              `}
              maxLength={10}
              disabled={isVerifying}
            />
            
            {/* Verification Status Icons */}
            {isVerifying && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
            )}
            {data.panVerified && !isVerifying && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {errors.panNumber && touched.panNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.panNumber}</p>
          )}
          
          {/* Success Message */}
          {data.panVerified && (
            <div className="mt-2 flex items-center text-xs text-green-600">
              <Check className="mr-1 h-3 w-3" />
              PAN Verified
            </div>
          )}
          
          {/* Format Hint */}
          {!data.panVerified && !errors.panNumber && (
            <p className="mt-1 text-xs text-gray-500">
              Format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)
            </p>
          )}
        </div>

        {/* PAN Card Upload */}
        <div className="pt-2">
          <FileUpload
            label="Upload PAN Card Image"
            accept="image/png,image/jpeg,image/jpg"
            maxSize={5}
            value={data.panCardImage}
            previewUrl={data.panCardImageUrl}
            onFileSelect={handleFileSelect}
            onUploadComplete={handleFileUploadComplete}
            required
            error={errors.panCardImage}
            helperText="Upload a clear image of your PAN card (PNG, JPG up to 5MB)"
            isVerified={data.panCardImageUrl !== '' && data.panVerified}
            isVerifying={verificationStatus.pan === 'verifying'}
          />
        </div>

        {/* Security Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            Your PAN information is encrypted and stored securely. We use this for identity verification
            and compliance purposes only.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}