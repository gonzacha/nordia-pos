'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface Store {
  id: string
  name: string
  slug: string
  type: string | null
}

interface StoreContextType {
  store: Store
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({
  children,
  store
}: {
  children: ReactNode
  store: Store
}) {
  return (
    <StoreContext.Provider value={{ store }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
