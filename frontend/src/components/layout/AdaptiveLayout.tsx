/**
 * ADAPTIVE LAYOUT COMPONENT - SIMPLIFIED VERSION
 * Layout principal que se adapta según el dispositivo
 */

import React, { useState, useEffect } from 'react'
import { AdaptiveCart } from '@/components/cart/AdaptiveCart'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface AdaptiveLayoutProps {
  children: React.ReactNode
  activeModule: string
  onModuleChange: (module: string) => void
  cart: CartItem[]
  onUpdateQuantity: (itemId: number, delta: number) => void
  onRemoveItem: (itemId: number) => void
  onCheckout: () => void
  paymentMethod: 'cash' | 'card' | 'mercadopago'
  onPaymentMethodChange: (method: 'cash' | 'card' | 'mercadopago') => void
  customerEmail: string
  onCustomerEmailChange: (email: string) => void
  loading?: boolean
  onScannerOpen?: () => void
}

export function AdaptiveLayout({
  children,
  activeModule,
  onModuleChange,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  paymentMethod,
  onPaymentMethodChange,
  customerEmail,
  onCustomerEmailChange,
  loading = false,
  onScannerOpen
}: AdaptiveLayoutProps) {
  // Calcular items en carrito
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Layout simplificado para evitar errores de compilación
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white text-green-600 rounded flex items-center justify-center font-bold">
              N
            </div>
            <h1 className="text-2xl font-bold">Nordia POS v3.0</h1>
          </div>
          <div className="text-sm">
            Enterprise Point of Sale System
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Module Switcher */}
        <div className="flex gap-2 mb-6 bg-white p-4 rounded-lg shadow">
          <button
            onClick={() => onModuleChange('sales')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'sales'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            💰 Ventas (F1)
          </button>
          <button
            onClick={() => onModuleChange('stock')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'stock'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            📦 Stock (F3)
          </button>
          <button
            onClick={() => onModuleChange('cash')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'cash'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            💵 Caja (F8)
          </button>
          {onScannerOpen && (
            <button
              onClick={onScannerOpen}
              className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              📱 Scanner (F11)
            </button>
          )}
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* Sidebar cart */}
          <div className="lg:col-span-1">
            <AdaptiveCart
              items={cart}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onCheckout={onCheckout}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
              customerEmail={customerEmail}
              onCustomerEmailChange={onCustomerEmailChange}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Header móvil compacto
function MobileHeader({
  onScannerOpen,
  cartItemCount,
  onCartOpen
}: {
  onScannerOpen?: () => void
  cartItemCount: number
  onCartOpen: () => void
}) {
  return (
    <header className="bg-green-600 text-white p-3 shadow-lg sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white text-green-600 rounded flex items-center justify-center font-bold">
            N
          </div>
          <h1 className="text-lg font-bold">Nordia POS</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Cart quick access */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-lg bg-green-700 hover:bg-green-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3H4a1 1 0 100 2h1m0 0l1.68 8.39a2 2 0 002.016 1.61H19M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4M9 21h6" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </button>

          {/* Scanner quick access */}
          {onScannerOpen && (
            <button
              onClick={onScannerOpen}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

// Header desktop completo
function DesktopHeader({
  onScannerOpen
}: {
  onScannerOpen?: () => void
}) {
  return (
    <header className="bg-green-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white text-green-600 rounded flex items-center justify-center font-bold">
            N
          </div>
          <h1 className="text-2xl font-bold">Nordia POS v3.0</h1>
        </div>
        <div className="text-sm">
          Enterprise Point of Sale System
        </div>
      </div>
    </header>
  )
}