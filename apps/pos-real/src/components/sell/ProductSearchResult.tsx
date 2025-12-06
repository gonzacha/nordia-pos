'use client'
import { Plus } from 'lucide-react'
import { Product } from '@/lib/productsStore'

interface ProductSearchResultProps {
  products: Product[]
  searchQuery: string
  onSelectProduct: (product: Product) => void
}

const getProductIcon = (unit: string): string => {
  switch (unit) {
    case 'kg':
      return '🥩'
    case 'lt':
      return '🥤'
    default:
      return '📦'
  }
}

const getUnitLabel = (unit: string): string => {
  switch (unit) {
    case 'kg':
      return 'kg'
    case 'lt':
      return 'lt'
    default:
      return 'unidad'
  }
}

export function ProductSearchResult({
  products,
  searchQuery,
  onSelectProduct
}: ProductSearchResultProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-gray-500 text-lg font-medium">
          No se encontró "{searchQuery}"
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Probá con otro nombre o código
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {products.slice(0, 8).map((product) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                {getProductIcon(product.unit)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  ${product.price.toLocaleString('es-AR')} / {getUnitLabel(product.unit)}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
          </button>
        ))}
      </div>
      {products.length > 8 && (
        <div className="px-4 py-3 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            +{products.length - 8} resultados más
          </p>
        </div>
      )}
    </div>
  )
}
