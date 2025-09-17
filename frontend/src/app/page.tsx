'use client'

import { useState, useEffect } from 'react'
import { StockManager } from '@/components/modules/StockManager'
import { BarcodeScanner } from '@/components/modules/BarcodeScanner'
import { CashRegister } from '@/components/modules/CashRegister'
import { ProductGrid } from '@/components/products'
import { AdaptiveLayout } from '@/components/layout/AdaptiveLayout'
import { showToast } from '@/design-system/components'
import { api } from '@/lib/api'

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
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mercadopago'>('cash')
  const [customerEmail, setCustomerEmail] = useState('')
  const [activeModule, setActiveModule] = useState('sales')
  const [showScanner, setShowScanner] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault()
        setActiveModule('sales')
      }
      if (e.key === 'F3') {
        e.preventDefault()
        setActiveModule('stock')
      }
      if (e.key === 'F8') {
        e.preventDefault()
        setActiveModule('cash')
      }
      if (e.key === 'F11') {
        e.preventDefault()
        setShowScanner(true)
      }
      if (e.key === 'F12') {
        e.preventDefault()
        processSale()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts()
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error cargando productos:', error)
      // Productos de fallback si la API no responde
      setProducts([
        { id: 1, name: 'Café', price: 850, stock: 100, category: 'Bebidas' },
        { id: 2, name: 'Medialunas', price: 450, stock: 50, category: 'Panadería' },
        { id: 3, name: 'Tostado', price: 1200, stock: 30, category: 'Sandwiches' },
        { id: 4, name: 'Jugo Natural', price: 600, stock: 45, category: 'Bebidas' },
      ])
    }
  }

  const handleBarcodeScan = (barcode: string) => {
    // Buscar producto por código de barras
    const product = products.find(p => p.id.toString() === barcode)
    if (product) {
      addToCart(product)
    } else {
      showToast.error(`Producto no encontrado: ${barcode}`)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
      showToast.success(`Se agregó otra unidad de ${product.name} al carrito`)
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
      showToast.success(`${product.name} agregado al carrito`)
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const processSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setLoading(true)

    const saleData = {
      items: cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      })),
      total: calculateTotal(),
      payment_method: paymentMethod,
      customer_email: customerEmail || 'cliente@nordia.com'
    }

    try {
      const response = await api.createSale(saleData)

      if (response.ok) {
        const result = await response.json()
        showToast.sale(calculateTotal(), paymentMethod)
        setCart([])
        fetchProducts() // Recargar productos para actualizar stock
      } else {
        showToast.error('Error procesando la venta')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast.error('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  // Renderizar contenido del módulo activo
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'sales':
        return (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📦</span>
              Productos
            </h2>
            <ProductGrid
              products={products}
              onAddToCart={addToCart}
              viewMode="grid"
              loading={loading}
              showHeader={true}
              showSearch={true}
            />
          </div>
        )
      case 'stock':
        return <StockManager />
      case 'cash':
        return <CashRegister />
      default:
        return null
    }
  }

  return (
    <AdaptiveLayout
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      cart={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeFromCart}
      onCheckout={processSale}
      paymentMethod={paymentMethod}
      onPaymentMethodChange={setPaymentMethod}
      customerEmail={customerEmail}
      onCustomerEmailChange={setCustomerEmail}
      loading={loading}
      onScannerOpen={() => setShowScanner(true)}
    >
      {renderModuleContent()}

      {/* Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </AdaptiveLayout>
  )
}