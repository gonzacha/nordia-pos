"use client"

import { create } from 'zustand'
import { supabase } from './supabase'
import {
  DateRange,
  DashboardMetrics,
  SalesSummary,
  SalesComparison,
  TopProduct,
  HourlySales,
  DailySales,
  StockAlert,
  WasteSummary,
  WasteDetail,
  getDateRange,
  getPreviousPeriod,
} from '@/types/dashboard'

// Helper para llamar funciones RPC con tipos genéricos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rpc = (fn: string, params: Record<string, unknown>) => supabase.rpc(fn as any, params as any)

interface DashboardStore {
  // State
  metrics: DashboardMetrics
  isLoading: boolean
  error: string | null
  selectedRange: DateRange

  // Actions
  setDateRange: (range: DateRange) => void
  fetchAllMetrics: (storeId: string) => Promise<void>
  fetchSalesSummary: (storeId: string) => Promise<void>
  fetchSalesComparison: (storeId: string) => Promise<void>
  fetchTopProducts: (storeId: string, limit?: number) => Promise<void>
  fetchHourlySales: (storeId: string) => Promise<void>
  fetchDailySales: (storeId: string) => Promise<void>
  fetchStockAlerts: (storeId: string) => Promise<void>
  fetchWasteSummary: (storeId: string) => Promise<void>
  fetchWasteDetails: (storeId: string) => Promise<void>
}

