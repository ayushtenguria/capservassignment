// /components/tour/tourData.ts

import { Sparkles, Home, TrendingUp, Gift, User } from 'lucide-react'

export interface TourStep {
  step: number
  icon: any
  iconBg: string
  title: string
  subtitle: string
  description?: string
  highlights?: Array<{
    label: string
    value: string
    color?: string
  }>
  features?: Array<{
    icon: any
    label: string
  }>
  showSkip: boolean
  nextButtonText: string
}

export const tourSteps: TourStep[] = [
  {
    step: 1,
    icon: Sparkles,
    iconBg: 'bg-blue-100',
    title: 'Welcome to CapServ!',
    subtitle: 'Your complete financial companion for smart loan management',
    description: "Let's take a quick tour to help you get the most out of our platform. This will only take 2 minutes.",
    features: [
      { icon: null, label: 'Smart Loans' },
      { icon: null, label: 'Rewards' }
    ],
    showSkip: true,
    nextButtonText: 'Next'
  },
  {
    step: 2,
    icon: Home,
    iconBg: 'bg-indigo-100',
    title: 'Your Financial Dashboard',
    subtitle: 'View your current loans, EMIs, and account balance',
    description: 'This is your financial command center. Monitor all your loans, track payments, and stay on top of your financial health.',
    highlights: [
      { label: 'EMIs', value: 'Track payments' },
      { label: 'Balance', value: 'View accounts' },
      { label: 'Insights', value: 'Financial tips' }
    ],
    showSkip: true,
    nextButtonText: 'Next'
  },
  {
    step: 3,
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    title: 'Loan Marketplace',
    subtitle: 'Discover and compare the best loan offers',
    description: 'Browse through our curated loan marketplace. Compare rates, terms, and find the perfect loan for your needs.',
    highlights: [
      { label: 'Personal Loans', value: '10.5% APR', color: 'text-green-600' },
      { label: 'Home Loans', value: '8.2% APR', color: 'text-green-600' },
      { label: 'Business Loans', value: '12.1% APR', color: 'text-green-600' }
    ],
    showSkip: true,
    nextButtonText: 'Next'
  },
  {
    step: 4,
    icon: Gift,
    iconBg: 'bg-purple-100',
    title: 'Rewards & Benefits',
    subtitle: 'Earn points and unlock exclusive benefits',
    description: 'Get rewarded for good financial behavior. Earn points for timely payments and unlock better rates.',
    highlights: [
      { label: 'Points Earned', value: '1,250', color: 'text-purple-600' },
      { label: 'Current Tier', value: 'Gold', color: 'text-yellow-600' }
    ],
    showSkip: true,
    nextButtonText: 'Next'
  },
  {
    step: 5,
    icon: User,
    iconBg: 'bg-orange-100',
    title: 'Your Profile',
    subtitle: 'Manage your account and track your KYC status',
    description: 'Complete your profile setup, manage your personal information, and track your verification status.',
    highlights: [
      { label: 'KYC Status', value: 'Complete', color: 'text-green-600' },
      { label: 'Credit Score', value: '750', color: 'text-blue-600' },
      { label: 'Notifications', value: 'Enabled', color: 'text-gray-600' }
    ],
    showSkip: false,
    nextButtonText: 'Get Started'
  }
]