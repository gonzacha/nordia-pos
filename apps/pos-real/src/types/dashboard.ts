export type DateRange = 'today' | 'yesterday' | 'week' | 'month' | 'custom'

export interface SalesSummary {
  totalRevenue: number
  totalTransactions: number
  avgTicket: number
  totalItemsSold: number
}

export interface SalesComparison {
  currentRevenue: number
  previousRevenue: number
  revenueChangePercent: number
  currentTransactions: number
  previousTransactions: number
  transactionsChangePercent: number
}

export interface TopProduct {
  productId: string
  productName: string
  totalQuantity: number
  totalRevenue: number
  unit: string
}

export interface HourlySales {
  hour: number
  totalSales: number
  transactionCount: number
}

export interface DailySales {
  dayOfWeek: number
  dayName: string
  totalSales: number
  transactionCount: number
}

export interface StockAlert {
  productId: string
  productName: string
  currentStock: number
  unit: string
  alertType: 'out_of_stock' | 'low_stock' | 'ok'
}

export interface WasteSummary {
  reason: string
  totalQuantity: number
  productCount: number
}

export interface WasteDetail {
  reason: string
  productId: string
  productName: string
  totalQuantity: number
}

export interface DashboardMetrics {
  summary: SalesSummary | null
  comparison: SalesComparison | null
  topProducts: TopProduct[]
  hourlySales: HourlySales[]
  dailySales: DailySales[]
  stockAlerts: StockAlert[]
  wasteSummary: WasteSummary[]
  wasteDetails: Record<string, WasteDetail[]>
}

// Helpers para labels de razones de merma
export const WASTE_REASON_LABELS: Record<string, string> = {
  vencimiento: 'Vencimiento',
  dano: 'Daño/Rotura',
  robo: 'Robo/Pérdida',
  merma_natural: 'Merma Natural',
  consumo_interno: 'Consumo Interno',
  sin_motivo: 'Sin especificar',
}

// Helper para obtener rango de fechas
export function getDateRange(range: DateRange): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (range) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      return {
        start: yesterday,
        end: today
      }
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay()) // Domingo
      return {
        start: weekStart,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return {
        start: monthStart,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    default:
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
  }
}

// Helper para período anterior (para comparación)
export function getPreviousPeriod(range: DateRange): { start: Date; end: Date } {
  const current = getDateRange(range)
  const duration = current.end.getTime() - current.start.getTime()

  return {
    start: new Date(current.start.getTime() - duration),
    end: current.start
  }
}
