'use client'

import { useState } from 'react'
import { X, Scale, Hash } from 'lucide-react'
import { Product } from '@/lib/store'

interface QuantityModalProps {
  product: Product
  onConfirm: (quantity: number) => void
  onCancel: () => void
}

export function QuantityModal({ product, onConfirm, onCancel }: QuantityModalProps) {
  const [value, setValue] = useState(product.unit === 'unit' ? '1' : '')

  const numValue = parseFloat(value) || 0
  const total = numValue * product.price

  const isPorPeso = product.unit === 'kg' || product.unit === 'lt'

  const handleConfirm = () => {
    if (numValue > 0) {
      onConfirm(numValue)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && numValue > 0) {
      handleConfirm()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isPorPeso ? <Scale className="h-6 w-6" /> : <Hash className="h-6 w-6" />}
            <span className="font-bold text-lg">
              {isPorPeso ? 'Ingresar Peso' : 'Ingresar Cantidad'}
            </span>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-amber-600 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Producto */}
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-gray-600">
            ${product.price.toLocaleString('es-AR')} / {product.unit === 'unit' ? 'unidad' : product.unit}
          </p>
        </div>

        {/* Input */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              inputMode="decimal"
              step={isPorPeso ? "0.001" : "1"}
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isPorPeso ? "0.000" : "1"}
              autoFocus
              className="flex-1 text-4xl font-bold text-center p-4 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none"
            />
            <span className="text-2xl text-gray-500 w-16">
              {product.unit === 'unit' ? 'u.' : product.unit}
            </span>
          </div>

          {/* Teclado rápido para peso */}
          {isPorPeso && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['0.250', '0.500', '0.750', '1.000'].map((peso) => (
                <button
                  key={peso}
                  onClick={() => setValue(peso)}
                  className="py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 active:bg-gray-300"
                >
                  {peso}
                </button>
              ))}
            </div>
          )}

          {/* Total calculado */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-600 mb-1">TOTAL A COBRAR</p>
            <p className="text-3xl font-bold text-green-700">
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="p-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={numValue <= 0}
            className={`flex-1 py-4 rounded-xl font-bold text-white ${
              numValue > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
