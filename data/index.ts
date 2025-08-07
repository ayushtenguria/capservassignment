// /data/index.ts

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  password: string // Plain text for dev, should be hashed in production
  createdAt: string
  isVerified: boolean
  lastLogin: string | null
}

export interface PendingRegistration {
  tempId: string
  fullName: string
  email: string
  phone: string
  password: string
  otpSentAt: string
  otpExpiresAt: string
  attemptsLeft: number
}

export interface Session {
  token: string
  userId: string
  createdAt: string
  expiresAt: string
  rememberMe: boolean
}

export interface AuthConfig {
  otpValue: string
  otpExpiryMinutes: number
  maxOtpAttempts: number
  sessionExpiryHours: number
  rememberMeExpiryDays: number
}

export interface AuthData {
  registeredUsers: User[]
  pendingRegistrations: PendingRegistration[]
  sessions: Session[]
  config: AuthConfig
}

const authData: AuthData = {
  registeredUsers: [
    {
      id: "user_001",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+919876543210",
      password: "password123",
      createdAt: "2024-01-15T10:00:00Z",
      isVerified: true,
      lastLogin: "2024-08-07T09:00:00Z"
    },
    {
      id: "user_002",
      fullName: "Test User",
      email: "test@test.com",
      phone: "+919876543211",
      password: "test123",
      createdAt: "2024-01-20T11:00:00Z",
      isVerified: true,
      lastLogin: null
    }
  ],
  pendingRegistrations: [],
  sessions: [],
  config: {
    otpValue: "1234",
    otpExpiryMinutes: 5,
    maxOtpAttempts: 3,
    sessionExpiryHours: 24,
    rememberMeExpiryDays: 30
  }
}

export default authData