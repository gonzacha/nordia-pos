'use client'

import { useState, useEffect } from 'react'

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

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8003/api/products')
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

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
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
      const response = await fetch('http://localhost:8003/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`✅ Venta exitosa! ID: ${result.sale_id}`)
        setCart([])
        fetchProducts() // Recargar productos para actualizar stock
      } else {
        alert('Error procesando la venta')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión con el servidor')
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white text-green-600 rounded flex items-center justify-center font-bold">
              N
            </div>
            <h1 className="text-2xl font-bold">Nordia POS</h1>
          </div>
          <div className="text-sm">
            Sistema de Punto de Venta
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📦</span>
                Productos
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      product.stock > 0
                        ? 'border-gray-200 hover:border-green-500 hover:shadow-md'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="text-lg font-medium">{product.name}</div>
                    <div className="text-green-600 font-bold mt-2">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Stock: {product.stock}
                    </div>
                    {product.category && (
                      <div className="text-xs bg-gray-100 rounded px-2 py-1 mt-2">
                        {product.category}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Carrito */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🛒</span>
                Carrito
              </h2>

              {/* Items del carrito */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Carrito vacío
                  </p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="border-b pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} x {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded bg-gray-200 hover:bg-gray-300 w-6 h-6 flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded bg-gray-200 hover:bg-gray-300 w-6 h-6 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-600 w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="text-right font-semibold text-green-600 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>

              {/* Método de pago */}
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Método de pago:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded border text-center ${
                      paymentMethod === 'cash'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-lg">💵</div>
                    <div className="text-xs mt-1">Efectivo</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded border text-center ${
                      paymentMethod === 'card'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-lg">💳</div>
                    <div className="text-xs mt-1">Tarjeta</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mercadopago')}
                    className={`p-2 rounded border text-center ${
                      paymentMethod === 'mercadopago'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-blue-600">MP</div>
                    <div className="text-xs mt-1">MercadoPago</div>
                  </button>
                </div>
              </div>

              {/* Email cliente (opcional) */}
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Email cliente (opcional):
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              {/* Botón de cobrar */}
              <button
                onClick={processSale}
                disabled={cart.length === 0 || loading}
                className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-all ${
                  cart.length > 0 && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">💳</span>
                    COBRAR {formatPrice(calculateTotal())}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
