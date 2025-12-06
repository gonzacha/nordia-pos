'use client'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: 'default' | 'success' | 'warning' | 'danger'
  loading?: boolean
}

export function KPICard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  color = 'default',
  loading = false,
}: KPICardProps) {
  const colorStyles = {
    default: 'bg-white border-gray-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-yellow-50 border-yellow-100',
    danger: 'bg-red-50 border-red-100',
  }

  const getTrendIcon = () => {
    if (change === undefined || change === null) return null
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getTrendColor = () => {
    if (change === undefined || change === null) return 'text-gray-500'
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  if (loading) {
    return (
      <div className={`rounded-2xl border p-4 ${colorStyles[color]} animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${colorStyles[color]} shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
        </span>
      </div>

      {/* Subtitle & Change */}
      <div className="flex items-center justify-between">
        {subtitle && (
          <span className="text-sm text-gray-500">{subtitle}</span>
        )}

        {change !== undefined && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            {changeLabel && (
              <span className="text-xs text-gray-400 ml-1">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
