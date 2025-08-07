// /services/authService.ts

import authData, { User, PendingRegistration } from '@/data'
import storageService from './storageService'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterData {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: any
}

class AuthService {
  // Generate a simple token (in production, this would be JWT from backend)
  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Generate unique user ID
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  }

  // Check if email already exists
  private checkEmailExists(email: string): boolean {
    return authData.registeredUsers.some(user => 
      user.email.toLowerCase() === email.toLowerCase()
    )
  }

  // Register new user - Step 1: Initiate registration
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if email already exists
      if (this.checkEmailExists(data.email)) {
        return {
          success: false,
          message: 'An account with this email already exists'
        }
      }

      // Create pending registration
      const tempId = `temp_${Date.now()}`
      const now = new Date()
      const expiryTime = new Date(now.getTime() + authData.config.otpExpiryMinutes * 60000)

      const pendingReg: PendingRegistration = {
        tempId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        otpSentAt: now.toISOString(),
        otpExpiresAt: expiryTime.toISOString(),
        attemptsLeft: authData.config.maxOtpAttempts
      }

      // Store in session storage
      storageService.setPendingRegistration(pendingReg)
      storageService.setOtpExpiry(expiryTime)
      storageService.setRegistrationEmail(data.email)

      // In production, this would trigger actual OTP sending
      console.log(`[DEV] OTP sent to ${data.email} and ${data.phone}: ${authData.config.otpValue}`)

      return {
        success: true,
        message: 'OTP has been sent to your email and phone',
        data: {
          email: data.email,
          otpExpiryMinutes: authData.config.otpExpiryMinutes
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      }
    }
  }

  // Verify OTP - Step 2: Complete registration
  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    try {
      // Check if OTP is still valid
      if (!storageService.isOtpValid()) {
        storageService.clearPendingRegistration()
        return {
          success: false,
          message: 'OTP has expired. Please register again.'
        }
      }

      // Get pending registration
      const pendingReg = storageService.getPendingRegistration()
      if (!pendingReg || pendingReg.email !== email) {
        return {
          success: false,
          message: 'No pending registration found for this email'
        }
      }

      // Verify OTP
      if (otp !== authData.config.otpValue) {
        // Decrease attempts
        pendingReg.attemptsLeft -= 1
        
        if (pendingReg.attemptsLeft <= 0) {
          storageService.clearPendingRegistration()
          return {
            success: false,
            message: 'Maximum OTP attempts exceeded. Please register again.'
          }
        }

        storageService.setPendingRegistration(pendingReg)
        return {
          success: false,
          message: `Invalid OTP. ${pendingReg.attemptsLeft} attempts remaining.`
        }
      }

      // OTP is valid, create user
      const newUser: User = {
        id: this.generateUserId(),
        fullName: pendingReg.fullName,
        email: pendingReg.email,
        phone: pendingReg.phone,
        password: pendingReg.password,
        createdAt: new Date().toISOString(),
        isVerified: true,
        lastLogin: null
      }

      // Add to registered users (in production, this would be saved to database)
      authData.registeredUsers.push(newUser)

      // Clear pending registration
      storageService.clearPendingRegistration()

      return {
        success: true,
        message: 'Registration successful! Please login with your credentials.',
        data: {
          email: newUser.email
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'OTP verification failed. Please try again.'
      }
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user
      const user = authData.registeredUsers.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
      )

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      if (!user.isVerified) {
        return {
          success: false,
          message: 'Please verify your account first'
        }
      }

      // Generate session
      const token = this.generateToken()
      const now = new Date()
      const expiryHours = credentials.rememberMe 
        ? authData.config.rememberMeExpiryDays * 24 
        : authData.config.sessionExpiryHours
      const expiryTime = new Date(now.getTime() + expiryHours * 3600000)

      // Update user last login
      user.lastLogin = now.toISOString()

      // Store session
      storageService.setSession({
        token,
        userId: user.id,
        expiresAt: expiryTime.toISOString(),
        rememberMe: credentials.rememberMe
      })

      // Store user info
      storageService.setUserInfo({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      })

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone
          },
          token
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.'
      }
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      storageService.clearAuth()
      return {
        success: true,
        message: 'Logged out successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed'
      }
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return storageService.isSessionValid()
  }

  // Get current user
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null
    }
    return storageService.getUserInfo()
  }

  // Check session validity
  checkSession(): boolean {
    return storageService.isSessionValid()
  }

  // Resend OTP (for future implementation)
  async resendOTP(email: string): Promise<AuthResponse> {
    const pendingReg = storageService.getPendingRegistration()
    
    if (!pendingReg || pendingReg.email !== email) {
      return {
        success: false,
        message: 'No pending registration found'
      }
    }

    // Reset OTP expiry
    const now = new Date()
    const expiryTime = new Date(now.getTime() + authData.config.otpExpiryMinutes * 60000)
    
    pendingReg.otpSentAt = now.toISOString()
    pendingReg.otpExpiresAt = expiryTime.toISOString()
    pendingReg.attemptsLeft = authData.config.maxOtpAttempts

    storageService.setPendingRegistration(pendingReg)
    storageService.setOtpExpiry(expiryTime)

    console.log(`[DEV] OTP resent to ${email}: ${authData.config.otpValue}`)

    return {
      success: true,
      message: 'OTP has been resent to your email and phone'
    }
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService