'use client'
import { useState } from 'react'
import { Drawer } from 'vaul'
import { ShoppingCart, Trash2, ChevronUp } from 'lucide-react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { CartItem } from '@/lib/store'

interface CartSheetProps {
  items: CartItem[]
  total: number
  onRemoveItem: (itemId: string) => void
  onEditItem: (item: CartItem) => void
  onCheckout: () => void
  onClear: () => void
}

export function CartSheet({ items, total, onRemoveItem, onEditItem, onCheckout, onClear }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
      {/* Trigger - Barra minimizada */}
      <Drawer.Trigger asChild>
        <button className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-left">
              <span className="font-bold text-gray-900">Carrito</span>
              {items.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-green-600">
              ${total.toLocaleString('es-AR')}
            </span>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ChevronUp className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white max-h-[85vh]">
          {/* Accessibility */}
          <VisuallyHidden.Root>
            <Drawer.Title>Carrito de compras</Drawer.Title>
            <Drawer.Description>Lista de productos en el carrito</Drawer.Description>
          </VisuallyHidden.Root>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="px-4 pb-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <span className="font-bold text-lg">Carrito</span>
                {items.length > 0 && (
                  <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                  </span>
                )}
              </div>
            </div>
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-red-500 text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar
              </button>
            )}
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-3">🛒</p>
                <p className="text-gray-500 font-medium">El carrito está vacío</p>
                <p className="text-gray-400 text-sm mt-1">
                  Escaneá o buscá productos para empezar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <button onClick={() => onEditItem(item)} className="flex-1 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          {item.weight ? '🥩' : '📦'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            {item.weight
                              ? `${item.weight.toFixed(2)}kg × $${item.unitPrice.toLocaleString('es-AR')}`
                              : `${item.quantity} × $${item.unitPrice.toLocaleString('es-AR')}`}
                          </p>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600 text-lg">
                        ${item.subtotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total + Checkout Button */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
            <button
              disabled={items.length === 0}
              onClick={() => {
                setIsOpen(false)
                onCheckout()
              }}
              className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 ${
                items.length > 0
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              💳 {items.length > 0 ? `COBRAR $${total.toLocaleString('es-AR')}` : 'CARRITO VACÍO'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
