'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/authStore'
import { useProductsStore } from '@/lib/productsStore'
import { useStockStore } from '@/lib/stockStore'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, storeId } = useAuthStore()
  const { fetchProducts } = useProductsStore()
  const { fetchMovements } = useStockStore()

  // Limpiar cache viejo al iniciar (ahora todo viene de Supabase)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nordia-stock')
      localStorage.removeItem('nordia-pos-storage')
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && storeId) {
      // Cargar productos y movimientos de stock desde Supabase
      fetchProducts(storeId)
      fetchMovements(storeId)
    }
  }, [isAuthenticated, storeId, fetchProducts, fetchMovements])

  return <>{children}</>
}
