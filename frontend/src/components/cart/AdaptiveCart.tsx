/**
 * ADAPTIVE CART COMPONENT
 * Carrito que se adapta según el dispositivo:
 * - Mobile: Bottom Sheet deslizable
 * - Tablet/Desktop: Sidebar fijo
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface AdaptiveCartProps {
  items: CartItem[]
  isOpen?: boolean
  onClose?: () => void
  onUpdateQuantity: (itemId: number, delta: number) => void
  onRemoveItem: (itemId: number) => void
  onCheckout: () => void
  paymentMethod: 'cash' | 'card' | 'mercadopago'
  onPaymentMethodChange: (method: 'cash' | 'card' | 'mercadopago') => void
  customerEmail: string
  onCustomerEmailChange: (email: string) => void
  loading?: boolean
  className?: string
}

export function AdaptiveCart({
  items,
  isOpen = true,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  paymentMethod,
  onPaymentMethodChange,
  customerEmail,
  onCustomerEmailChange,
  loading = false,
  className = ''
}: AdaptiveCartProps) {
  // Detección simple de móvil
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const touchStyles = { minHeight: '44px', minWidth: '44px', padding: '0.75rem' }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  // Contenido del carrito (común para ambas versiones)
  const cartContent = (
    <div className="flex flex-col h-full">
      {/* Items del carrito */}
      <div className="flex-1 overflow-y-auto mb-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-gray-500"
            >
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3H4a1 1 0 100 2h1m0 0l1.68 8.39a2 2 0 002.016 1.61H19M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4M9 21h6" />
              </svg>
              <p className="text-center">
                Carrito vacío<br />
                <span className="text-sm">Agrega productos para comenzar</span>
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <DesktopCartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                  formatPrice={formatPrice}
                  touchStyles={touchStyles}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Separador solo si hay items */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 mb-4" />
      )}

      {/* Resumen y checkout */}
      <div className="space-y-4">
        {/* Total */}
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="text-green-600">
            {formatPrice(total)}
          </span>
        </div>

        {/* Método de pago */}
        <PaymentMethodSelector
          selected={paymentMethod}
          onChange={onPaymentMethodChange}
          isMobile={isMobile}
        />

        {/* Email cliente */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email cliente (opcional):
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            placeholder="cliente@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            style={{ minHeight: touchStyles.minHeight }}
          />
        </div>

        {/* Botón de cobrar */}
        <motion.button
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          className="w-full bg-green-600 text-white font-semibold rounded-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          style={{
            minHeight: isMobile ? '56px' : touchStyles.minHeight,
            padding: touchStyles.padding
          }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Procesando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              COBRAR {formatPrice(total)}
            </div>
          )}
        </motion.button>
      </div>
    </div>
  )

  // Versión tablet/desktop: Sidebar
  return (
    <div className={`
      bg-white rounded-lg shadow-lg border border-gray-200 p-6
      ${className}
    `}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3H4a1 1 0 100 2h1m0 0l1.68 8.39a2 2 0 002.016 1.61H19M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4M9 21h6" />
          </svg>
          Carrito ({itemCount})
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {cartContent}
    </div>
  )
}

// Componente para items del carrito en desktop
function DesktopCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  formatPrice,
  touchStyles
}: {
  item: CartItem
  onUpdateQuantity: (id: number, delta: number) => void
  onRemove: (id: number) => void
  formatPrice: (price: number) => string
  touchStyles: any
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {formatPrice(item.price)} x {item.quantity}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border"
            style={{ minHeight: touchStyles.minHeight, minWidth: touchStyles.minWidth }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border"
            style={{ minHeight: touchStyles.minHeight, minWidth: touchStyles.minWidth }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          style={{ minHeight: touchStyles.minHeight, minWidth: touchStyles.minWidth }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

// Selector de método de pago
function PaymentMethodSelector({
  selected,
  onChange,
  isMobile
}: {
  selected: 'cash' | 'card' | 'mercadopago'
  onChange: (method: 'cash' | 'card' | 'mercadopago') => void
  isMobile: boolean
}) {
  const methods = [
    { id: 'cash', label: 'Efectivo', icon: '💵' },
    { id: 'card', label: 'Tarjeta', icon: '💳' },
    { id: 'mercadopago', label: 'MP', icon: '🔵' }
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Método de pago:
      </label>
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange(method.id as any)}
            className={`
              p-3 rounded-lg border text-center transition-all
              ${selected === method.id
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            style={{ minHeight: isMobile ? '56px' : '48px' }}
          >
            <div className="text-lg mb-1">{method.icon}</div>
            <div className="text-xs font-medium">{method.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}