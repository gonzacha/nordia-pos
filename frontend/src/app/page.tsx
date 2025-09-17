'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Barcode, ShoppingCart } from 'lucide-react'
import { ProductGrid } from '@/components/products'
import { BarcodeScanner } from '@/components/modules/BarcodeScanner'
import { AdaptiveCart } from '@/components/cart/AdaptiveCart'
import { Button, Input, showToast } from '@/design-system/components'
import { api } from '@/lib/api'
import { cn } from '@/design-system/utils/cn'

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category?: string
}

interface CartItem extends Product {
  quantity: number
}

export default function POSInterface() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mercadopago'>('cash')
  const [customerEmail, setCustomerEmail] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [showCartSheet, setShowCartSheet] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getProducts()
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error cargando productos:', error)
        setProducts([
          { id: 1, name: 'Café', price: 850, stock: 100, category: 'Bebidas' },
          { id: 2, name: 'Medialunas', price: 450, stock: 50, category: 'Panadería' },
          { id: 3, name: 'Tostado', price: 1200, stock: 30, category: 'Sandwiches' },
          { id: 4, name: 'Jugo Natural', price: 600, stock: 45, category: 'Bebidas' },
        ])
      }
    }

    fetchProducts()
  }, [])

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category))
      )
    )
    return ['Todas', ...unique]
  }, [products])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      showToast.success(`${product.name} agregado al carrito`)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleBarcodeScan = (barcode: string) => {
    const product = products.find((p) => p.id.toString() === barcode)
    if (product) {
      addToCart(product)
    } else {
      showToast.error(`Producto no encontrado: ${barcode}`)
    }
    setShowScanner(false)
  }

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  )

  const totalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  )

  const handleCheckout = useCallback(async () => {
    if (!cart.length) {
      showToast.error('El carrito está vacío')
      return
    }

    setLoading(true)

    const saleData = {
      items: cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      })),
      total: totalAmount,
      payment_method: paymentMethod,
      customer_email: customerEmail || 'cliente@nordia.com',
    }

    try {
      const response = await api.createSale(saleData)

      if (response.ok) {
        await response.json()
        showToast.sale(totalAmount, paymentMethod)
        setCart([])
        setShowCartSheet(false)
      } else {
        showToast.error('Error procesando la venta')
      }
    } catch (error) {
      console.error('Error procesando venta', error)
      showToast.error('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }, [cart, customerEmail, paymentMethod, totalAmount])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        event.preventDefault()
        setShowScanner(true)
      }
      if (event.key === 'F12') {
        event.preventDefault()
        handleCheckout()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCheckout])

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-3xl font-bold text-neutral-900"
            >
              Nordia POS
            </motion.h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Gestioná tus productos y ventas en un flujo mobile-first pensado para feriantes, delivery y vendedores ambulantes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowScanner(true)}>
              <Barcode className="mr-2 h-4 w-4" /> Escanear (F11)
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <ShoppingCart className="mr-2 h-4 w-4" /> Caja rápida
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <Input
                placeholder="Buscar productos, categorías o códigos..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                icon={<Search className="h-4 w-4" />}
                variant="filled"
              />

              <div className="flex items-center justify-end gap-2 md:justify-center">
                <Button variant="outline" size="sm" onClick={() => setShowScanner(true)}>
                  <Barcode className="mr-2 h-4 w-4" /> Abrir scanner
                </Button>
              </div>
            </div>

            <div className="flex snap-x gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const isActive = (category === 'Todas' && !selectedCategory) || selectedCategory === category
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'Todas' ? '' : category)}
                    className={cn(
                      'whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors',
                      isActive ? 'border-brand bg-brand/10 text-brand' : 'border-neutral-200 text-neutral-600 hover:border-brand/60'
                    )}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            <ProductGrid
              products={products}
              onAddToCart={addToCart}
              viewMode="grid"
              loading={loading}
              showHeader={false}
              showSearch={false}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </section>

          <aside className="hidden lg:block">
            <AdaptiveCart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              customerEmail={customerEmail}
              onCustomerEmailChange={setCustomerEmail}
              loading={loading}
            />
          </aside>
        </div>
      </main>

      {/* Resumen flotante para móvil */}
      {cart.length > 0 && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={() => setShowCartSheet(true)}
          className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems} producto{totalItems !== 1 && 's'} ·
          <span className="text-base font-bold">
            {totalAmount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
          </span>
        </motion.button>
      )}

      {/* Bottom sheet carrito móvil */}
      {showCartSheet && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[78vh] rounded-t-3xl bg-white p-4 shadow-2xl">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-200" />
            <AdaptiveCart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              customerEmail={customerEmail}
              onCustomerEmailChange={setCustomerEmail}
              loading={loading}
            />
            <Button variant="ghost" className="mt-2 w-full" onClick={() => setShowCartSheet(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {/* Scanner modal */}
      {showScanner && (
        <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}
