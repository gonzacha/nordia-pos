/**
 * SWIPEABLE CART ITEM
 * Item del carrito con gestos de swipe para móvil
 * Swipe izquierda: eliminar, Swipe derecha: opciones
 */

import React, { useState } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { useTouchOptimization } from '@/hooks/useResponsive'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface SwipeableCartItemProps {
  item: CartItem
  onUpdateQuantity: (itemId: number, delta: number) => void
  onRemove: (itemId: number) => void
  formatPrice: (price: number) => string
}

export function SwipeableCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  formatPrice
}: SwipeableCartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { hapticFeedback, touchStyles } = useTouchOptimization()

  // Motion values para el swipe
  const x = useMotionValue(0)
  const backgroundColor = useTransform(
    x,
    [-100, -50, 0, 50, 100],
    ['#EF4444', '#FCA5A5', '#FFFFFF', '#34D399', '#10B981']
  )

  const triggerHaptic = (intensity = 10) => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(intensity)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 80
    const velocity = info.velocity.x

    // Swipe izquierda fuerte: eliminar
    if (info.offset.x < -threshold || velocity < -500) {
      triggerHaptic(20)
      setIsRemoving(true)
      setTimeout(() => onRemove(item.id), 300)
      return
    }

    // Swipe derecha fuerte: incrementar cantidad
    if (info.offset.x > threshold || velocity > 500) {
      triggerHaptic(15)
      onUpdateQuantity(item.id, 1)
    }

    // Volver a posición original
    x.set(0)
  }

  const handleTap = () => {
    triggerHaptic(5)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background indicators */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-4"
        style={{ backgroundColor }}
      >
        {/* Left action: Remove */}
        <div className="flex items-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="ml-2 font-semibold">Eliminar</span>
        </div>

        {/* Right action: Add */}
        <div className="flex items-center text-white">
          <span className="mr-2 font-semibold">Agregar</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </motion.div>

      {/* Main item content */}
      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-4 relative z-10"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        animate={isRemoving ? {
          opacity: 0,
          scale: 0.8,
          x: -300
        } : {}}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          {/* Product info */}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatPrice(item.price)} x {item.quantity}
            </p>
            <p className="text-lg font-semibold text-green-600 mt-1">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                triggerHaptic(5)
                onUpdateQuantity(item.id, -1)
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-300"
              style={{
                minHeight: touchStyles.minHeight,
                minWidth: touchStyles.minWidth
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <span className="w-8 text-center font-semibold text-lg">
              {item.quantity}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                triggerHaptic(5)
                onUpdateQuantity(item.id, 1)
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-300"
              style={{
                minHeight: touchStyles.minHeight,
                minWidth: touchStyles.minWidth
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swipe hint indicator */}
        <div className="absolute top-2 right-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Cart item con long press para eliminar (alternativa al swipe)
 */
export function LongPressCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  formatPrice
}: SwipeableCartItemProps) {
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { hapticFeedback, touchStyles } = useTouchOptimization()

  let longPressTimer: NodeJS.Timeout

  const handleTouchStart = () => {
    longPressTimer = setTimeout(() => {
      setIsLongPressing(true)
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate([50, 30, 50]) // Patrón de vibración para long press
      }
      setConfirmDelete(true)
    }, 800) // 800ms para long press
  }

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer)
    setIsLongPressing(false)
  }

  const handleConfirmDelete = () => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(20)
    }
    onRemove(item.id)
    setConfirmDelete(false)
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg p-4 relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      animate={{
        scale: isLongPressing ? 0.95 : 1,
        borderColor: isLongPressing ? '#EF4444' : '#E5E7EB'
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Confirm delete overlay */}
      {confirmDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-red-50 border-2 border-red-500 rounded-lg flex items-center justify-center z-20"
        >
          <div className="text-center">
            <p className="text-red-700 font-semibold mb-3">
              ¿Eliminar "{item.name}"?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                style={{ minHeight: touchStyles.minHeight }}
              >
                Eliminar
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold"
                style={{ minHeight: touchStyles.minHeight }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Regular item content */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">
            {formatPrice(item.price)} x {item.quantity}
          </p>
          <p className="text-lg font-semibold text-green-600 mt-1">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-300"
            style={{
              minHeight: touchStyles.minHeight,
              minWidth: touchStyles.minWidth
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="w-8 text-center font-semibold text-lg">
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-300"
            style={{
              minHeight: touchStyles.minHeight,
              minWidth: touchStyles.minWidth
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Long press hint */}
      <div className="absolute top-2 right-2 text-gray-300 text-xs">
        Mantener presionado para eliminar
      </div>
    </motion.div>
  )
}