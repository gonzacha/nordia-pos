'use client'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Product } from '@/lib/productsStore'
import { Scale, Package, X } from 'lucide-react'

interface QuantitySheetProps {
  open: boolean
  product: Product | null
  onConfirm: (quantity: number) => void
  onClose: () => void
}

export function QuantitySheet({ open, product, onConfirm, onClose }: QuantitySheetProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (product) {
      setValue(product.unit === 'unit' ? '1' : '')
    }
  }, [product])

  if (!product) return null

  const numValue = parseFloat(value) || 0
  const total = numValue * product.price
  const isPorPeso = product.unit === 'kg' || product.unit === 'lt'

  // Validacion de stock
  const hasStockControl = product.trackStock
  const availableStock = product.stock || 0
  const stockInsuficiente = hasStockControl && numValue > availableStock
  const sinStock = hasStockControl && availableStock <= 0

  const handleConfirm = () => {
    if (numValue > 0 && !stockInsuficiente && !sinStock) {
      onConfirm(numValue)
      setValue('')
    }
  }

  const quickWeights = ['0.25', '0.5', '0.75', '1', '1.5', '2', '2.5', '3']
  const quickQuantities = ['1', '2', '3', '4', '5', '6', '10', '12']

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white max-h-[90vh]">
          {/* Accessibility */}
          <VisuallyHidden.Root>
            <Drawer.Title>
              {isPorPeso ? 'Ingresar peso' : 'Ingresar cantidad'}
            </Drawer.Title>
            <Drawer.Description>
              Ingrese la cantidad de {product.name} a agregar al carrito
            </Drawer.Description>
          </VisuallyHidden.Root>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isPorPeso ? 'bg-amber-100' : 'bg-blue-100'
              }`}>
                {isPorPeso ? (
                  <Scale className="h-6 w-6 text-amber-600" />
                ) : (
                  <Package className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">
                  {isPorPeso ? 'Ingresar Peso' : 'Cantidad'}
                </p>
                <p className="text-sm text-gray-500">{product.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Product Price */}
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                <span className="font-bold text-blue-600">
                  ${product.price.toLocaleString('es-AR')}
                </span>
                {' / '}{product.unit === 'unit' ? 'unidad' : product.unit}
              </p>
            </div>

            {/* Input */}
            <div className="flex items-center justify-center gap-3">
              <input
                type="number"
                inputMode="decimal"
                step={isPorPeso ? "0.01" : "1"}
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={isPorPeso ? "0.00" : "1"}
                className="w-36 text-4xl font-bold text-center py-3 px-2 border-2 border-amber-400 rounded-2xl focus:border-amber-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                autoFocus
              />
              <span className="text-2xl font-medium text-gray-400">
                {product.unit === 'unit' ? 'u' : product.unit}
              </span>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {(isPorPeso ? quickWeights : quickQuantities).map((val) => (
                <button
                  key={val}
                  onClick={() => setValue(val)}
                  className={`py-3 rounded-xl text-base font-semibold transition-all ${
                    value === val
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                  }`}
                >
                  {val}{isPorPeso ? 'kg' : ''}
                </button>
              ))}
            </div>

            {/* Stock Warning */}
            {hasStockControl && (
              <div className={`rounded-xl p-3 text-center ${
                sinStock
                  ? 'bg-red-50 border border-red-200'
                  : stockInsuficiente
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className={`text-sm font-medium ${
                  sinStock ? 'text-red-600' : stockInsuficiente ? 'text-amber-600' : 'text-gray-600'
                }`}>
                  {sinStock
                    ? `Sin stock disponible`
                    : stockInsuficiente
                    ? `Stock insuficiente (disponible: ${availableStock})`
                    : `Stock disponible: ${availableStock}`}
                </p>
              </div>
            )}

            {/* Total Display */}
            <div className={`border-2 rounded-2xl p-4 text-center ${
              sinStock || stockInsuficiente
                ? 'bg-gray-50 border-gray-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                sinStock || stockInsuficiente ? 'text-gray-400' : 'text-green-600'
              }`}>
                Total a Pagar
              </p>
              <p className={`text-4xl font-bold ${
                sinStock || stockInsuficiente ? 'text-gray-400' : 'text-green-600'
              }`}>
                ${total.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={numValue <= 0 || sinStock || stockInsuficiente}
                className={`flex-[2] py-4 rounded-2xl font-bold text-lg ${
                  numValue > 0 && !sinStock && !stockInsuficiente
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {sinStock
                  ? 'Sin stock'
                  : stockInsuficiente
                  ? 'Stock insuficiente'
                  : numValue > 0
                  ? 'Agregar al Carrito'
                  : 'Ingresa un valor'}
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
