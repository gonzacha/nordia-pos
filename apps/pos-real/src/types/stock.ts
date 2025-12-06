export type MovementType = 'ingreso' | 'venta' | 'merma' | 'ajuste'

export type MermaReason =
  | 'vencimiento'
  | 'dano'
  | 'robo'
  | 'merma_natural'
  | 'consumo_interno'

export const MERMA_CATEGORIES: { value: MermaReason; label: string; icon: string }[] = [
  { value: 'vencimiento', label: 'Vencimiento', icon: '📅' },
  { value: 'dano', label: 'Daño/Rotura', icon: '💔' },
  { value: 'robo', label: 'Robo/Pérdida', icon: '🚨' },
  { value: 'merma_natural', label: 'Merma Natural', icon: '💧' },
  { value: 'consumo_interno', label: 'Consumo Interno', icon: '🍽️' },
]

export interface StockMovement {
  id: string
  productId: string
  type: MovementType
  quantity: number          // + entrada, - salida
  unit: 'kg' | 'unit' | 'lt'
  timestamp: string         // ISO date

  // FREE: Todo opcional, texto libre
  supplierName?: string      // "Juan carnes" o vacío
  reference?: string         // "compra del lunes", "Factura 001", etc
  cost?: number              // Costo por unidad/kg (opcional)
  reason?: MermaReason       // Solo si type === 'merma'
  note?: string              // Observaciones

  // PRO: Para futuro (no implementar UI todavía)
  supplierId?: string
  invoiceNumber?: string
  invoiceType?: 'A' | 'B' | 'C'

  userId: string             // Quién registró el movimiento
}

// Helper para calcular stock de un producto
export interface ProductStock {
  productId: string
  productName: string
  currentStock: number
  unit: 'kg' | 'unit' | 'lt'
  status: 'ok' | 'low' | 'out'  // Semáforo
  lastMovement?: string         // Fecha último movimiento
}
