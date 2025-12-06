'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Clock } from 'lucide-react'
import { HourlySales } from '@/types/dashboard'

interface HourlySalesChartProps {
  data: HourlySales[]
  loading?: boolean
}

export function HourlySalesChart({ data, loading }: HourlySalesChartProps) {
  // Crear array de 24 horas con datos
  const fullDayData = Array.from({ length: 24 }, (_, hour) => {
    const found = data.find(d => d.hour === hour)
    return {
      hour,
      label: `${hour}:00`,
      totalSales: found?.totalSales || 0,
      transactionCount: found?.transactionCount || 0,
    }
  })

  // Solo mostrar horas de operación típicas (6am - 22pm)
  const operatingHours = fullDayData.filter(d => d.hour >= 6 && d.hour <= 22)

  // Encontrar la hora pico
  const peakHour = operatingHours.reduce((max, curr) =>
    curr.totalSales > max.totalSales ? curr : max
  , operatingHours[0])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { transactionCount: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-green-600 font-bold">
            ${payload[0].value.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500">
            {payload[0].payload.transactionCount} ventas
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
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Ventas por Hora</h3>
        </div>
        {peakHour && peakHour.totalSales > 0 && (
          <span className="text-xs text-gray-500">
            Hora pico: {peakHour.label}
          </span>
        )}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={operatingHours} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              interval={2}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalSales" radius={[4, 4, 0, 0]}>
              {operatingHours.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.hour === peakHour?.hour ? '#22C55E' : '#E5E7EB'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
