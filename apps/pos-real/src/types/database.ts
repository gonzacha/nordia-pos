export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          slug: string | null
          type: string | null
          address: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          type?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          type?: string | null
          address?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          store_id: string | null
          name: string
          email: string | null
          pin: string
          role: 'admin' | 'cashier'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id?: string | null
          name: string
          email?: string | null
          pin: string
          role: 'admin' | 'cashier'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string | null
          name?: string
          email?: string | null
          pin?: string
          role?: 'admin' | 'cashier'
          active?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          store_id: string | null
          name: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          store_id?: string | null
          name: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string | null
          name?: string
          icon?: string | null
          sort_order?: number
        }
      }
      products: {
        Row: {
          id: string
          store_id: string | null
          category_id: string | null
          name: string
          plu: string | null
          barcode: string | null
          price: number
          cost: number | null
          unit: 'kg' | 'unit' | 'lt'
          track_stock: boolean
          min_stock: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id?: string | null
          category_id?: string | null
          name: string
          plu?: string | null
          barcode?: string | null
          price: number
          cost?: number | null
          unit?: 'kg' | 'unit' | 'lt'
          track_stock?: boolean
          min_stock?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string | null
          category_id?: string | null
          name?: string
          plu?: string | null
          barcode?: string | null
          price?: number
          cost?: number | null
          unit?: 'kg' | 'unit' | 'lt'
          track_stock?: boolean
          min_stock?: number
          active?: boolean
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          store_id: string | null
          product_id: string | null
          user_id: string | null
          type: 'ingreso' | 'venta' | 'merma' | 'ajuste'
          quantity: number
          unit: 'kg' | 'unit' | 'lt'
          supplier_name: string | null
          reference: string | null
          cost: number | null
          reason: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id?: string | null
          product_id?: string | null
          user_id?: string | null
          type: 'ingreso' | 'venta' | 'merma' | 'ajuste'
          quantity: number
          unit: 'kg' | 'unit' | 'lt'
          supplier_name?: string | null
          reference?: string | null
          cost?: number | null
          reason?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string | null
          product_id?: string | null
          user_id?: string | null
          type?: 'ingreso' | 'venta' | 'merma' | 'ajuste'
          quantity?: number
          unit?: 'kg' | 'unit' | 'lt'
          supplier_name?: string | null
          reference?: string | null
          cost?: number | null
          reason?: string | null
          note?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          store_id: string | null
          user_id: string | null
          total: number
          payment_method: 'efectivo' | 'debito' | 'credito' | 'transferencia' | 'qr'
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          store_id?: string | null
          user_id?: string | null
          total: number
          payment_method: 'efectivo' | 'debito' | 'credito' | 'transferencia' | 'qr'
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string | null
          user_id?: string | null
          total?: number
          payment_method?: 'efectivo' | 'debito' | 'credito' | 'transferencia' | 'qr'
          status?: 'pending' | 'completed' | 'cancelled'
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          sale_id?: string | null
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          sale_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
      }
    }
    Views: {
      products_with_stock: {
        Row: {
          id: string
          store_id: string | null
          category_id: string | null
          name: string
          plu: string | null
          barcode: string | null
          price: number
          cost: number | null
          unit: 'kg' | 'unit' | 'lt'
          track_stock: boolean
          min_stock: number
          active: boolean
          created_at: string
          updated_at: string
          current_stock: number
        }
      }
    }
    Functions: {
      get_product_stock: {
        Args: { p_product_id: string }
        Returns: number
      }
    }
  }
}
