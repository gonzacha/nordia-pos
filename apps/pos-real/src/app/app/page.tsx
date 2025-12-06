'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DollarSign,
  ShoppingCart,
  Receipt,
  TrendingUp,
  RefreshCw,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '@/lib/authStore'
import { useDashboardStore } from '@/lib/dashboardStore'
import { KPICard } from '@/components/dashboard/KPICard'
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector'
import { TopProductsList } from '@/components/dashboard/TopProductsList'
import { HourlySalesChart } from '@/components/dashboard/HourlySalesChart'
import { WeeklySalesChart } from '@/components/dashboard/WeeklySalesChart'
import { StockAlertsList } from '@/components/dashboard/StockAlertsList'
import { WasteChart } from '@/components/dashboard/WasteChart'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, storeId, storeName, checkPermission } = useAuthStore()
  const {
    metrics,
    isLoading,
    selectedRange,
    setDateRange,
    fetchAllMetrics
  } = useDashboardStore()

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Cargar métricas al montar y cuando cambia el rango
  useEffect(() => {
    if (storeId) {
      fetchAllMetrics(storeId)
    }
  }, [storeId, selectedRange, fetchAllMetrics])

  // Verificar permiso para ver reportes
  const canViewReports = checkPermission('view_reports')

  if (!isAuthenticated) return null

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6 -m-4 md:-m-8 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{storeName || 'Mi Negocio'}</h1>
            <p className="text-blue-100 text-sm">Dashboard de ventas</p>
          </div>
          <button
            onClick={() => storeId && fetchAllMetrics(storeId)}
            disabled={isLoading}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Date Range Selector */}
        <DateRangeSelector
          selected={selectedRange}
          onChange={setDateRange}
        />
      </div>

      {/* Content */}
      <div className="px-0 mt-4">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <KPICard
            title="Ventas"
            value={formatCurrency(metrics.summary?.totalRevenue || 0)}
            change={metrics.comparison?.revenueChangePercent}
            changeLabel="vs anterior"
            icon={<DollarSign className="w-4 h-4 text-green-600" />}
            color="success"
            loading={isLoading}
          />
          <KPICard
            title="Transacciones"
            value={metrics.summary?.totalTransactions || 0}
            change={metrics.comparison?.transactionsChangePercent}
            changeLabel="vs anterior"
            icon={<Receipt className="w-4 h-4 text-blue-600" />}
            loading={isLoading}
          />
          <KPICard
            title="Ticket Promedio"
            value={formatCurrency(metrics.summary?.avgTicket || 0)}
            subtitle="por venta"
            icon={<ShoppingCart className="w-4 h-4 text-purple-600" />}
            loading={isLoading}
          />
          <KPICard
            title="Items Vendidos"
            value={metrics.summary?.totalItemsSold?.toFixed(1) || '0'}
            subtitle="unidades/kg"
            icon={<TrendingUp className="w-4 h-4 text-orange-600" />}
            loading={isLoading}
          />
        </div>

        {/* Top Products & Alerts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TopProductsList
            products={metrics.topProducts}
            loading={isLoading}
          />
          <StockAlertsList
            alerts={metrics.stockAlerts}
            loading={isLoading}
          />
        </div>

        {/* Charts */}
        <div className="space-y-4 mb-4">
          <HourlySalesChart
            data={metrics.hourlySales}
            loading={isLoading}
          />

          {selectedRange !== 'today' && selectedRange !== 'yesterday' && (
            <WeeklySalesChart
              data={metrics.dailySales}
              loading={isLoading}
            />
          )}
        </div>

        {/* Waste Summary */}
        <WasteChart
          data={metrics.wasteDetails}
          loading={isLoading}
        />

        {/* PRO Features Teaser (si es FREE) */}
        {!canViewReports && (
          <div className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Reportes Avanzados</h3>
                <p className="text-sm text-white/80">Disponible en Plan PRO</p>
              </div>
            </div>
            <ul className="text-sm space-y-1 mb-4 text-white/90">
              <li>- Margen por producto y categoria</li>
              <li>- Comparativas historicas</li>
              <li>- Analisis ABC de rentabilidad</li>
              <li>- Exportar a Excel</li>
            </ul>
            <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl">
              Upgrade a PRO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
