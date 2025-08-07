// /hooks/useAuth.ts
'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import authService, { LoginCredentials, RegisterData, AuthResponse } from '@/services/authServices'
import storageService from '@/services/storageService'

interface User {
  id: string
  fullName: string
  email: string
  phone: string
}

interface UseAuthReturn {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Methods
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  verifyOTP: (email: string, otp: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  clearError: () => void
  checkAuth: () => void
}

// Create context first
const AuthContext = createContext<UseAuthReturn | undefined>(undefined)

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Check if user is authenticated
  const checkAuth = useCallback(() => {
    setIsLoading(true)
    try {
      const isValid = authService.checkSession()
      if (isValid) {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (err) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login method
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        
        // Redirect to dashboard or home page
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } else {
        setError(response.message)
      }
      
      return response
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during login'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Register method
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(data)
      
      if (!response.success) {
        setError(response.message)
      }
      
      return response
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during registration'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Verify OTP method
  const verifyOTP = useCallback(async (email: string, otp: string): Promise<AuthResponse> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.verifyOTP(email, otp)
      
      if (response.success) {
        // Redirect to login page after successful verification
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } else {
        setError(response.message)
      }
      
      return response
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during OTP verification'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Logout method
  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      
      // Redirect to login page
      router.push('/login')
    } catch (err) {
      setError('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    verifyOTP,
    logout,
    clearError,
    checkAuth
  }
}

// Provider component for context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default useAuth