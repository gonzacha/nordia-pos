'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Store, Package, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BusinessTemplate } from "@nordia/config"

interface OnboardingSuccessProps {
  storeName: string
  template: BusinessTemplate | null
  pin: string
}

export function OnboardingSuccess({ storeName, template, pin }: OnboardingSuccessProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  // Auto-redirect after countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Todo listo!
        </h2>
        <p className="text-gray-600">
          Tu negocio está configurado y listo para usar
        </p>
      </div>

      {/* Store Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{template?.icon || '🏪'}</div>
          <div>
            <h3 className="font-bold text-gray-900">{storeName}</h3>
            <p className="text-sm text-gray-500">{template?.name || 'Negocio'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span>{template?.products.length || 0} productos</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Store className="w-4 h-4" />
            <span>{template?.categories.length || 0} categorías</span>
          </div>
        </div>
      </motion.div>

      {/* PIN Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-amber-50 rounded-2xl p-4 border border-amber-100"
      >
        <p className="text-sm text-amber-700 font-medium mb-2">
          Tu PIN de acceso
        </p>
        <div className="flex justify-center gap-2">
          {pin.split('').map((digit, i) => (
            <span
              key={i}
              className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center text-xl font-bold"
            >
              {digit}
            </span>
          ))}
        </div>
        <p className="text-xs text-amber-600 mt-2">
          Recordá este PIN para acceder al sistema
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push('/login')}
        className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
      >
        <span>Ir a iniciar sesión</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* Auto-redirect notice */}
      <p className="text-sm text-gray-400">
        Redirigiendo automáticamente en {countdown} segundos...
      </p>
    </motion.div>
  )
}
