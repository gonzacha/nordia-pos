'use client'
import { Calendar } from 'lucide-react'
import { DateRange } from '@/types/dashboard'

interface DateRangeSelectorProps {
  selected: DateRange
  onChange: (range: DateRange) => void
}

const ranges: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
]

export function DateRangeSelector({ selected, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
      <Calendar className="w-4 h-4 text-gray-500 ml-2" />
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selected === range.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
