'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Calendar } from 'lucide-react'
import { DailySales } from '@/types/dashboard'

interface WeeklySalesChartProps {
  data: DailySales[]
  loading?: boolean
}

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function WeeklySalesChart({ data, loading }: WeeklySalesChartProps) {
  // Crear array completo de 7 días
  const fullWeekData = dayLabels.map((label, index) => {
    const found = data.find(d => d.dayOfWeek === index)
    return {
      dayOfWeek: index,
      dayName: label,
      totalSales: found?.totalSales || 0,
      transactionCount: found?.transactionCount || 0,
    }
  })

  // Encontrar el día con más ventas
  const bestDay = fullWeekData.reduce((max, curr) =>
    curr.totalSales > max.totalSales ? curr : max
  , fullWeekData[0])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { dayName: string; transactionCount: number } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.dayName}</p>
          <p className="text-green-600 font-bold">
            ${payload[0].value.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500">
            {payload[0].payload.transactionCount} transacciones
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Ventas por Día</h3>
        </div>
        {bestDay && bestDay.totalSales > 0 && (
          <span className="text-xs text-gray-500">
            Mejor día: {bestDay.dayName}
          </span>
        )}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fullWeekData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="dayName"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalSales" radius={[6, 6, 0, 0]}>
              {fullWeekData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.dayOfWeek === bestDay?.dayOfWeek ? '#8B5CF6' : '#E5E7EB'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
