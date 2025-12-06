'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'
import { Permission } from '@/types/auth'
import { Store, Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: Permission
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, checkPermission, isLoading } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to allow hydration
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (requiredPermission && !checkPermission(requiredPermission)) {
        // User doesn't have permission - redirect to sell (base permission)
        router.replace('/app/sell')
      } else {
        setIsChecking(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, requiredPermission, checkPermission, router])

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-nordia-primary flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-nordia-accent rounded-2xl flex items-center justify-center mb-6 animate-pulse">
          <Store className="h-10 w-10 text-white" />
        </div>
        <Loader2 className="h-8 w-8 text-white animate-spin" />
        <p className="text-white/60 mt-4">Cargando...</p>
      </div>
    )
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return null
  }

  // No permission - will redirect
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return null
  }

  return <>{children}</>
}
