'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { BusinessType, getAllBusinessTemplates } from "@nordia/config"

interface StoreTypeSelectorProps {
  selected: BusinessType | null
  onSelect: (type: BusinessType) => void
}

export function StoreTypeSelector({ selected, onSelect }: StoreTypeSelectorProps) {
  const templates = getAllBusinessTemplates()

  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template, index) => {
        const isSelected = selected === template.id

        return (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(template.id)}
            className={`
              relative p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${isSelected
                ? 'bg-amber-50 border-amber-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Icon */}
            <div className="text-4xl mb-2">{template.icon}</div>

            {/* Name */}
            <h3 className={`font-bold text-sm ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>
              {template.name}
            </h3>

            {/* Description - truncated */}
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {template.description}
            </p>

            {/* Products count */}
            <p className="text-xs text-gray-400 mt-2">
              {template.products.length} productos
            </p>
          </motion.button>
        )
      })}
    </div>
  )
}
