'use client'
import { useState } from 'react'
import { Trash2, Minus, Plus } from 'lucide-react'

interface CartItemProps {
  item: {
    productId: string
    productName: string
    unitPrice: number
    quantity: number
    weight?: number
    subtotal: number
  }
  unit: 'kg' | 'unit' | 'lt'
  onRemove: () => void
  onUpdateQuantity: (newQty: number) => void
}

export function CartItem({ item, unit, onRemove, onUpdateQuantity }: CartItemProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swiped, setSwiped] = useState(false)

  // Detectar swipe
  const minSwipeDistance = 100

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance

    if (isLeftSwipe) {
      setSwiped(true)
    } else {
      setSwiped(false)
    }
  }

  const isPorPeso = unit === 'kg' || unit === 'lt'
  const displayQty = isPorPeso
    ? `${(item.weight || item.quantity).toFixed(3)} ${unit}`
    : `x${item.quantity}`

  return (
    <div className="relative overflow-hidden rounded-xl mb-2">
      {/* Botón eliminar (aparece con swipe) */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center transition-transform ${
          swiped ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button onClick={onRemove} className="p-4">
          <Trash2 className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Contenido del item */}
      <div
        className={`bg-white p-4 flex items-center justify-between transition-transform ${
          swiped ? '-translate-x-20' : 'translate-x-0'
        }`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => swiped && setSwiped(false)}
      >
        <div className="flex-1">
          <p className="font-semibold text-lg">{item.productName}</p>
          <p className="text-gray-500">
            {displayQty} × ${item.unitPrice.toLocaleString('es-AR')}/{unit === 'unit' ? 'u' : unit}
          </p>
        </div>

        {/* Controles de cantidad para productos por unidad */}
        {!isPorPeso && (
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => item.quantity > 1 && onUpdateQuantity(item.quantity - 1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-bold">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        <p className="font-bold text-xl text-green-700">
          ${item.subtotal.toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  )
}
