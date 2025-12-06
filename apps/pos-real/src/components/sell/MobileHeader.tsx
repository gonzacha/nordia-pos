'use client'
import { useState } from 'react'
import { Store, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'

interface MobileHeaderProps {
  storeName: string
}

export function MobileHeader({ storeName }: MobileHeaderProps) {
  const router = useRouter()
  const { user, logout, checkPermission } = useAuthStore()
  const canAccessSettings = checkPermission('settings')
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-nordia-primary text-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-nordia-accent rounded-xl flex items-center justify-center">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">{storeName}</h1>
          <p className="text-xs text-white/70">Punto de venta</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* User button with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            <div className="w-7 h-7 bg-nordia-accent rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-left hidden min-[360px]:block">
              <p className="text-sm font-medium leading-tight">{user?.name || 'Usuario'}</p>
              <p className="text-[10px] text-white/60">
                {user?.role === 'admin' ? 'Admin' : 'Cajero'}
              </p>
            </div>
            <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
                  </p>
                </div>
                {canAccessSettings && (
                  <Link
                    href="/app/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Configuración</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
