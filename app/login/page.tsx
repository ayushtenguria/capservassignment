// /app/login/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'

export default function LoginPage() {
  console.log('📝 LoginPage: Component rendering/re-rendering');
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  
  const { login, error, clearError } = useAuth()
  const router = useRouter()

  console.log('📝 LoginPage: State values:', {
    email,
    password: password ? '***masked***' : '',
    rememberMe,
    showPassword,
    isSubmitting,
    errors,
    authError: error
  });

  console.log('📝 LoginPage: useAuth hook values:', {
    loginFunction: typeof login,
    error,
    clearErrorFunction: typeof clearError
  });

  // Validate form
  const validateForm = () => {
    console.log('📝 LoginPage: validateForm called');
    
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
      console.log('📝 LoginPage: Validation - Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
      console.log('📝 LoginPage: Validation - Email is invalid:', email);
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
      console.log('📝 LoginPage: Validation - Password is required');
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      console.log('📝 LoginPage: Validation - Password too short:', password.length);
    }
    
    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    
    console.log('📝 LoginPage: Validation result:', {
      errors: newErrors,
      isValid
    });
    
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('📝 LoginPage: handleSubmit started');
    
    e.preventDefault()
    
    console.log('📝 LoginPage: Form submission data:', {
      email,
      password: password ? '***masked***' : '',
      rememberMe
    });
    
    if (!validateForm()) {
      console.log('📝 LoginPage: Form validation failed, stopping submission');
      return
    }
    
    console.log('📝 LoginPage: Form validation passed, proceeding with login');
    
    setIsSubmitting(true)
    clearError()
    
    console.log('📝 LoginPage: State updated - isSubmitting: true, error cleared');
    
    try {
      console.log('📝 LoginPage: About to call login function');
      console.log('📝 LoginPage: Login function type:', typeof login);
      
      const response = await login({
        email,
        password,
        rememberMe
      })
      
      console.log('📝 LoginPage: Login function completed');
      console.log('📝 LoginPage: Login response received:', response);
      
      if (response.success) {
        console.log('📝 LoginPage: Login successful, showing success toast');
        toast.success('Login successful! Redirecting...')
        console.log('📝 LoginPage: Success toast displayed');
        // Redirect is handled in useAuth hook
      } else {
        console.log('📝 LoginPage: Login failed, showing error toast:', response.message);
        toast.error(response.message)
      }
    } catch (err) {
      console.log('📝 LoginPage: Login threw an exception:');
      console.error('📝 LoginPage: Exception details:', err);
      console.log('📝 LoginPage: Exception type:', typeof err);
      console.log('📝 LoginPage: Exception constructor:', err?.constructor?.name);
      
      if (err instanceof Error) {
        console.log('📝 LoginPage: Exception message:', err.message);
        console.log('📝 LoginPage: Exception stack:', err.stack);
      }
      
      toast.error('An unexpected error occurred')
      console.log('📝 LoginPage: Error toast displayed');
    } finally {
      console.log('📝 LoginPage: Setting isSubmitting to false');
      setIsSubmitting(false)
    }
    
    console.log('📝 LoginPage: handleSubmit completed');
  }

  // Handle social login (placeholder)
  const handleSocialLogin = (provider: 'google' | 'phone') => {
    console.log('📝 LoginPage: handleSocialLogin called with provider:', provider);
    toast.info(`${provider === 'google' ? 'Google' : 'Phone'} login will be available soon`)
  }

  console.log('📝 LoginPage: About to render component');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Sign In Form */}
        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-white px-6 py-8 shadow sm:px-10">
            <h3 className="mb-6 text-center text-lg font-medium text-gray-900">
              Sign In
            </h3>
            <p className="mb-6 text-center text-sm text-gray-600">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      console.log('📝 LoginPage: Email input changed to:', e.target.value);
                      setEmail(e.target.value)
                      if (errors.email) {
                        console.log('📝 LoginPage: Clearing email error');
                        setErrors({ ...errors, email: undefined })
                      }
                    }}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      console.log('📝 LoginPage: Password input changed (length):', e.target.value.length);
                      setPassword(e.target.value)
                      if (errors.password) {
                        console.log('📝 LoginPage: Clearing password error');
                        setErrors({ ...errors, password: undefined })
                      }
                    }}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      console.log('📝 LoginPage: Toggle password visibility from:', showPassword, 'to:', !showPassword);
                      setShowPassword(!showPassword)
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => {
                    console.log('📝 LoginPage: Remember me changed to:', checked);
                    setRememberMe(checked as boolean)
                  }}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
                onClick={() => console.log('📝 LoginPage: Submit button clicked')}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                disabled={isSubmitting}
                className="flex items-center justify-center"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('phone')}
                disabled={isSubmitting}
                className="flex items-center justify-center"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="ml-2">Phone</span>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Terms and Privacy */}
          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}