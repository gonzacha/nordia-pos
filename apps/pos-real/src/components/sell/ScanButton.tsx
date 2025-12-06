'use client'
import { ScanLine } from 'lucide-react'

interface ScanButtonProps {
  onClick: () => void
}

export function ScanButton({ onClick }: ScanButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-5 bg-gradient-to-r from-nordia-primary to-[#2a2a4e] text-white rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg"
    >
      <ScanLine className="h-6 w-6" />
      ESCANEAR
    </button>
  )
}
