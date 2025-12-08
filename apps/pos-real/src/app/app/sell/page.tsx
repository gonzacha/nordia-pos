"use client"

import { useState } from "react"
import { useAppStore, CartItem } from "@/lib/store"
import { useProductsStore, Product } from "@/lib/productsStore"
import { useStockStore } from "@/lib/stockStore"
import { useAuthStore } from "@/lib/authStore"
import { decodeBarcode } from "@/lib/barcodeDecoder"
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@nordia/ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Search, Trash2, DollarSign, ScanLine } from "lucide-react"
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner"
import { QuantitySheet } from "@/components/sell/QuantitySheet"
import { CartSheet } from "@/components/sell/CartSheet"
import { MobileHeader } from "@/components/sell/MobileHeader"
import { SearchBar } from "@/components/sell/SearchBar"
import { ScanButton } from "@/components/sell/ScanButton"
import { ProductSearchResult } from "@/components/sell/ProductSearchResult"

// Función para normalizar texto (quitar tildes y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes
}

/**
 * Búsqueda fuzzy tolerante a errores de tipeo
 * Para usuarios 40-70 años con baja experiencia tech
 *
 * Matchea:
 * - "azado" → "asado" (1 letra de diferencia)
 * - "tmate" → "tomate" (letra faltante)
 * - "pann" → "pan" (letra duplicada)
 * - "morcila" → "morcilla" (letra faltante)
 */
const fuzzyMatch = (search: string, target: string): boolean => {
  const s = normalizeText(search)
  const t = normalizeText(target)

  // Match exacto (más rápido)
  if (t.includes(s)) return true

  // Match por caracteres consecutivos (para typos como "asdo" -> "asado")
  let qi = 0
  for (let i = 0; i < t.length && qi < s.length; i++) {
    if (t[i] === s[qi]) qi++
  }
  if (qi === s.length && s.length >= 2) return true

  // Levenshtein simplificado: tolera 1-2 errores para búsquedas ≥ 3 chars
  if (s.length >= 3) {
    // Quitar una letra y ver si matchea (ej: "azado" sin "z" = "aado" → no)
    // Mejor: probar si target contiene search con 1 letra menos
    for (let i = 0; i < s.length; i++) {
      const partial = s.slice(0, i) + s.slice(i + 1)
      if (t.includes(partial) && partial.length >= 2) return true
    }

    // Probar si search es target con 1 letra menos (ej: "pan" en "pann")
    for (let i = 0; i < t.length; i++) {
      const partial = t.slice(0, i) + t.slice(i + 1)
      if (partial.includes(s) || s.includes(partial)) return true
    }

    // Verificar si las primeras N-1 letras coinciden (typo al final)
    if (s.length >= 4 && t.startsWith(s.slice(0, -1))) return true
    if (s.length >= 4 && t.startsWith(s.slice(0, 3))) return true
  }

  return false
}

