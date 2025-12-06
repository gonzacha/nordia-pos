'use client'

import { useState } from 'react'
import { Package, Plus, TrendingDown, Search, AlertTriangle } from 'lucide-react'
import { useProductsStore } from '@/lib/productsStore'
import { useStockStore } from '@/lib/stockStore'
import { useAuthStore } from '@/lib/authStore'
import { StockQuickEntrySheet } from '@/components/stock/StockQuickEntrySheet'
import { MermaSheet } from '@/components/stock/MermaSheet'

export default function StockPage() {
  const { products } = useProductsStore()
  const { getProductsStock } = useStockStore()
  const { checkPermission } = useAuthStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [showEntrySheet, setShowEntrySheet] = useState(false)
  const [showMermaSheet, setShowMermaSheet] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  // Verificar permiso
  const canManageStock = checkPermission('manage_stock')

  // Adaptar productos para getProductsStock
  const productsForStock = products.map(p => ({
    id: p.id,
    name: p.name,
    unit: p.unit,
    trackStock: p.trackStock,
  }))

  // Obtener stock de productos
  const productsStock = getProductsStock(productsForStock)

  // Filtrar por búsqueda
  const filteredStock = productsStock.filter((ps) =>
    ps.productName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Ordenar: primero los que tienen problemas
  const sortedStock = [...filteredStock].sort((a, b) => {
    const order = { out: 0, low: 1, ok: 2 }
    return order[a.status] - order[b.status]
  })

  const handleAddStock = (productId?: string) => {
    setSelectedProductId(productId || null)
    setShowEntrySheet(true)
  }

  const handleAddMerma = (productId?: string) => {
    setSelectedProductId(productId || null)
    setShowMermaSheet(true)
  }

  if (!canManageStock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600">No tenés permiso para ver el stock.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          Gestión de Stock
        </h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex gap-2">
        <button
          onClick={() => handleAddStock()}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold active:scale-[0.98] transition-transform"
        >
          <Plus className="w-5 h-5" />
          Cargar Mercadería
        </button>
        <button
          onClick={() => handleAddMerma()}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-100 text-red-700 rounded-xl font-semibold active:scale-[0.98] transition-transform"
        >
          <TrendingDown className="w-5 h-5" />
          Registrar Merma
        </button>
      </div>

      {/* Stock List */}
      <div className="px-4">
        {sortedStock.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No hay productos con stock habilitado</p>
            <p className="text-sm">Activá &quot;Controlar stock&quot; en los productos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedStock.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Semáforo */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'ok'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'low'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status === 'out' && <AlertTriangle className="w-3 h-3" />}
                        {item.status === 'ok' && '✓'}
                        {item.status === 'low' && '⚠️'}
                        {item.status === 'out' && ' Sin stock'}
                        {item.status === 'low' && ' Stock bajo'}
                        {item.status === 'ok' && ' OK'}
                      </span>
                    </div>
                  </div>

                  {/* Cantidad */}
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      item.status === 'out'
                        ? 'text-red-600'
                        : item.status === 'low'
                        ? 'text-yellow-600'
                        : 'text-gray-800'
                    }`}>
                      {item.currentStock.toFixed(item.unit === 'kg' ? 2 : 0)}
                    </p>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleAddStock(item.productId)}
                    className="flex-1 py-2 text-sm text-green-700 bg-green-50 rounded-lg font-medium active:scale-[0.98] transition-transform"
                  >
                    + Ingreso
                  </button>
                  <button
                    onClick={() => handleAddMerma(item.productId)}
                    className="flex-1 py-2 text-sm text-red-700 bg-red-50 rounded-lg font-medium active:scale-[0.98] transition-transform"
                  >
                    - Merma
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sheets */}
      <StockQuickEntrySheet
        open={showEntrySheet}
        onClose={() => {
          setShowEntrySheet(false)
          setSelectedProductId(null)
        }}
        preselectedProductId={selectedProductId}
      />

      <MermaSheet
        open={showMermaSheet}
        onClose={() => {
          setShowMermaSheet(false)
          setSelectedProductId(null)
        }}
        preselectedProductId={selectedProductId}
      />
    </div>
  )
}
