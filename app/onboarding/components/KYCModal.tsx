// /app/onboarding/components/KYCModal.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import KYCProgress from './KYCProgress'
import BasicInfoStep from './steps/BasicInfoStep'
import PANVerifyStep from './steps/PANVerifyStep'
import PhotoVerifyStep from './steps/PhotoVerifyStep'
import BankVerifyStep from './steps/BankVerifyStep'
import { 
  KYCData, 
  ValidationErrors, 
  VerificationStatus, 
  initialKYCData,
  KYC_STEPS 
} from '@/types/types'

interface KYCModalProps {
  isOpen: boolean
  onClose?: () => void // Made optional since we don't allow closing
}

export default function KYCModal({ isOpen, onClose }: KYCModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [kycData, setKycData] = useState<KYCData>(initialKYCData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    pan: 'idle',
    photo: 'idle',
    bank: 'idle'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Validation functions
  const validateField = (field: keyof KYCData): string | undefined => {
    const value = kycData[field]

    switch (field) {
      case 'fullName':
        if (!value || (value as string).trim().length < 2) {
          return 'Full name must be at least 2 characters'
        }
        break
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required'
        const dobRegex = /^\d{2}-\d{2}-\d{4}$/
        if (!dobRegex.test(value as string)) {
          return 'Invalid date format (DD-MM-YYYY)'
        }
        // Check if age is at least 18
        const [day, month, year] = (value as string).split('-').map(Number)
        const dob = new Date(year, month - 1, day)
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()
        if (age < 18) {
          return 'You must be at least 18 years old'
        }
        break
      
      case 'phoneNumber':
        if (!value) return 'Phone number is required'
        const phoneRegex = /^\+91\s?\d{10}$/
        const cleanPhone = (value as string).replace(/\s/g, '')
        if (!phoneRegex.test(cleanPhone)) {
          return 'Invalid phone number format'
        }
        break
      
      case 'address':
        if (!value || (value as string).trim().length < 10) {
          return 'Please enter a complete address'
        }
        break
      
      case 'panNumber':
        if (!value) return 'PAN number is required'
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        if (!panRegex.test(value as string)) {
          return 'Invalid PAN format (e.g., ABCDE1234F)'
        }
        break
      
      case 'panCardImage':
        if (!value && !kycData.panCardImageUrl) {
          return 'Please upload PAN card image'
        }
        break
      
      case 'selfieImage':
        if (!value && !kycData.selfieImageUrl) {
          return 'Please upload your photo'
        }
        break
      
      case 'upiId':
        if (kycData.verificationType === 'upi') {
          if (!value) return 'UPI ID is required'
          const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/
          if (!upiRegex.test(value as string)) {
            return 'Invalid UPI ID format'
          }
        }
        break
    }

    return undefined
  }

  // Check if current step is valid
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          kycData.fullName &&
          kycData.dateOfBirth &&
          kycData.phoneNumber &&
          kycData.address &&
          !errors.fullName &&
          !errors.dateOfBirth &&
          !errors.phoneNumber &&
          !errors.address
        )
      
      case 2:
        return !!(
          kycData.panNumber &&
          kycData.panVerified &&
          kycData.panCardImageUrl &&
          !errors.panNumber &&
          !errors.panCardImage
        )
      
      case 3:
        return !!(
          kycData.selfieImageUrl &&
          kycData.photoVerified &&
          !errors.selfieImage
        )
      
      case 4:
        return !!(
          kycData.bankVerified &&
          ((kycData.verificationType === 'upi' && kycData.upiId) ||
           (kycData.verificationType === 'bank' && kycData.bankAccount.accountNumber))
        )
      
      default:
        return false
    }
  }

  // Handle field changes
  const handleFieldChange = (field: keyof KYCData, value: any) => {
    setKycData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle field validation
  const handleFieldValidate = (field: keyof KYCData) => {
    const error = validateField(field)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // Handle verification
  const handleVerify = (type: 'pan' | 'photo' | 'bank') => {
    setVerificationStatus(prev => ({ ...prev, [type]: 'verifying' }))
    
    // Simulate verification
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, [type]: 'verified' }))
    }, 2000)
  }

  // Handle next step
  const handleNext = () => {
    if (isStepValid(currentStep)) {
      if (currentStep === 4) {
        // Complete KYC
        handleCompleteKYC()
      } else {
        setCompletedSteps(prev => [...new Set([...prev, currentStep])])
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast.error('Please complete all required fields')
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Complete KYC
  const handleCompleteKYC = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      // Clear KYC data after completion
      localStorage.setItem('hasCompletedOnboarding', 'true')
      localStorage.setItem('kycVerified', 'true')
      
      toast.success('KYC completed successfully!')
      
      // Redirect to dashboard
      router.push('/dashboard')
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-100 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="border-b border-gray-200 bg-white px-6 py-4 flex-shrink-0">
                <div className="flex flex-col items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Complete Your KYC
                  </h2>
                  {/* No close button as KYC is mandatory */}
                  <div className="text-sm text-gray-500 mt-5">
                    Help us verify your identity to unlock all features
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex-shrink-0">
                <KYCProgress 
                  currentStep={currentStep} 
                  completedSteps={completedSteps}
                />
              </div>

              {/* Content Area - Dynamic Height */}
              <div className="px-6 py-6 overflow-y-auto flex-grow min-h-0">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BasicInfoStep
                        data={kycData}
                        errors={errors}
                        onChange={handleFieldChange}
                        onValidate={handleFieldValidate}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PANVerifyStep
                        data={kycData}
                        errors={errors}
                        verificationStatus={verificationStatus}
                        onChange={handleFieldChange}
                        onValidate={handleFieldValidate}
                        onVerify={handleVerify}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PhotoVerifyStep
                        data={kycData}
                        errors={errors}
                        verificationStatus={verificationStatus}
                        onChange={handleFieldChange}
                        onValidate={handleFieldValidate}
                        onVerify={handleVerify}
                      />
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BankVerifyStep
                        data={kycData}
                        errors={errors}
                        verificationStatus={verificationStatus}
                        onChange={handleFieldChange}
                        onValidate={handleFieldValidate}
                        onVerify={handleVerify}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Navigation */}
              <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                    className={currentStep === 1 ? 'invisible' : ''}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>

                  {/* Continue/Complete Button */}
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep) || isSubmitting}
                    className="min-w-[120px] bg-blue-900 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : currentStep === 4 ? (
                      'Complete KYC'
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}