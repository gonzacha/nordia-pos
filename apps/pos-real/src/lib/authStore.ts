import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from './supabase'
import { User, AuthState, hasPermission, Permission } from '@/types/auth'

// Type for Supabase users query response
interface UserRow {
  id: string
  store_id: string | null
  name: string
  email: string | null
  pin: string
  role: string
  active: boolean
  created_at: string
  updated_at: string
  stores: {
    id: string
    name: string
    type: string
  } | null
}

interface AuthStore extends AuthState {
  // Actions
  login: (pin: string) => Promise<boolean>
  logout: () => void
  checkPermission: (permission: Permission) => boolean

  // Store info
  storeId: string | null
  storeName: string | null

  // Setters
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      storeId: null,
      storeName: null,

      // Login con PIN usando Supabase
      login: async (pin: string) => {
        // Validar que el PIN tenga exactamente 4 digitos
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'El PIN debe tener exactamente 4 digitos'
          })
          return false
        }

        set({ isLoading: true, error: null })

        try {
          // Buscar usuario por PIN en Supabase
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select(`
              *,
              stores (id, name, type)
            `)
            .eq('pin', pin)
            .eq('active', true)
            .single()

          if (userError || !userData) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'PIN incorrecto'
            })
            return false
          }

          const row = userData as UserRow

          // Mapear a nuestro tipo User
          const user: User = {
            id: row.id,
            name: row.name,
            email: row.email,
            pin: row.pin,
            role: row.role as 'admin' | 'cashier',
            storeId: row.store_id,
            active: row.active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }

          // Obtener datos del store
          const storeData = row.stores

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            storeId: storeData?.id || null,
            storeName: storeData?.name || null,
          })
          return true

        } catch (error) {
          console.error('Login error:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Error de conexión'
          })
          return false
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          storeId: null,
          storeName: null,
        })
      },

      // Verificar permiso
      checkPermission: (permission: Permission) => {
        const { user } = get()
        if (!user) return false
        return hasPermission(user.role, permission)
      },

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'nordia-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        storeId: state.storeId,
        storeName: state.storeName,
      }),
    }
  )
)
