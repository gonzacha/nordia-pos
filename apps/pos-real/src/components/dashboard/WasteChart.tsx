'use client'
import { TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { WasteDetail, WASTE_REASON_LABELS } from '@/types/dashboard'

interface WasteChartProps {
  data: Record<string, WasteDetail[]>
  loading?: boolean
}

export function WasteChart({ data, loading }: WasteChartProps) {
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(new Set())

  const toggleReason = (reason: string) => {
    const newExpanded = new Set(expandedReasons)
    if (newExpanded.has(reason)) {
      newExpanded.delete(reason)
    } else {
      newExpanded.add(reason)
    }
    setExpandedReasons(newExpanded)
  }

  const reasons = Object.keys(data)
  const totalWaste = reasons.reduce((sum, reason) => {
    return sum + data[reason].reduce((s, p) => s + p.totalQuantity, 0)
  }, 0)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (reasons.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-900">Merma</h3>
        </div>
        <p className="text-center text-gray-500 py-4">Sin merma registrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-900">Merma</h3>
        </div>
        <span className="text-sm font-bold text-red-600">
          {totalWaste.toFixed(2)} kg total
        </span>
      </div>

      <div className="space-y-3">
        {reasons.map((reason) => {
          const products = data[reason]
          const reasonTotal = products.reduce((sum, p) => sum + p.totalQuantity, 0)
          const percentage = totalWaste > 0 ? (reasonTotal / totalWaste) * 100 : 0
          const label = WASTE_REASON_LABELS[reason] || reason
          const isExpanded = expandedReasons.has(reason)

          return (
            <div key={reason} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              {/* Razón header - clickeable */}
              <button
                onClick={() => toggleReason(reason)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-gray-400">
                      ({products.length} producto{products.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <span className="font-bold text-red-600">
                    {reasonTotal.toFixed(2)} kg
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-6">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>

              {/* Lista de productos expandible */}
              {isExpanded && (
                <div className="mt-2 ml-6 pl-4 border-l-2 border-red-100 space-y-1">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-gray-600">{product.productName}</span>
                      <span className="text-gray-900 font-medium">
                        {product.totalQuantity.toFixed(2)} kg
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
