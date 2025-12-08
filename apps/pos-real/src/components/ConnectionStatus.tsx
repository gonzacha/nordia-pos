'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

/**
 * Indicador de conexión offline/online
 * Muestra banner amarillo fijo cuando no hay internet
 * Se oculta automáticamente cuando vuelve la conexión
 */
export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    // Estado inicial
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      // Mostrar mensaje de reconexión por 3 segundos
      setShowReconnected(true)
      setTimeout(() => setShowReconnected(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowReconnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Mostrar banner de reconexión (verde)
  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-bold z-50 flex items-center justify-center gap-2 animate-pulse">
        <Wifi className="h-4 w-4" />
        <span>Conexión restablecida</span>
      </div>
    )
  }

  // No mostrar nada si está online
  if (isOnline) return null

  // Mostrar banner offline (amarillo)
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-bold z-50 flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>📡 Sin conexión - Los cambios se guardarán cuando vuelva internet</span>
    </div>
  )
}
