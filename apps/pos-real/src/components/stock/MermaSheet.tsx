'use client'

import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import { Search, TrendingDown, Package } from 'lucide-react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useProductsStore, Product } from '@/lib/productsStore'
import { useStockStore } from '@/lib/stockStore'
import { useAuthStore } from '@/lib/authStore'
import { MermaReason, MERMA_CATEGORIES } from '@/types/stock'

interface MermaSheetProps {
  open: boolean
  onClose: () => void
  preselectedProductId?: string | null
}

export function MermaSheet({ open, onClose, preselectedProductId }: MermaSheetProps) {
  const { products } = useProductsStore()
  const { addMermaToSupabase, getStockByProduct } = useStockStore()
  const { user, storeId } = useAuthStore()

  const [step, setStep] = useState<'select' | 'details'>('select')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState<MermaReason | null>(null)
  const [note, setNote] = useState('')

  // Reset cuando se abre/cierra
  useEffect(() => {
    if (open) {
      if (preselectedProductId) {
        const product = products.find(p => p.id === preselectedProductId)
        if (product) {
          setSelectedProduct(product)
          setStep('details')
        }
      } else {
        setStep('select')
        setSelectedProduct(null)
      }
      setQuantity('')
      setReason(null)
      setNote('')
      setSearchQuery('')
    }
  }, [open, preselectedProductId, products])

  const filteredProducts = products.filter(p =>
    p.trackStock && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setStep('details')
  }

  const handleConfirm = async () => {
    if (!selectedProduct || !quantity || !reason || !storeId) return

    await addMermaToSupabase({
      storeId,
      productId: selectedProduct.id,
      quantity: parseFloat(quantity),
      unit: selectedProduct.unit,
      userId: user?.id || 'unknown',
      reason,
      note: note || undefined,
    })

    onClose()
  }

  const currentStock = selectedProduct ? getStockByProduct(selectedProduct.id) : 0

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white max-h-[90vh]">
          <VisuallyHidden.Root>
            <Drawer.Title>Registrar merma</Drawer.Title>
            <Drawer.Description>Pérdida de stock</Drawer.Description>
          </VisuallyHidden.Root>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="px-5 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Registrar Merma</h2>
                <p className="text-sm text-gray-500">
                  {step === 'select' ? 'Seleccioná un producto' : selectedProduct?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {step === 'select' ? (
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Products list */}
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Stock: {getStockByProduct(product.id).toFixed(product.unit === 'kg' ? 2 : 0)} {product.unit}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Current stock info */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 flex justify-between items-center">
                  <span className="text-gray-600">Stock actual:</span>
                  <span className="font-bold text-lg">
                    {currentStock.toFixed(selectedProduct?.unit === 'kg' ? 2 : 0)} {selectedProduct?.unit}
                  </span>
                </div>

                {/* Quantity input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad perdida ({selectedProduct?.unit})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step={selectedProduct?.unit === 'kg' ? '0.01' : '1'}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full text-4xl font-bold text-center py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Reason selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Por qué se perdió?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {MERMA_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setReason(cat.value)}
                        className={`p-3 rounded-xl border-2 transition-colors flex items-center gap-2 ${
                          reason === cat.value
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-sm">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Nota (opcional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ej: Se echó a perder por corte de luz"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {step === 'details' && (
            <div className="p-5 border-t bg-white">
              <button
                onClick={handleConfirm}
                disabled={!quantity || parseFloat(quantity) <= 0 || !reason}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors ${
                  quantity && parseFloat(quantity) > 0 && reason
                    ? 'bg-red-600 text-white active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Registrar Merma
              </button>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
