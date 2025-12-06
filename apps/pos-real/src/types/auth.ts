// Tipos que matchean con estructura de Supabase

export type UserRole = 'admin' | 'cashier'

export interface User {
  id: string
  email?: string | null   // Para Supabase Auth
  name: string
  pin: string             // PIN hasheado (4-6 dígitos)
  role: UserRole
  storeId: string | null
  avatar?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  pin: string
  // En futuro puede incluir email/password para Supabase
}

// Permisos por rol
export const PERMISSIONS = {
  admin: [
    'sell',
    'view_products',
    'create_product',
    'edit_product',
    'delete_product',
    'view_stock',
    'manage_stock',
    'view_reports',
    'view_costs',
    'manage_users',
    'settings',
  ],
  cashier: [
    'sell',
    'view_products',
    'view_stock',  // Solo lectura
  ],
} as const

export type Permission = typeof PERMISSIONS.admin[number]

// Helper para verificar permisos
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const rolePermissions = PERMISSIONS[role] as readonly string[]
  return rolePermissions?.includes(permission) ?? false
}
