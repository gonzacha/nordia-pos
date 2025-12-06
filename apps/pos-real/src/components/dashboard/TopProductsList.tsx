'use client'
import { Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { TopProduct } from '@/types/dashboard'

interface TopProductsListProps {
  products: TopProduct[]
  loading?: boolean
}

export function TopProductsList({ products, loading }: TopProductsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-900">Top Productos</h3>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Sin ventas en este período</p>
      ) : (
        <div className="space-y-1">
          {products.map((product, index) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Ranking Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-200 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.productName}</p>
                <p className="text-xs text-gray-500">
                  {product.totalQuantity.toFixed(product.unit === 'kg' ? 2 : 0)} {product.unit}
                </p>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <p className="font-bold text-green-600">
                  ${product.totalRevenue.toLocaleString('es-AR')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
