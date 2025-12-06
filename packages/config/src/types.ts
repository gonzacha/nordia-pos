export type BusinessType =
  | "BUTCHER"
  | "GREENGROCER"
  | "BAKERY"
  | "MINIMARKET"
  | "COSMETICS"
  | "TOYSHOP"
  | "KIOSK"
  | "PETSHOP"
  | "OTHER"

export interface BusinessTemplate {
  id: BusinessType
  name: string
  icon: string
  description: string
  color: string
  defaultStoreName: string
  categories: { name: string; icon?: string }[]
  products: {
    name: string
    plu: string              // PLU para balanza (5 dígitos, ej: "00001")
    barcode?: string         // Código de barras opcional para productos empaquetados
    categoryName?: string
    unit: 'kg' | 'unit' | 'lt'  // Unidad de medida
    price: number
    cost?: number
    trackStock: boolean
  }[]
}

export type PlanType = "FREE" | "START" | "BUSINESS" | "INTELLIGENCE"

export interface PricingPlan {
  id: PlanType
  name: string
  price: number
  currency: "USD"
  features: string[]
  limitations?: string[]
}