const initialMetrics: DashboardMetrics = {
  summary: null,
  comparison: null,
  topProducts: [],
  hourlySales: [],
  dailySales: [],
  stockAlerts: [],
  wasteSummary: [],
  wasteDetails: {},
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  metrics: initialMetrics,
  isLoading: false,
  error: null,
  selectedRange: 'today',

  setDateRange: (range) => {
    set({ selectedRange: range })
  },

  fetchAllMetrics: async (storeId) => {
    set({ isLoading: true, error: null })

    try {
      await Promise.all([
        get().fetchSalesSummary(storeId),
        get().fetchSalesComparison(storeId),
        get().fetchTopProducts(storeId),
        get().fetchHourlySales(storeId),
        get().fetchDailySales(storeId),
        get().fetchStockAlerts(storeId),
        get().fetchWasteSummary(storeId),
        get().fetchWasteDetails(storeId),
      ])
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
      set({ error: 'Error al cargar métricas' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchSalesSummary: async (storeId) => {
    const { selectedRange } = get()
    const { start, end } = getDateRange(selectedRange)

    try {
      const { data, error } = await rpc('get_sales_summary', {
        p_store_id: storeId,
        p_start_date: start.toISOString(),
        p_end_date: end.toISOString(),
      })

      if (error) throw error

      const row = (data as unknown[])?.[0] as Record<string, unknown> | undefined
      const summary: SalesSummary = {
        totalRevenue: Number(row?.total_revenue || 0),
        totalTransactions: Number(row?.total_transactions || 0),
        avgTicket: Number(row?.avg_ticket || 0),
        totalItemsSold: Number(row?.total_items_sold || 0),
      }

      set((state) => ({
        metrics: { ...state.metrics, summary }
      }))
    } catch (error) {
      console.error('Error fetching sales summary:', error)
    }
  },

  fetchSalesComparison: async (storeId) => {
    const { selectedRange } = get()
    const current = getDateRange(selectedRange)
    const previous = getPreviousPeriod(selectedRange)

    try {
      const { data, error } = await rpc('get_sales_comparison', {
        p_store_id: storeId,
        p_current_start: current.start.toISOString(),
        p_current_end: current.end.toISOString(),
        p_previous_start: previous.start.toISOString(),
        p_previous_end: previous.end.toISOString(),
      })

      if (error) throw error

      const row = (data as unknown[])?.[0] as Record<string, unknown> | undefined
      const comparison: SalesComparison = {
        currentRevenue: Number(row?.current_revenue || 0),
        previousRevenue: Number(row?.previous_revenue || 0),
        revenueChangePercent: Number(row?.revenue_change_percent || 0),
        currentTransactions: Number(row?.current_transactions || 0),
        previousTransactions: Number(row?.previous_transactions || 0),
        transactionsChangePercent: Number(row?.transactions_change_percent || 0),
      }

      set((state) => ({
        metrics: { ...state.metrics, comparison }
      }))
    } catch (error) {
      console.error('Error fetching sales comparison:', error)
    }
  },

  fetchTopProducts: async (storeId, limit = 5) => {
    const { selectedRange } = get()
    const { start, end } = getDateRange(selectedRange)

    try {
      const { data, error } = await rpc('get_top_products', {
        p_store_id: storeId,
        p_start_date: start.toISOString(),
        p_end_date: end.toISOString(),
        p_limit: limit,
      })

      if (error) throw error

      const rows = (data || []) as Array<Record<string, unknown>>
      const topProducts: TopProduct[] = rows.map((p) => ({
        productId: String(p.product_id),
        productName: String(p.product_name),
        totalQuantity: Number(p.total_quantity),
        totalRevenue: Number(p.total_revenue),
        unit: String(p.unit),
      }))

      set((state) => ({
        metrics: { ...state.metrics, topProducts }
      }))
    } catch (error) {
      console.error('Error fetching top products:', error)
    }
  },

  fetchHourlySales: async (storeId) => {
    const { selectedRange } = get()
    const { start } = getDateRange(selectedRange)

    try {
      const { data, error } = await rpc('get_sales_by_hour', {
        p_store_id: storeId,
        p_date: start.toISOString().split('T')[0],
      })

      if (error) throw error

      const rows = (data || []) as Array<Record<string, unknown>>
      const hourlySales: HourlySales[] = rows.map((h) => ({
        hour: Number(h.hour),
        totalSales: Number(h.total_sales),
        transactionCount: Number(h.transaction_count),
      }))

      set((state) => ({
        metrics: { ...state.metrics, hourlySales }
      }))
    } catch (error) {
      console.error('Error fetching hourly sales:', error)
    }
  },

  fetchDailySales: async (storeId) => {
    const { selectedRange } = get()
    const { start, end } = getDateRange(selectedRange)

    try {
      const { data, error } = await rpc('get_sales_by_day_of_week', {
        p_store_id: storeId,
        p_start_date: start.toISOString(),
        p_end_date: end.toISOString(),
      })

      if (error) throw error

      const rows = (data || []) as Array<Record<string, unknown>>
      const dailySales: DailySales[] = rows.map((d) => ({
        dayOfWeek: Number(d.day_of_week),
        dayName: String(d.day_name),
        totalSales: Number(d.total_sales),
        transactionCount: Number(d.transaction_count),
      }))

      set((state) => ({
        metrics: { ...state.metrics, dailySales }
      }))
    } catch (error) {
      console.error('Error fetching daily sales:', error)
    }
  },

  fetchStockAlerts: async (storeId) => {
    try {
      const { data, error } = await rpc('get_stock_alerts', {
        p_store_id: storeId,
        p_low_stock_threshold: 5,
      })

      if (error) throw error

      const rows = (data || []) as Array<Record<string, unknown>>
      const stockAlerts: StockAlert[] = rows.map((a) => ({
        productId: String(a.product_id),
        productName: String(a.product_name),
        currentStock: Number(a.current_stock),
        unit: String(a.unit),
        alertType: a.alert_type as 'out_of_stock' | 'low_stock' | 'ok',
      }))

      set((state) => ({
        metrics: { ...state.metrics, stockAlerts }
      }))
    } catch (error) {
      console.error('Error fetching stock alerts:', error)
    }
  },

  fetchWasteSummary: async (storeId) => {
    const { selectedRange } = get()
    const { start, end } = getDateRange(selectedRange)

    try {
      const { data, error } = await rpc('get_waste_summary', {
        p_store_id: storeId,
        p_start_date: start.toISOString(),
        p_end_date: end.toISOString(),
      })

      if (error) throw error

      const rows = (data || []) as Array<Record<string, unknown>>
      const wasteSummary: WasteSummary[] = rows.map((w) => ({
        reason: String(w.reason),
        totalQuantity: Number(w.total_quantity),
        productCount: Number(w.product_count),
      }))

      set((state) => ({
        metrics: { ...state.metrics, wasteSummary }
      }))
    } catch (error) {
      console.error('Error fetching waste summary:', error)
    }
  },

  fetchWasteDetails: async (storeId) => {
    const { selectedRange } = get()
    const { start, end } = getDateRange(selectedRange)

    try {
      const { data, error } = await rpc('get_waste_details', {
        p_store_id: storeId,
        p_start_date: start.toISOString(),
        p_end_date: end.toISOString(),
      })

      if (error) throw error

      const rows = (data || []) as Array<Record<string, unknown>>

      // Agrupar por razón
      const grouped: Record<string, WasteDetail[]> = {}
      for (const item of rows) {
        const reason = String(item.reason)
        if (!grouped[reason]) grouped[reason] = []
        grouped[reason].push({
          reason,
          productId: String(item.product_id),
          productName: String(item.product_name),
          totalQuantity: Number(item.total_quantity),
        })
      }

      set((state) => ({
        metrics: { ...state.metrics, wasteDetails: grouped }
      }))
    } catch (error) {
      console.error('Error fetching waste details:', error)
    }
  },
}))
