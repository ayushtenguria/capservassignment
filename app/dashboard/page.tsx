// /app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, Mail, Calendar, Shield } from 'lucide-react'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import TourModal from '@/components/tour/TourModal'

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showTour, setShowTour] = useState(false)

  // Check if tour should be shown
  useEffect(() => {
    if (user && !isLoading) {
      const hasSeenTour = localStorage.getItem('hasSeenTour')
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')
      
      // Show tour only for new users who haven't seen it and haven't completed onboarding
      if (!hasSeenTour && !hasCompletedOnboarding) {
        // Small delay to ensure dashboard is rendered before showing tour
        setTimeout(() => {
          setShowTour(true)
        }, 500)
      } else if (!hasCompletedOnboarding) {
        // If tour is seen but onboarding not complete, redirect to onboarding
        router.push('/onboarding')
      }
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const handleCloseTour = () => {
    setShowTour(false)
    // FIX: Set 'hasSeenTour' in localStorage when the tour is closed.
    // This prevents it from showing up again on the next render.
    localStorage.setItem('hasSeenTour', 'true')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-900"></div>
      </div>
    )
  }

  if (!user) {
    return null // AuthGuard will handle redirect
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gray-900">CapServ Dashboard</h1>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.fullName}!
            </h2>
            <p className="mt-2 text-gray-600">
              Your complete financial companion for smart loan management
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-900" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-base text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="font-mono text-sm text-gray-900">{user.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* EMIs & Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-blue-900" />
                  EMIs & Balance
                </CardTitle>
                <CardDescription>Track payments and accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active EMIs</p>
                  <p className="text-base text-gray-900">3 Active</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Balance</p>
                  <p className="text-base text-gray-900">₹2,45,000</p>
                </div>
              </CardContent>
            </Card>

            {/* Loan Marketplace Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-900" />
                  Loan Marketplace
                </CardTitle>
                <CardDescription>Best offers available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Personal Loan</p>
                  <p className="text-base font-medium text-green-600">10.5% APR</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Home Loan</p>
                  <p className="text-base font-medium text-green-600">8.2% APR</p>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-900" />
                  Rewards & Benefits
                </CardTitle>
                <CardDescription>Your reward status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Points Earned</p>
                  <p className="text-base font-medium text-purple-600">1,250 Points</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Tier</p>
                  <p className="text-base font-medium text-yellow-600">Gold</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Status Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile for better offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">KYC Status</span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Credit Score</span>
                    <span className="font-mono text-lg font-semibold text-gray-900">750</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Notifications</span>
                    <span className="text-sm text-gray-900">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => toast.info('Feature coming soon!')}>
                Apply for Loan
              </Button>
              <Button variant="outline" onClick={() => toast.info('Feature coming soon!')}>
                View EMI Schedule
              </Button>
              <Button variant="outline" onClick={() => toast.info('Feature coming soon!')}>
                Rewards Store
              </Button>
              <Button variant="outline" onClick={() => toast.info('Feature coming soon!')}>
                Settings
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Tour Modal */}
      <TourModal 
        isOpen={showTour} 
        onClose={handleCloseTour}
      />
    </>
  )
}