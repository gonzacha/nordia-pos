'use client'
import { useState, useRef } from 'react'
import { Trash2 } from 'lucide-react'

interface CartItemSwipeableProps {
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
  onEdit: () => void
}

export function CartItemSwipeable({ item, unit, onRemove, onEdit }: CartItemSwipeableProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const currentX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    currentX.current = e.touches[0].clientX
    const diff = startX.current - currentX.current
    // Solo permitir swipe a la izquierda, máximo 80px
    const newTranslate = Math.min(Math.max(diff, 0), 80)
    setTranslateX(newTranslate)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    // Si swipeó más de 40px, mostrar botón eliminar
    if (translateX > 40) {
      setTranslateX(80)
    } else {
      setTranslateX(0)
    }
  }

  const handleClick = () => {
    if (translateX === 0) {
      onEdit()
    } else {
      // Si está abierto el swipe, cerrarlo
      setTranslateX(0)
    }
  }

  const isPorPeso = unit === 'kg' || unit === 'lt'
  const displayQty = isPorPeso
    ? `${(item.weight || 0).toFixed(2)}${unit}`
    : `x${item.quantity}`

  return (
    <div className="relative overflow-hidden">
      {/* Botón eliminar (detrás) */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <Trash2 className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Item (se desliza) */}
      <div
        className={`relative bg-white p-3 flex items-center justify-between ${
          isDragging ? '' : 'transition-transform duration-200'
        }`}
        style={{ transform: `translateX(-${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{item.productName}</p>
          <p className="text-sm text-gray-500">
            {displayQty} × ${item.unitPrice.toLocaleString('es-AR')}
          </p>
        </div>
        <p className="font-bold text-green-700 text-lg">
          ${item.subtotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  )
}
