'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Delete, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/authStore'

interface LoginFormProps {
  storeId: string
  storeName: string
  slug: string
}

export function LoginForm({ storeId, slug }: LoginFormProps) {
  const router = useRouter()
  const { login, isAuthenticated, isLoading, error } = useAuthStore()
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)

  // Si ya está autenticado, redirigir al dashboard de la tienda
  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${slug}/app/sell`)
    }
  }, [isAuthenticated, router, slug])

  const handleLogin = useCallback(async (pinToUse: string) => {
    const success = await login(pinToUse, storeId)
    if (!success) {
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setPin('')
      }, 500)
    }
  }, [login, storeId])

  const handleDigit = useCallback((digit: string) => {
    setPin(prev => {
      if (prev.length < 4) {
        const newPin = prev + digit
        if (newPin.length === 4) {
          setTimeout(() => handleLogin(newPin), 100)
        }
        return newPin
      }
      return prev
    })
  }, [handleLogin])

  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1))
  }, [])

  // Escuchar teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        handleDigit(e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handleDelete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoading, handleDigit, handleDelete])

  return (
    <div className="w-full max-w-xs">
      {/* PIN Display */}
      <div className={`flex gap-4 mb-8 justify-center ${shake ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
              pin.length > i
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-slate-700/50 border-slate-600 text-slate-400'
            }`}
          >
            {pin.length > i ? '●' : ''}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-400 mb-4 text-center">{error}</p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-amber-400 mb-4 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verificando...</span>
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => (
          <button
            key={key || 'empty'}
            onClick={() => {
              if (key === 'del') handleDelete()
              else if (key) handleDigit(key)
            }}
            disabled={isLoading || key === ''}
            className={`h-16 rounded-2xl text-2xl font-bold transition-all ${
              key === ''
                ? 'invisible'
                : key === 'del'
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 active:scale-95'
                : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
            }`}
          >
            {key === 'del' ? <Delete className="w-6 h-6 mx-auto" /> : key}
          </button>
        ))}
      </div>

      {/* Hint para desktop */}
      <p className="mt-6 text-slate-600 text-xs text-center hidden md:block">
        También podés usar el teclado numérico
      </p>
    </div>
  )
}
