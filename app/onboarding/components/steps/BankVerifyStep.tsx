// /app/onboarding/components/steps/BankVerifyStep.tsx

'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { KYCData, ValidationErrors, VerificationStatus } from '@/types/types'

interface BankVerifyStepProps {
  data: KYCData
  errors: ValidationErrors
  verificationStatus: VerificationStatus
  onChange: (field: keyof KYCData, value: any) => void
  onValidate: (field: keyof KYCData) => void
  onVerify: (type: 'pan' | 'photo' | 'bank') => void
}

export default function BankVerifyStep({
  data,
  errors,
  verificationStatus,
  onChange,
  onValidate,
  onVerify
}: BankVerifyStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationFailed, setVerificationFailed] = useState(false)

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    onValidate(field as keyof KYCData)
  }

  const handleUPIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    onChange('upiId', value)
    setVerificationFailed(false)
    onChange('bankVerified', false)
  }

  // Improved UPI validation
  const isValidUPI = (upiId: string): boolean => {
    if (!upiId) return false
    
    // More flexible UPI regex that handles common formats
    const upiRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z][a-zA-Z0-9.-]*[a-zA-Z]$/
    return upiRegex.test(upiId)
  }

  const handleVerifyBank = async () => {
    if (data.verificationType === 'upi') {
      if (!isValidUPI(data.upiId)) {
        setVerificationFailed(true)
        return
      }
    }

    setIsVerifying(true)
    setVerificationFailed(false)
    onVerify('bank')

    // Simulate verification with higher success rate
    setTimeout(() => {
      // Simulate random failure for demo (5% chance instead of 10%)
      const shouldFail = Math.random() < 0.05
      
      if (shouldFail) {
        setVerificationFailed(true)
        onChange('bankVerified', false)
      } else {
        onChange('bankVerified', true)
        setVerificationFailed(false)
      }
      setIsVerifying(false)
    }, 2500)
  }

  const handleTabChange = (value: string) => {
    onChange('verificationType', value as 'upi' | 'bank')
    setVerificationFailed(false)
    onChange('bankVerified', false)
    setTouched({}) // Reset touched state
  }

  // Check if UPI can be verified
  const canVerifyUPI = data.upiId && isValidUPI(data.upiId) && !isVerifying && !data.bankVerified

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Bank Verification</h3>
        <p className="mt-1 text-sm text-gray-600">
          Link your bank account or UPI for secure transactions
        </p>
      </div>

      {/* Verification Tabs */}
      <Tabs value={data.verificationType || 'upi'} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upi" className="flex items-center">
            <Smartphone className="mr-2 h-4 w-4" />
            UPI ID
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Bank Account
          </TabsTrigger>
        </TabsList>

        {/* UPI Tab */}
        <TabsContent value="upi" className="space-y-4">
          <div>
            <Label htmlFor="upi" className="flex items-center text-sm font-medium text-gray-700">
              UPI ID <span className="ml-1 text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="upi"
                type="text"
                value={data.upiId || ''}
                onChange={handleUPIChange}
                onBlur={() => handleBlur('upiId')}
                placeholder="example@paytm"
                className={`
                  ${!isValidUPI(data.upiId) && touched.upiId && data.upiId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : data.bankVerified
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                      : ''
                  }
                `}
                disabled={isVerifying}
              />
              
              {/* Status Icons */}
              {isVerifying && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-900" />
                </div>
              )}
              {data.bankVerified && !isVerifying && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
            
            {/* Validation Error */}
            {!isValidUPI(data.upiId) && touched.upiId && data.upiId && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid UPI ID (e.g., example@paytm)
              </p>
            )}
            
            {/* Helper Text */}
            {(!data.upiId || !touched.upiId) && !data.bankVerified && (
              <p className="mt-1 text-xs text-gray-500">
                Enter your UPI ID (e.g., yourname@paytm, mobile@ybl, email@okaxis)
              </p>
            )}

            {/* Valid UPI indicator */}
            {isValidUPI(data.upiId) && !data.bankVerified && !isVerifying && (
              <p className="mt-1 text-xs text-green-600">
                ✓ Valid UPI ID format
              </p>
            )}
          </div>

          {/* Verify Button */}
          {canVerifyUPI && (
            <Button
              type="button"
              onClick={handleVerifyBank}
              disabled={isVerifying || !isValidUPI(data.upiId)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying UPI ID...
                </>
              ) : (
                'Verify UPI ID'
              )}
            </Button>
          )}

          {/* UPI Examples */}
          {!data.bankVerified && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Common UPI ID formats:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Mobile number: 9876543210@paytm</p>
                <p>• Username: yourname@ybl</p>
                <p>• Email style: user@okaxis</p>
                <p>• Custom: myname@upi</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Bank Account Tab */}
        <TabsContent value="bank" className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-sm text-blue-800">
              Bank account verification is coming soon. Please use UPI ID for now.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Verification Status Messages */}
      {verificationFailed && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-sm text-red-800">
            <div className="space-y-2">
              <p><strong>Verification Failed</strong></p>
              <p className="text-xs">
                {!isValidUPI(data.upiId) 
                  ? 'Please enter a valid UPI ID format' 
                  : 'UPI ID not found. Please check and try again'
                }
              </p>
              {isValidUPI(data.upiId) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVerifyBank}
                  className="mt-2"
                  disabled={isVerifying}
                >
                  Retry Verification
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {data.bankVerified && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-800">
            <strong>UPI ID verified successfully!</strong> Your payment method is now linked.
          </AlertDescription>
        </Alert>
      )}

      {/* Security & Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>Security & Privacy:</strong> We only verify your UPI ID existence. We cannot access your account balance or transaction history. Your data is encrypted and secure.
        </AlertDescription>
      </Alert>
    </div>
  )
}