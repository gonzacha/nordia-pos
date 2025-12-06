"use client"

import { create } from 'zustand'
import { supabase } from './supabase'
import { StockMovement, MovementType, MermaReason, ProductStock } from '@/types/stock'

// Type for Supabase stock_movements row
interface StockMovementRow {
  id: string
  store_id: string | null
  product_id: string | null
  user_id: string | null
  type: string
  quantity: number
  unit: string
  supplier_name: string | null
  reference: string | null
  cost: number | null
  reason: string | null
  note: string | null
  created_at: string
}

interface StockStore {
  movements: StockMovement[]
  isLoading: boolean

  // Supabase actions
  fetchMovements: (storeId: string) => Promise<void>

  addIngresoToSupabase: (data: {
    storeId: string
    productId: string
    quantity: number
    unit: 'kg' | 'unit' | 'lt'
    userId: string
    supplierName?: string
    reference?: string
    cost?: number
    note?: string
  }) => Promise<boolean>

  addMermaToSupabase: (data: {
    storeId: string
    productId: string
    quantity: number
    unit: 'kg' | 'unit' | 'lt'
    userId: string
    reason: MermaReason
    note?: string
  }) => Promise<boolean>

  addVentaToSupabase: (data: {
    storeId: string
    productId: string
    quantity: number
    unit: 'kg' | 'unit' | 'lt'
    userId: string
  }) => Promise<boolean>

  // Legacy local actions (para compatibilidad)
  addIngreso: (data: {
    productId: string
    quantity: number
    unit: 'kg' | 'unit' | 'lt'
    userId: string
    supplierName?: string
    reference?: string
    cost?: number
    note?: string
  }) => void

  addMerma: (data: {
    productId: string
    quantity: number
    unit: 'kg' | 'unit' | 'lt'
    userId: string
    reason: MermaReason
    note?: string
  }) => void

  addVenta: (data: {
    productId: string
    quantity: number
    unit: 'kg' | 'unit' | 'lt'
    userId: string
  }) => void

  // Selectores
  getStockByProduct: (productId: string) => number
  getProductsStock: (products: Array<{ id: string; name: string; unit: 'kg' | 'unit' | 'lt'; trackStock: boolean }>) => ProductStock[]
  getMovementsByProduct: (productId: string) => StockMovement[]

  // Para limpiar (desarrollo)
  clearMovements: () => void
}

export const useStockStore = create<StockStore>((set, get) => ({
      movements: [],
      isLoading: false,

      // Fetch movements from Supabase
      fetchMovements: async (storeId: string) => {
        set({ isLoading: true })

        try {
          const { data, error } = await supabase
            .from('stock_movements')
            .select('*')
            .eq('store_id', storeId)
            .order('created_at', { ascending: false })
            .limit(1000)

          if (error) throw error

          const rows = (data || []) as StockMovementRow[]
          const movements: StockMovement[] = rows.map(m => ({
            id: m.id,
            productId: m.product_id || '',
            type: m.type as MovementType,
            quantity: Number(m.quantity),
            unit: m.unit as 'kg' | 'unit' | 'lt',
            timestamp: m.created_at,
            supplierName: m.supplier_name || undefined,
            reference: m.reference || undefined,
            cost: m.cost ? Number(m.cost) : undefined,
            reason: m.reason as MermaReason | undefined,
            note: m.note || undefined,
            userId: m.user_id || '',
          }))

          set({ movements, isLoading: false })
        } catch (error) {
          console.error('Error fetching movements:', error)
          set({ isLoading: false })
        }
      },

      // Supabase: Add ingreso
      addIngresoToSupabase: async (data) => {
        try {
          const insertData = {
            store_id: data.storeId,
            product_id: data.productId,
            user_id: data.userId,
            type: 'ingreso' as const,
            quantity: Math.abs(data.quantity),
            unit: data.unit,
            supplier_name: data.supplierName,
            reference: data.reference,
            cost: data.cost,
            note: data.note,
          }

          const { error } = await supabase
            .from('stock_movements')
            .insert(insertData as never)

          if (error) throw error

          // Recargar movimientos
          await get().fetchMovements(data.storeId)
          return true
        } catch (error) {
          console.error('Error adding ingreso:', error)
          return false
        }
      },

      // Supabase: Add merma
      addMermaToSupabase: async (data) => {
        try {
          const insertData = {
            store_id: data.storeId,
            product_id: data.productId,
            user_id: data.userId,
            type: 'merma' as const,
            quantity: -Math.abs(data.quantity),
            unit: data.unit,
            reason: data.reason,
            note: data.note,
          }

          const { error } = await supabase
            .from('stock_movements')
            .insert(insertData as never)

          if (error) throw error

          await get().fetchMovements(data.storeId)
          return true
        } catch (error) {
          console.error('Error adding merma:', error)
          return false
        }
      },

      // Supabase: Add venta
      addVentaToSupabase: async (data) => {
        try {
          const insertData = {
            store_id: data.storeId,
            product_id: data.productId,
            user_id: data.userId,
            type: 'venta' as const,
            quantity: -Math.abs(data.quantity),
            unit: data.unit,
          }

          const { error } = await supabase
            .from('stock_movements')
            .insert(insertData as never)

          if (error) throw error
          return true
        } catch (error) {
          console.error('Error adding venta:', error)
          return false
        }
      },

      // Legacy local: Add ingreso (mantener para compatibilidad)
      addIngreso: (data) => {
        const movement: StockMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: data.productId,
          type: 'ingreso',
          quantity: Math.abs(data.quantity),
          unit: data.unit,
          timestamp: new Date().toISOString(),
          userId: data.userId,
          supplierName: data.supplierName,
          reference: data.reference,
          cost: data.cost,
          note: data.note,
        }
        set((state) => ({
          movements: [...state.movements, movement]
        }))
      },

      // Legacy local: Add merma
      addMerma: (data) => {
        const movement: StockMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: data.productId,
          type: 'merma',
          quantity: -Math.abs(data.quantity),
          unit: data.unit,
          timestamp: new Date().toISOString(),
          userId: data.userId,
          reason: data.reason,
          note: data.note,
        }
        set((state) => ({
          movements: [...state.movements, movement]
        }))
      },

      // Legacy local: Add venta
      addVenta: (data) => {
        const movement: StockMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: data.productId,
          type: 'venta',
          quantity: -Math.abs(data.quantity),
          unit: data.unit,
          timestamp: new Date().toISOString(),
          userId: data.userId,
        }
        set((state) => ({
          movements: [...state.movements, movement]
        }))
      },

      getStockByProduct: (productId) => {
        const { movements } = get()
        return movements
          .filter((m) => m.productId === productId)
          .reduce((sum, m) => sum + m.quantity, 0)
      },

      getProductsStock: (products) => {
        const { movements, getStockByProduct } = get()

        return products
          .filter((p) => p.trackStock)
          .map((product) => {
            const currentStock = getStockByProduct(product.id)
            const productMovements = movements.filter((m) => m.productId === product.id)
            const lastMovement = productMovements.length > 0
              ? productMovements[0].timestamp
              : undefined

            let status: 'ok' | 'low' | 'out' = 'ok'
            if (currentStock <= 0) {
              status = 'out'
            } else if (currentStock < 5) {
              status = 'low'
            }

            return {
              productId: product.id,
              productName: product.name,
              currentStock,
              unit: product.unit,
              status,
              lastMovement,
            }
          })
      },

      getMovementsByProduct: (productId) => {
        return get().movements.filter((m) => m.productId === productId)
      },

      clearMovements: () => set({ movements: [] }),
}))
