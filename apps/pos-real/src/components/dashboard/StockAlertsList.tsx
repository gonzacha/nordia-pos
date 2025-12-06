'use client'
import { AlertTriangle, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { StockAlert } from '@/types/dashboard'
import { useRouter } from 'next/navigation'

interface StockAlertsListProps {
  alerts: StockAlert[]
  loading?: boolean
}

export function StockAlertsList({ alerts, loading }: StockAlertsListProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const outOfStock = alerts.filter(a => a.alertType === 'out_of_stock')
  const lowStock = alerts.filter(a => a.alertType === 'low_stock')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Alertas de Stock</h3>
        </div>
        {alerts.length > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            {alerts.length} alertas
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-6">
          <Package className="w-12 h-12 text-green-200 mx-auto mb-2" />
          <p className="text-green-600 font-medium">Stock OK</p>
          <p className="text-xs text-gray-500">No hay alertas</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {/* Sin Stock */}
          {outOfStock.map((alert, index) => (
            <motion.div
              key={alert.productId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push('/app/stock')}
              className="flex items-center gap-3 p-2 bg-red-50 border border-red-100 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{alert.productName}</p>
                <p className="text-xs text-red-600">Sin stock</p>
              </div>
            </motion.div>
          ))}

          {/* Stock Bajo */}
          {lowStock.map((alert, index) => (
            <motion.div
              key={alert.productId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (outOfStock.length + index) * 0.05 }}
              onClick={() => router.push('/app/stock')}
              className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{alert.productName}</p>
                <p className="text-xs text-yellow-600">
                  {alert.currentStock.toFixed(alert.unit === 'kg' ? 2 : 0)} {alert.unit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
