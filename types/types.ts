// /app/onboarding/types.ts

export interface KYCData {
  // Step 1 - Basic Information
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  address: string
  
  // Step 2 - PAN Verification
  panNumber: string
  panVerified: boolean
  panCardImage: File | null
  panCardImageUrl: string
  
  // Step 3 - Photo Verification
  selfieImage: File | null
  selfieImageUrl: string
  photoVerified: boolean
  
  // Step 4 - Bank Verification
  verificationType: 'upi' | 'bank'
  upiId: string
  bankAccount: {
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  bankVerified: boolean
}

export interface KYCStep {
  stepNumber: number
  title: string
  subtitle: string
  label: string
  icon: any
  isCompleted: boolean
  isActive: boolean
  percentComplete: number
}

export interface ValidationErrors {
  fullName?: string
  dateOfBirth?: string
  phoneNumber?: string
  address?: string
  panNumber?: string
  panCardImage?: string
  selfieImage?: string
  upiId?: string
  bankAccount?: string
}

export interface VerificationStatus {
  pan: 'idle' | 'verifying' | 'verified' | 'failed'
  photo: 'idle' | 'verifying' | 'verified' | 'failed'
  bank: 'idle' | 'verifying' | 'verified' | 'failed'
}

export const initialKYCData: KYCData = {
  fullName: '',
  dateOfBirth: '',
  phoneNumber: '',
  address: '',
  panNumber: '',
  panVerified: false,
  panCardImage: null,
  panCardImageUrl: '',
  selfieImage: null,
  selfieImageUrl: '',
  photoVerified: false,
  verificationType: 'upi',
  upiId: '',
  bankAccount: {
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  },
  bankVerified: false
}

export const KYC_STEPS = [
  {
    number: 1,
    label: 'Basic Information',
    shortLabel: 'Basic Info',
    percentage: 25
  },
  {
    number: 2,
    label: 'PAN Verification',
    shortLabel: 'PAN',
    percentage: 50
  },
  {
    number: 3,
    label: 'Photo Verification',
    shortLabel: 'Photo',
    percentage: 75
  },
  {
    number: 4,
    label: 'Bank Verification',
    shortLabel: 'Bank',
    percentage: 100
  }
]