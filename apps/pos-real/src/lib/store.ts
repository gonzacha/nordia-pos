"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { BusinessTemplate } from "@nordia/config"

// Types
export interface Product {
  id: string
  name: string
  plu: string | null       // PLU para balanza (5 dígitos, ej: "00001")
  barcode?: string | null  // Código de barras normal (opcional, para productos empaquetados)
  price: number            // Precio por unidad de medida ($/kg, $/unidad, $/lt)
  unit: 'kg' | 'unit' | 'lt'  // Unidad de medida
  category: string
  cost?: number | null
  stock?: number
  trackStock: boolean
}

export interface CartItem {
  id: string               // ID único del item en carrito
  productId: string
  productName: string
  unitPrice: number
  quantity: number         // Para productos por unidad
  weight?: number          // Para productos por peso (kg)
  subtotal: number
}

export interface Sale {
  id: string
  date: string
  total: number
  paymentMethod: string
  items: CartItem[]
}

interface AppState {
  // Business info
  businessType: string | null
  businessName: string | null

  // Products & Categories
  products: Product[]
  categories: string[]

  // Current cart
  currentCart: CartItem[]

  // Sales history
  sales: Sale[]

  // Actions
  initializeFromTemplate: (template: BusinessTemplate) => void
  findProductByBarcode: (barcode: string) => Product | null
  findProductByPlu: (plu: string) => Product | null
  addToCart: (product: Product, quantity: number, weight?: number, priceTotal?: number) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  updateCartItem: (itemId: string, newQuantity: number) => void
  clearCart: () => void
  completeSale: (paymentMethod: string) => void
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  // Initial state
  businessType: null,
  businessName: null,
  products: [],
  categories: [],
  currentCart: [],
  sales: [],

  // Initialize from template
  initializeFromTemplate: (template: BusinessTemplate) => {
    const products: Product[] = template.products.map((p, index) => ({
      id: `product-${index + 1}`,
      name: p.name,
      plu: p.plu,
      barcode: p.barcode,
      category: p.categoryName || template.categories[0]?.name || "General",
      unit: p.unit,
      price: p.price,
      cost: p.cost,
      stock: p.trackStock ? Math.floor(Math.random() * 50) + 10 : undefined,
      trackStock: p.trackStock,
    }))

    const categories = template.categories.map((c) => c.name)

    set({
      businessType: template.id,
      businessName: template.defaultStoreName,
      products,
      categories,
      currentCart: [],
      sales: [],
    })
  },

  // Find product by barcode
  findProductByBarcode: (barcode: string) => {
    const state = get()
    return state.products.find((p) => p.barcode === barcode) || null
  },

  // Find product by PLU (for balance scales)
  findProductByPlu: (plu: string) => {
    const state = get()
    return state.products.find((p) => p.plu === plu) || null
  },

  // Cart management
  addToCart: (product: Product, quantity: number, weight?: number, priceTotal?: number) => {
    const state = get()
    const isPorPeso = product.unit === 'kg' || product.unit === 'lt'

    // Calcular subtotal
    const subtotal = priceTotal
      ? priceTotal
      : weight
        ? weight * product.price
        : quantity * product.price

    // Para productos por UNIDAD: acumular si ya existe
    if (!isPorPeso) {
      const existingItem = state.currentCart.find(
        (item) => item.productId === product.id
      )

      if (existingItem) {
        set({
          currentCart: state.currentCart.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.quantity + quantity) * item.unitPrice,
                }
              : item
          ),
        })
        return
      }
    }

    // Para productos por PESO: siempre crear nuevo item
    // Para productos por UNIDAD sin item existente: crear nuevo
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: isPorPeso ? 1 : quantity,
      weight: isPorPeso ? (weight || quantity) : undefined,
      subtotal,
    }

    set({
      currentCart: [...state.currentCart, newItem],
    })
  },

  removeFromCart: (itemId: string) => {
    set((state) => ({
      currentCart: state.currentCart.filter((item) => item.id !== itemId),
    }))
  },

  updateCartQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId)
      return
    }

    set((state) => ({
      currentCart: state.currentCart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: item.unitPrice * quantity,
            }
          : item
      ),
    }))
  },

  // Actualizar item del carrito (maneja peso y cantidad)
  updateCartItem: (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      get().removeFromCart(itemId)
      return
    }

    set((state) => ({
      currentCart: state.currentCart.map((item) => {
        if (item.id !== itemId) return item
        const product = state.products.find(p => p.id === item.productId)
        const isPorPeso = product?.unit === 'kg' || product?.unit === 'lt'
        return {
          ...item,
          quantity: isPorPeso ? 1 : newQuantity,
          weight: isPorPeso ? newQuantity : undefined,
          subtotal: newQuantity * item.unitPrice,
        }
      }),
    }))
  },

  clearCart: () => {
    set({ currentCart: [] })
  },

  completeSale: (paymentMethod: string) => {
    const state = get()
    if (state.currentCart.length === 0) return

    const total = state.currentCart.reduce((sum, item) => sum + item.subtotal, 0)

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      date: new Date().toISOString(),
      total,
      paymentMethod,
      items: [...state.currentCart],
    }

    // Update stock
    const updatedProducts = state.products.map((product) => {
      const cartItem = state.currentCart.find((item) => item.productId === product.id)
      if (cartItem && product.trackStock && product.stock !== undefined) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity,
        }
      }
      return product
    })

    set({
      sales: [newSale, ...state.sales],
      currentCart: [],
      products: updatedProducts,
    })
  },

  // Product management
  addProduct: (product: Omit<Product, "id">) => {
    const state = get()
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
    }

    set({
      products: [...state.products, newProduct],
    })
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const state = get()
    set({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })
  },

  deleteProduct: (id: string) => {
    const state = get()
    set({
      products: state.products.filter((p) => p.id !== id),
    })
  },
}),
    {
      name: "nordia-pos-storage", // Nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)

