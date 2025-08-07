// /app/onboarding/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import KYCModal from './components/KYCModal'
import useAuth from '@/hooks/useAuth'

export default function OnboardingPage() {
  const [showKYCModal, setShowKYCModal] = useState(false)
  // FIX: Renamed `isLoading` from useAuth to avoid naming conflict.
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // FIX: Wait until the authentication check is complete before running any logic.
    if (isAuthLoading) {
      return
    }

    // FIX: This logic now only runs AFTER the auth check is done.
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')

    if (hasCompletedOnboarding === 'true') {
      router.push('/dashboard')
    } else {
      // Show KYC modal if onboarding is not complete
      setTimeout(() => {
        setShowKYCModal(true)
      }, 500)
    }
    // FIX: Added isAuthLoading as a dependency.
  }, [isAuthenticated, isAuthLoading, router])

  const handleModalClose = () => {
    // KYC is mandatory, so we don't actually close it
  }

  // FIX: The page's loading state is now tied directly to the authentication loading state.
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Checking your session...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,0.5))]" />

      {/* Main Content */}
      <div className="relative">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          {/* Welcome Message (shown behind modal) */}
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Welcome to CapServ
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Let's get your account set up in just a few steps
            </p>

            {/* Features Grid */}
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 text-3xl">🔒</div>
                <h3 className="mb-2 font-semibold text-gray-900">Secure</h3>
                <p className="text-sm text-gray-600">
                  Your data is encrypted and protected
                </p>
              </div>

              <div className="rounded-lg bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 text-3xl">⚡</div>
                <h3 className="mb-2 font-semibold text-gray-900">Quick</h3>
                <p className="text-sm text-gray-600">
                  Complete KYC in under 5 minutes
                </p>
              </div>

              <div className="rounded-lg bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 text-3xl">✨</div>
                <h3 className="mb-2 font-semibold text-gray-900">Easy</h3>
                <p className="text-sm text-gray-600">
                  Simple step-by-step process
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-12">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <span className="mr-2">📋</span>
                Complete your KYC to unlock all features
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Modal */}
      <KYCModal isOpen={showKYCModal} onClose={handleModalClose} />
    </div>
  )
}