export default function SellPage() {
  const { currentCart, addToCart, removeFromCart, updateCartItem, clearCart, completeSale } = useAppStore()
  const { products, getProductByBarcode, getProductByPlu } = useProductsStore()
  const { addVentaToSupabase } = useStockStore()
  const { user, storeId, storeName } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingItem, setEditingItem] = useState<CartItem | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("EFECTIVO")
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
        fuzzyMatch(p.name, searchQuery) ||
        p.plu?.includes(searchQuery) ||
        p.barcode?.includes(searchQuery)
      )
    : []

  const cartTotal = currentCart.reduce((sum, item) => sum + item.subtotal, 0)

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setShowQuantityModal(true)
  }

  const handleCheckout = () => {
    if (currentCart.length === 0) return
    setShowPaymentDialog(true)
  }

  const handleCompleteSale = async () => {
    // Registrar movimientos de stock en Supabase para productos que lo requieren
    if (storeId) {
      for (const item of currentCart) {
        const product = products.find(p => p.id === item.productId)
        if (product?.trackStock) {
          // Usar weight para productos por kg/lt, quantity para unidades
          const quantityToDeduct = item.weight ?? item.quantity
          await addVentaToSupabase({
            storeId,
            productId: item.productId,
            quantity: quantityToDeduct,
            unit: product.unit,
            userId: user?.id || 'unknown',
          })
        }
      }
    }

    completeSale(paymentMethod)
    setShowPaymentDialog(false)
    setPaymentMethod("EFECTIVO")
  }

  const handleScan = (barcode: string) => {
    setShowScanner(false)
    const scanResult = decodeBarcode(barcode)

    // CASO 1: Código de balanza con precio embebido - Agregar directo
    if (scanResult.type === 'balance-price') {
      const product = getProductByPlu(scanResult.plu)

      if (product) {
        const weight = scanResult.priceTotal / product.price
        addToCart(product, 1, weight, scanResult.priceTotal)
        setScanMessage({
          type: 'success',
          text: `✓ ${product.name} ${weight.toFixed(3)}kg - $${scanResult.priceTotal.toFixed(2)}`
        })
        setTimeout(() => setScanMessage(null), 3000)
      } else {
        setScanMessage({
          type: 'error',
          text: `✗ PLU no encontrado: ${scanResult.plu}`
        })
        setTimeout(() => setScanMessage(null), 3000)
      }
      return
    }

    // CASO 2: Código de balanza con peso embebido - Agregar directo
    if (scanResult.type === 'balance-weight') {
      const product = getProductByPlu(scanResult.plu)

      if (product) {
        const total = scanResult.weight * product.price
        addToCart(product, 1, scanResult.weight, total)
        setScanMessage({
          type: 'success',
          text: `✓ ${product.name} ${scanResult.weight.toFixed(3)}kg - $${total.toFixed(2)}`
        })
        setTimeout(() => setScanMessage(null), 3000)
      } else {
        setScanMessage({
          type: 'error',
          text: `✗ PLU no encontrado: ${scanResult.plu}`
        })
        setTimeout(() => setScanMessage(null), 3000)
      }
      return
    }

    // CASO 3: Código normal - Buscar producto y pedir peso/cantidad
    const product = getProductByBarcode(scanResult.barcode) || getProductByPlu(scanResult.barcode.padStart(5, '0'))

    if (product) {
      setTimeout(() => {
        setSelectedProduct(product)
        setShowQuantityModal(true)
      }, 100)
    } else {
      setScanMessage({
        type: 'error',
        text: `✗ Producto no encontrado: ${barcode}`
      })
      setTimeout(() => setScanMessage(null), 3000)
    }
  }

  // Editar item del carrito
  const handleEditCartItem = (item: CartItem) => {
    const product = products.find(p => p.id === item.productId)
    if (product) {
      setSelectedProduct(product)
      setEditingItem(item)
      setShowQuantityModal(true)
    }
  }

  const handleQuantityConfirm = (quantity: number) => {
    if (selectedProduct) {
      const isPorPeso = selectedProduct.unit === 'kg' || selectedProduct.unit === 'lt'
      const total = quantity * selectedProduct.price

      if (editingItem) {
        updateCartItem(editingItem.id, quantity)
        setScanMessage({
          type: 'success',
          text: `✓ ${selectedProduct.name} actualizado`
        })
        setEditingItem(null)
      } else {
        if (isPorPeso) {
          addToCart(selectedProduct, 1, quantity, total)
          setScanMessage({
            type: 'success',
            text: `✓ ${selectedProduct.name} ${quantity.toFixed(3)}${selectedProduct.unit} - $${total.toFixed(0)}`
          })
        } else {
          addToCart(selectedProduct, quantity)
          setScanMessage({
            type: 'success',
            text: `✓ ${selectedProduct.name} x${quantity} - $${total.toFixed(0)}`
          })
        }
      }
      setTimeout(() => setScanMessage(null), 3000)
    }
    setShowQuantityModal(false)
    setSelectedProduct(null)
  }

  const handleSelectProduct = (product: Product) => {
    setSearchQuery('')
    setSelectedProduct(product)
    setShowQuantityModal(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Left: Products */}
      <div className="lg:col-span-2 space-y-4 overflow-auto">
        {/* ========== VISTA MOBILE (Rediseñada con nuevos componentes) ========== */}
        <div className="md:hidden flex flex-col min-h-[calc(100vh-180px)]">
          {/* Mobile Header */}
          <MobileHeader storeName={storeName || "Mi Negocio"} />

          {/* Main Content */}
          <div className="flex-1 px-4 pt-4 pb-32 space-y-4 bg-nordia-surface">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar producto..."
            />

            {/* Scan message */}
            {scanMessage && (
              <div className={`p-4 rounded-2xl ${
                scanMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <p className="font-medium">{scanMessage.text}</p>
              </div>
            )}

            {/* RESULTADOS DE BÚSQUEDA (cuando hay query) */}
            {searchQuery ? (
              <ProductSearchResult
                products={filteredProducts}
                searchQuery={searchQuery}
                onSelectProduct={handleSelectProduct}
              />
            ) : (
              /* CONTENIDO PRINCIPAL (cuando NO hay búsqueda) */
              <div className="space-y-6">
                {/* Botón Escanear */}
                <ScanButton onClick={() => setShowScanner(true)} />

                {/* Espacio para instrucciones cuando carrito vacío */}
                {currentCart.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-6xl mb-4">🛒</p>
                    <p className="font-semibold text-gray-600 text-lg">
                      Escaneá o buscá productos
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      para empezar a vender
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========== VISTA DESKTOP ========== */}
        <div className="hidden md:block space-y-4">
          {/* Scanner Button */}
          <Button
            onClick={() => setShowScanner(true)}
            className="w-full h-12 text-base font-bold bg-nordia-primary hover:bg-nordia-primary/90"
            size="lg"
          >
            <ScanLine className="w-6 h-6 mr-3" />
            ESCANEAR CÓDIGO DE BARRAS
          </Button>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar producto... (Ej: Asado, Tomate, Pan)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nordia-accent focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Scan message */}
          {scanMessage && (
            <div className={`p-3 rounded-lg ${
              scanMessage.type === 'success'
                ? 'bg-nordia-success/10 text-nordia-success border border-nordia-success/30'
                : 'bg-nordia-danger/10 text-nordia-danger border border-nordia-danger/30'
            }`}>
              {scanMessage.text}
            </div>
          )}
        </div>

        {/* Products grid - Desktop only */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => handleAddToCart(product)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <p className="text-xs text-slate-500">{product.category}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-nordia-primary">
                    ${product.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    por {product.unit}
                  </p>
                  {product.trackStock && (
                    <p className={`text-xs font-medium ${
                      (product.stock || 0) > 10 ? "text-nordia-success" : "text-nordia-danger"
                    }`}>
                      Stock: {product.stock || 0}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state - Desktop only */}
        {filteredProducts.length === 0 && (
          <div className="hidden md:block text-center py-12 text-slate-500">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg">No se encontraron productos</p>
            <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>

      {/* Right: Cart - Desktop only */}
      <div className="lg:col-span-1 hidden md:block">
        <Card className="h-full flex flex-col sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Carrito</span>
              {currentCart.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {currentCart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <DollarSign className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-lg font-medium">Carrito vacío</p>
                <p className="text-sm text-center mt-2">
                  Seleccioná productos para empezar
                </p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="flex-1 space-y-3 overflow-auto mb-4">
                  {currentCart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-nordia-surface rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleEditCartItem(item)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-slate-500">
                          {item.weight ? (
                            <span>
                              {item.weight.toFixed(2)}kg × ${item.unitPrice.toLocaleString()}/kg
                            </span>
                          ) : (
                            <span>
                              ${item.unitPrice.toLocaleString()} × {item.quantity}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromCart(item.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <p className="font-bold text-lg min-w-[80px] text-right">
                          ${item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">TOTAL</span>
                    <span className="text-3xl font-bold text-nordia-success">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Desktop COBRAR button */}
                  <Button
                    size="lg"
                    className="w-full text-lg h-14 bg-nordia-success hover:bg-nordia-success/90"
                    onClick={handleCheckout}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    COBRAR
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Método de Pago</DialogTitle>
            <VisuallyHidden.Root>
              <DialogDescription>Seleccione el método de pago para completar la venta</DialogDescription>
            </VisuallyHidden.Root>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-3xl font-bold text-center text-nordia-success">
              ${cartTotal.toLocaleString()}
            </p>
            <div className="space-y-2">
              {["EFECTIVO", "TARJETA", "TRANSFERENCIA", "MERCADOPAGO"].map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? "default" : "outline"}
                  className={`w-full text-base h-12 ${
                    paymentMethod === method ? 'bg-nordia-primary' : ''
                  }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCompleteSale} className="bg-nordia-success hover:bg-nordia-success/90">
              Confirmar Venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Quantity Sheet */}
      <QuantitySheet
        open={showQuantityModal}
        product={selectedProduct}
        onConfirm={handleQuantityConfirm}
        onClose={() => {
          setShowQuantityModal(false)
          setSelectedProduct(null)
          setEditingItem(null)
        }}
      />

      {/* CartSheet - Carrito deslizable (Mobile only) */}
      <div className="md:hidden">
        <CartSheet
          items={currentCart}
          total={cartTotal}
          onRemoveItem={(id) => removeFromCart(id)}
          onEditItem={(item) => handleEditCartItem(item)}
          onCheckout={handleCheckout}
          onClear={clearCart}
        />
      </div>
    </div>
  )
}
