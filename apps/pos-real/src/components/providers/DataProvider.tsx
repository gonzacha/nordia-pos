'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/authStore'
import { useProductsStore } from '@/lib/productsStore'
import { useStockStore } from '@/lib/stockStore'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, storeId } = useAuthStore()
  const { fetchProducts } = useProductsStore()
  const { fetchMovements } = useStockStore()

  // Limpiar cache viejo de stock (ahora viene de Supabase)
  // NOTA: NO eliminamos nordia-pos-storage porque contiene el carrito
  // Si se corta la luz durante una venta, al volver el carrito sigue ahí
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nordia-stock')
      // NO borrar 'nordia-pos-storage' - preserva el carrito ante cortes de luz
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
