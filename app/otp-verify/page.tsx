// /app/otp-verify/page.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import storageService from '@/services/storageService'
import Link from 'next/link'

export default function OTPVerifyPage() {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false)
  
  const { verifyOTP, error, clearError } = useAuth()
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get email from session storage on mount
  useEffect(() => {
    const registrationEmail = storageService.getRegistrationEmail()
    const pendingReg = storageService.getPendingRegistration()
    
    if (!registrationEmail || !pendingReg) {
      toast.error('No pending registration found. Please register again.')
      router.push('/signup')
      return
    }
    
    setEmail(registrationEmail)
    
    // Check if OTP is still valid
    const otpExpiry = storageService.getOtpExpiry()
    if (otpExpiry) {
      const now = new Date()
      const expiryTime = new Date(otpExpiry)
      const secondsLeft = Math.max(0, Math.floor((expiryTime.getTime() - now.getTime()) / 1000))
      
      if (secondsLeft <= 0) {
        setIsExpired(true)
        setTimeLeft(0)
      } else {
        setTimeLeft(secondsLeft)
      }
    }
  }, [router])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isExpired) {
      setIsExpired(true)
      toast.error('OTP has expired. Please register again.')
    }
  }, [timeLeft, isExpired])

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    const digits = pastedData.replace(/\D/g, '')
    
    if (digits) {
      const newOtp = [...otp]
      digits.split('').forEach((digit, index) => {
        if (index < 4) {
          newOtp[index] = digit
        }
      })
      setOtp(newOtp)
      
      // Focus the last filled input or the next empty one
      const lastFilledIndex = Math.min(digits.length - 1, 3)
      inputRefs.current[lastFilledIndex]?.focus()
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    
    if (otpString.length !== 4) {
      toast.error('Please enter the complete 4-digit OTP')
      return
    }
    
    if (isExpired) {
      toast.error('OTP has expired. Please register again.')
      return
    }
    
    setIsSubmitting(true)
    clearError()
    
    try {
      const response = await verifyOTP(email, otpString)
      
      if (response.success) {
        toast.success('Registration successful! Redirecting to login...')
        // Redirect is handled in useAuth hook
      } else {
        toast.error(response.message)
        // Clear OTP on error
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      toast.error('An unexpected error occurred during verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle resend (for future implementation)
  const handleResend = () => {
    toast.info('Resend OTP feature coming soon')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/signup"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to signup
          </Link>
        </div>

        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to
          </p>
          <p className="mt-1 font-medium text-gray-900">{email}</p>
        </div>

        {/* OTP Form */}
        <div className="mt-8">
          <div className="rounded-lg bg-white px-6 py-8 shadow sm:px-10">
            <div className="mb-6 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Enter the 4-digit code sent to your email
              </p>
              {!isExpired && (
                <p className="mt-2 text-xs text-gray-500">
                  Code expires in{' '}
                  <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              )}
              {isExpired && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  OTP has expired
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`h-12 w-12 text-center text-lg font-semibold ${
                      isExpired ? 'border-red-300 bg-red-50' : ''
                    }`}
                    disabled={isSubmitting || isExpired}
                  />
                ))}
              </div>

              {/* Development Hint */}
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-blue-800">
                  <strong>Development Mode:</strong> Use OTP code <strong>1234</strong>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-700"
                disabled={isSubmitting || isExpired}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              {/* Resend Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                  disabled={!isExpired || isSubmitting}
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <p className="mt-4 text-center text-xs text-gray-500">
            This code helps us verify your identity and keep your account secure.
            Never share this code with anyone.
          </p>
        </div>
      </div>
    </div>
  )
}