/**
 * BOTTOM SHEET COMPONENT
 * Componente deslizable desde abajo para móviles
 * Usado principalmente para el carrito en vista móvil
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useTouchOptimization } from '@/hooks/useResponsive'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  snapPoints?: number[] // Porcentajes de altura [30, 60, 90]
  initialSnap?: number // Índice del snap point inicial
  showDragHandle?: boolean
  closeOnOutsideClick?: boolean
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [30, 60, 90],
  initialSnap = 1,
  showDragHandle = true,
  closeOnOutsideClick = true,
  className = ''
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const { hapticFeedback } = useTouchOptimization()

  // Calcular altura basada en snap point actual
  const currentHeight = snapPoints[currentSnap]

  // Vibración háptica en cambios de snap
  const triggerHaptic = () => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10) // Vibración suave
    }
  }

  // Manejar drag del sheet
  const handleDrag = (event: any, info: PanInfo) => {
    if (!isDragging) setIsDragging(true)
  }

  // Manejar fin del drag
  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)

    const velocity = info.velocity.y
    const offset = info.offset.y

    // Si se desliza muy rápido hacia abajo, cerrar
    if (velocity > 500) {
      triggerHaptic()
      onClose()
      return
    }

    // Si se desliza muy rápido hacia arriba, ir al snap más alto
    if (velocity < -500 && currentSnap < snapPoints.length - 1) {
      triggerHaptic()
      setCurrentSnap(snapPoints.length - 1)
      return
    }

    // Determinar el snap point más cercano basado en posición
    const currentPosition = currentHeight
    const newPosition = currentPosition - (offset / window.innerHeight) * 100

    let closestSnap = 0
    let minDistance = Infinity

    snapPoints.forEach((point, index) => {
      const distance = Math.abs(point - newPosition)
      if (distance < minDistance) {
        minDistance = distance
        closestSnap = index
      }
    })

    // Si está muy cerca del mínimo, cerrar
    if (newPosition < snapPoints[0] * 0.7) {
      triggerHaptic()
      onClose()
    } else if (closestSnap !== currentSnap) {
      triggerHaptic()
      setCurrentSnap(closestSnap)
    }
  }

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeOnOutsideClick ? onClose : undefined}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{
              y: `${100 - currentHeight}%`,
              transition: {
                type: 'spring',
                damping: isDragging ? 50 : 25,
                stiffness: isDragging ? 500 : 200
              }
            }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{
              top: -(window.innerHeight * 0.9),
              bottom: window.innerHeight * 0.7
            }}
            dragElastic={0.1}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`
              fixed bottom-0 left-0 right-0 z-50
              bg-white rounded-t-2xl shadow-2xl
              max-h-[95vh] overflow-hidden
              ${className}
            `}
            style={{
              height: `${currentHeight}vh`
            }}
          >
            {/* Drag Handle */}
            {showDragHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {children}
            </div>

            {/* Snap Indicators */}
            <div className="absolute right-4 top-16 flex flex-col space-y-1">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSnap(index)
                    triggerHaptic()
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSnap
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook para controlar BottomSheet
 */
export function useBottomSheet(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [snapPoint, setSnapPoint] = useState(1)

  const open = (snap = 1) => {
    setSnapPoint(snap)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const changeSnap = (newSnap: number) => {
    setSnapPoint(newSnap)
  }

  return {
    isOpen,
    snapPoint,
    open,
    close,
    toggle,
    changeSnap
  }
}