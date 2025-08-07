// /services/storageService.ts

interface StoredUser {
  id: string
  fullName: string
  email: string
  phone: string
}

interface StoredSession {
  token: string
  userId: string
  expiresAt: string
  rememberMe: boolean
}

interface PendingRegistrationData {
  tempId: string
  fullName: string
  email: string
  phone: string
  password: string
  otpSentAt: string
  otpExpiresAt: string
  attemptsLeft: number  
}

class StorageService {
  // Keys for localStorage
  private readonly AUTH_TOKEN_KEY = 'authToken'
  private readonly USER_INFO_KEY = 'userInfo'
  private readonly REMEMBER_ME_KEY = 'rememberMe'
  private readonly SESSION_EXPIRY_KEY = 'sessionExpiry'

  // Keys for sessionStorage
  private readonly PENDING_REGISTRATION_KEY = 'pendingRegistration'
  private readonly OTP_EXPIRY_KEY = 'otpExpiry'
  private readonly REGISTRATION_EMAIL_KEY = 'registrationEmail'

  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  // LocalStorage methods
  setAuthToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token)
    }
  }

  getAuthToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.AUTH_TOKEN_KEY)
    }
    return null
  }

  setUserInfo(user: StoredUser): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(user))
    }
  }

  getUserInfo(): StoredUser | null {
    if (this.isBrowser()) {
      const userStr = localStorage.getItem(this.USER_INFO_KEY)
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch {
          return null
        }
      }
    }
    return null
  }

  setRememberMe(value: boolean): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.REMEMBER_ME_KEY, value.toString())
    }
  }

  getRememberMe(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true'
    }
    return false
  }

  setSessionExpiry(expiryDate: Date): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryDate.toISOString())
    }
  }

  getSessionExpiry(): Date | null {
    if (this.isBrowser()) {
      const expiryStr = localStorage.getItem(this.SESSION_EXPIRY_KEY)
      if (expiryStr) {
        return new Date(expiryStr)
      }
    }
    return null
  }

  setSession(session: StoredSession): void {
    this.setAuthToken(session.token)
    this.setSessionExpiry(new Date(session.expiresAt))
    this.setRememberMe(session.rememberMe)
  }

  // SessionStorage methods
  setPendingRegistration(data: PendingRegistrationData): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.PENDING_REGISTRATION_KEY, JSON.stringify(data))
    }
  }

  getPendingRegistration(): PendingRegistrationData | null {
    if (this.isBrowser()) {
      const dataStr = sessionStorage.getItem(this.PENDING_REGISTRATION_KEY)
      if (dataStr) {
        try {
          return JSON.parse(dataStr)
        } catch {
          return null
        }
      }
    }
    return null
  }

  setOtpExpiry(expiryDate: Date): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.OTP_EXPIRY_KEY, expiryDate.toISOString())
    }
  }

  getOtpExpiry(): Date | null {
    if (this.isBrowser()) {
      const expiryStr = sessionStorage.getItem(this.OTP_EXPIRY_KEY)
      if (expiryStr) {
        return new Date(expiryStr)
      }
    }
    return null
  }

  setRegistrationEmail(email: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.REGISTRATION_EMAIL_KEY, email)
    }
  }

  getRegistrationEmail(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem(this.REGISTRATION_EMAIL_KEY)
    }
    return null
  }

  // Clear methods
  clearAuth(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY)
      localStorage.removeItem(this.USER_INFO_KEY)
      localStorage.removeItem(this.REMEMBER_ME_KEY)
      localStorage.removeItem(this.SESSION_EXPIRY_KEY)
    }
  }

  clearPendingRegistration(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.PENDING_REGISTRATION_KEY)
      sessionStorage.removeItem(this.OTP_EXPIRY_KEY)
      sessionStorage.removeItem(this.REGISTRATION_EMAIL_KEY)
    }
  }

  clearAll(): void {
    this.clearAuth()
    this.clearPendingRegistration()
  }

  // Validation methods
  isSessionValid(): boolean {
    const token = this.getAuthToken()
    const expiry = this.getSessionExpiry()
    
    if (!token || !expiry) {
      return false
    }

    const now = new Date()
    if (now > expiry) {
      this.clearAuth()
      return false
    }

    return true
  }

  isOtpValid(): boolean {
    const expiry = this.getOtpExpiry()
    
    if (!expiry) {
      return false
    }

    const now = new Date()
    if (now > expiry) {
      return false
    }

    return true
  }
}

// Export singleton instance
const storageService = new StorageService()
export default storageService