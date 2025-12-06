'use client'
import { AlertTriangle, Package, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface AlertCardProps {
  type: 'stock_low' | 'stock_out' | 'waste_high'
  title: string
  message: string
  value?: string
  onClick?: () => void
}

export function AlertCard({ type, title, message, value, onClick }: AlertCardProps) {
  const config = {
    stock_low: {
      icon: Package,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    stock_out: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    waste_high: {
      icon: TrendingDown,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
  }

  const { icon: Icon, bgColor, borderColor, iconColor, iconBg } = config[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={`${bgColor} ${borderColor} border rounded-xl p-3 ${
        onClick ? 'cursor-pointer hover:shadow-sm transition-shadow' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-600 truncate">{message}</p>
        </div>
        {value && (
          <span className={`text-sm font-bold ${iconColor}`}>{value}</span>
        )}
      </div>
    </motion.div>
  )
}
