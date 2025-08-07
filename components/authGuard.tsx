// /components/AuthGuard.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/otp-verify', '/', '/forgot-password']
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    const verifyAuth = async () => {
      // Check authentication status
      checkAuth()
      
      // Wait a bit for the auth check to complete
      setTimeout(() => {
        setIsVerifying(false)
      }, 100)
    }

    verifyAuth()
  }, [pathname])

  useEffect(() => {
    if (!isVerifying && !isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push('/login')
      } else if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        // Redirect to dashboard if authenticated and trying to access login/signup
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, isVerifying, pathname, isPublicRoute, router])

  // Show loading state
  if (isLoading || isVerifying) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // For protected routes, check authentication
  if (!isPublicRoute && !isAuthenticated) {
    return null // Will redirect in useEffect
  }

  // For login/signup pages, don't show if already authenticated
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}

export default AuthGuard

// HOC version for wrapping components
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string
    fallback?: React.ReactNode
  }
) => {
  const WrappedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(options?.redirectTo || '/login')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      if (options?.fallback) {
        return <>{options.fallback}</>
      }
      
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`
  
  return WrappedComponent
}