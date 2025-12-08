'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'
import Link from 'next/link'

export default function OldLoginPage() {
  const router = useRouter()
  const { isAuthenticated, storeSlug } = useAuthStore()

  // Si ya está autenticado, redirigir a su tienda
  useEffect(() => {
    if (isAuthenticated && storeSlug) {
      router.push(`/${storeSlug}/app/sell`)
    }
  }, [isAuthenticated, storeSlug, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🏪</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">Nordia POS</h1>

      <div className="bg-slate-800 rounded-xl p-6 max-w-md text-center mt-6">
        <p className="text-slate-300 mb-4">
          Para ingresar a tu negocio, usá el link único que te enviamos.
        </p>
        <p className="text-slate-400 text-sm mb-6">
          Ejemplo: <code className="bg-slate-700 px-2 py-1 rounded">pos.nordia.uno/tu-negocio</code>
        </p>

        <div className="border-t border-slate-700 pt-4 mt-4">
          <p className="text-slate-500 text-xs">
            ¿No tenés tu link? Contactá a tu administrador o{' '}
            <Link href="/" className="text-amber-500 hover:text-amber-400">
              creá tu negocio
            </Link>
          </p>
        </div>
      </div>

      {/* Link temporal para testing - REMOVER EN PRODUCCIÓN */}
      <div className="mt-8 text-slate-600 text-xs">
        <p>Links de prueba:</p>
        <div className="flex gap-4 mt-2">
          <Link href="/mi-carniceria" className="text-amber-500 hover:text-amber-400">
            /mi-carniceria
          </Link>
          <Link href="/mi-negocio" className="text-amber-500 hover:text-amber-400">
            /mi-negocio
          </Link>
        </div>
      </div>
    </div>
  )
}
