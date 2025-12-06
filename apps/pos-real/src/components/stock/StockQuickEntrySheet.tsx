'use client'

import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import { Search, Plus, Package } from 'lucide-react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useProductsStore, Product } from '@/lib/productsStore'
import { useStockStore } from '@/lib/stockStore'
import { useAuthStore } from '@/lib/authStore'

interface StockQuickEntrySheetProps {
  open: boolean
  onClose: () => void
  preselectedProductId?: string | null
}

export function StockQuickEntrySheet({ open, onClose, preselectedProductId }: StockQuickEntrySheetProps) {
  const { products } = useProductsStore()
  const { addIngresoToSupabase } = useStockStore()
  const { user, storeId } = useAuthStore()

  const [step, setStep] = useState<'select' | 'quantity'>('select')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [reference, setReference] = useState('')
  const [cost, setCost] = useState('')
  const [showOptional, setShowOptional] = useState(false)

  // Reset cuando se abre/cierra
  useEffect(() => {
    if (open) {
      if (preselectedProductId) {
        const product = products.find(p => p.id === preselectedProductId)
        if (product) {
          setSelectedProduct(product)
          setStep('quantity')
        }
      } else {
        setStep('select')
        setSelectedProduct(null)
      }
      setQuantity('')
      setSupplierName('')
      setReference('')
      setCost('')
      setSearchQuery('')
      setShowOptional(false)
    }
  }, [open, preselectedProductId, products])

  const filteredProducts = products.filter(p =>
    p.trackStock && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setStep('quantity')
  }

  const handleConfirm = async () => {
    if (!selectedProduct || !quantity || !storeId) return

    await addIngresoToSupabase({
      storeId,
      productId: selectedProduct.id,
      quantity: parseFloat(quantity),
      unit: selectedProduct.unit,
      userId: user?.id || 'unknown',
      supplierName: supplierName || undefined,
      reference: reference || undefined,
      cost: cost ? parseFloat(cost) : undefined,
    })

    onClose()
  }

  const quickQuantities = selectedProduct?.unit === 'kg'
    ? ['0.5', '1', '2', '5', '10', '20']
    : ['1', '2', '5', '10', '20', '50']

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white max-h-[90vh]">
          <VisuallyHidden.Root>
            <Drawer.Title>Cargar mercadería</Drawer.Title>
            <Drawer.Description>Ingreso de stock</Drawer.Description>
          </VisuallyHidden.Root>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="px-5 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Cargar Mercadería</h2>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
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
                          {product.unit === 'kg' ? 'Por kilo' : product.unit === 'lt' ? 'Por litro' : 'Por unidad'}
                        </p>
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No se encontraron productos</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Quantity input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad ({selectedProduct?.unit})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step={selectedProduct?.unit === 'kg' ? '0.01' : '1'}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full text-4xl font-bold text-center py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Quick quantities */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {quickQuantities.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={`py-3 rounded-xl font-semibold transition-colors ${
                        quantity === q
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {q} {selectedProduct?.unit}
                    </button>
                  ))}
                </div>

                {/* Optional fields toggle */}
                <button
                  onClick={() => setShowOptional(!showOptional)}
                  className="w-full text-sm text-gray-500 mb-4 flex items-center justify-center gap-1"
                >
                  {showOptional ? '▼' : '▶'} Datos opcionales (proveedor, costo)
                </button>

                {showOptional && (
                  <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        ¿De quién compraste? (opcional)
                      </label>
                      <input
                        type="text"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="Ej: Juan, el de la carne"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Referencia (opcional)
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ej: Compra del lunes, Factura 001"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Costo por {selectedProduct?.unit} (opcional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {step === 'quantity' && (
            <div className="p-5 border-t bg-white">
              <button
                onClick={handleConfirm}
                disabled={!quantity || parseFloat(quantity) <= 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors ${
                  quantity && parseFloat(quantity) > 0
                    ? 'bg-green-600 text-white active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                ✓ Guardar Ingreso
              </button>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
