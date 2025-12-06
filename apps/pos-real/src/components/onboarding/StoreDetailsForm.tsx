'use client'

import { motion } from 'framer-motion'
import { Store, Phone, MapPin } from 'lucide-react'
import { OnboardingData } from '@/types/onboarding'

interface StoreDetailsFormProps {
  data: OnboardingData
  errors: Partial<Record<keyof OnboardingData, string>>
  onStoreName: (name: string) => void
  onPhone: (phone: string) => void
  onAddress: (address: string) => void
}

export function StoreDetailsForm({
  data,
  errors,
  onStoreName,
  onPhone,
  onAddress
}: StoreDetailsFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      {/* Store Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Store className="w-4 h-4 inline mr-2" />
          Nombre del negocio *
        </label>
        <input
          type="text"
          value={data.storeName}
          onChange={(e) => onStoreName(e.target.value)}
          placeholder="Ej: Carnicería Don Juan"
          className={`
            w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all
            ${errors.storeName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
          `}
        />
        {errors.storeName && (
          <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Teléfono (opcional)
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
          placeholder="Ej: 1155554444"
          className={`
            w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all
            ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
          `}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">Formato: 10-11 dígitos sin espacios</p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Dirección (opcional)
        </label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onAddress(e.target.value)}
          placeholder="Ej: Av. Corrientes 1234"
          className="
            w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all
            border-gray-200 bg-white
          "
        />
      </div>
    </motion.div>
  )
}
