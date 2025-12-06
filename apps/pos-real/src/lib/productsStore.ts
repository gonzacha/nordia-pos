"use client"

import { create } from 'zustand'
import { supabase } from './supabase'

export interface Product {
  id: string
  storeId: string | null
  categoryId: string | null
  name: string
  plu: string | null
  barcode: string | null
  price: number
  cost: number | null
  unit: 'kg' | 'unit' | 'lt'
  trackStock: boolean
  minStock: number
  active: boolean
  currentStock?: number
  // Compatibility with legacy store.Product
  category: string
  stock?: number
}

// Type for Supabase products_with_stock view response
interface ProductWithStockRow {
  id: string
  store_id: string | null
  category_id: string | null
  name: string
  plu: string | null
  barcode: string | null
  price: number
  cost: number | null
  unit: string
  track_stock: boolean
  min_stock: number
  active: boolean
  current_stock: number | null
  category_name?: string | null
}

// Type for Supabase products table response
interface ProductRow {
  id: string
  store_id: string | null
  category_id: string | null
  name: string
  plu: string | null
  barcode: string | null
  price: number
  cost: number | null
  unit: string
  track_stock: boolean
  min_stock: number
  active: boolean
}

interface ProductsStore {
  products: Product[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchProducts: (storeId: string) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>

  // Helpers
  getProductById: (id: string) => Product | undefined
  getProductByPlu: (plu: string) => Product | undefined
  getProductByBarcode: (barcode: string) => Product | undefined
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async (storeId: string) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('products_with_stock')
        .select('*')
        .eq('store_id', storeId)
        .eq('active', true)
        .order('name')

      if (error) throw error

      const rows = (data || []) as ProductWithStockRow[]
      const products: Product[] = rows.map(p => ({
        id: p.id,
        storeId: p.store_id,
        categoryId: p.category_id,
        name: p.name,
        plu: p.plu,
        barcode: p.barcode,
        price: Number(p.price),
        cost: p.cost ? Number(p.cost) : null,
        unit: p.unit as 'kg' | 'unit' | 'lt',
        trackStock: p.track_stock,
        minStock: Number(p.min_stock),
        active: p.active,
        currentStock: Number(p.current_stock) || 0,
        // Legacy compatibility
        category: p.category_name || 'General',
        stock: Number(p.current_stock) || 0,
      }))

      set({ products, isLoading: false })
    } catch (error) {
      console.error('Error fetching products:', error)
      set({ error: 'Error al cargar productos', isLoading: false })
    }
  },

  addProduct: async (product) => {
    try {
      const insertData = {
        store_id: product.storeId,
        category_id: product.categoryId,
        name: product.name,
        plu: product.plu,
        barcode: product.barcode,
        price: product.price,
        cost: product.cost,
        unit: product.unit,
        track_stock: product.trackStock,
        min_stock: product.minStock,
        active: product.active,
      }

      const { data, error } = await supabase
        .from('products')
        .insert(insertData as never)
        .select()
        .single()

      if (error) throw error

      const row = data as unknown as ProductRow
      const newProduct: Product = {
        id: row.id,
        storeId: row.store_id,
        categoryId: row.category_id,
        name: row.name,
        plu: row.plu,
        barcode: row.barcode,
        price: Number(row.price),
        cost: row.cost ? Number(row.cost) : null,
        unit: row.unit as 'kg' | 'unit' | 'lt',
        trackStock: row.track_stock,
        minStock: Number(row.min_stock),
        active: row.active,
        currentStock: 0,
        // Legacy compatibility
        category: product.category || 'General',
        stock: 0,
      }

      set(state => ({ products: [...state.products, newProduct] }))
      return newProduct
    } catch (error) {
      console.error('Error adding product:', error)
      return null
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.plu !== undefined) updateData.plu = updates.plu
      if (updates.barcode !== undefined) updateData.barcode = updates.barcode
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.cost !== undefined) updateData.cost = updates.cost
      if (updates.unit !== undefined) updateData.unit = updates.unit
      if (updates.trackStock !== undefined) updateData.track_stock = updates.trackStock
      if (updates.minStock !== undefined) updateData.min_stock = updates.minStock
      if (updates.active !== undefined) updateData.active = updates.active

      const { error } = await supabase
        .from('products')
        .update(updateData as never)
        .eq('id', id)

      if (error) throw error

      set(state => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, ...updates } : p
        )
      }))
      return true
    } catch (error) {
      console.error('Error updating product:', error)
      return false
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: false } as never)
        .eq('id', id)

      if (error) throw error

      set(state => ({
        products: state.products.filter(p => p.id !== id)
      }))
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  },

  getProductById: (id) => get().products.find(p => p.id === id),
  getProductByPlu: (plu) => get().products.find(p => p.plu === plu),
  getProductByBarcode: (barcode) => get().products.find(p => p.barcode === barcode),
}))
