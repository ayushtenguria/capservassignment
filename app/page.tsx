'use client'

import { useEffect } from 'react'
import { useAuthContext } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      router.push(isAuthenticated ? '/dashboard' : '/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return null
  return <div>Redirecting...</div>
}
