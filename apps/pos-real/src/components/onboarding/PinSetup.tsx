'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Delete, Eye, EyeOff } from 'lucide-react'

interface PinSetupProps {
  pin: string
  pinConfirm: string
  onPinChange: (pin: string) => void
  onPinConfirmChange: (pin: string) => void
  errors: {
    pin?: string
    pinConfirm?: string
  }
}

export function PinSetup({
  pin,
  pinConfirm,
  onPinChange,
  onPinConfirmChange,
  errors
}: PinSetupProps) {
  const [showPin, setShowPin] = useState(false)
  const [activeInput, setActiveInput] = useState<'pin' | 'confirm'>('pin')

  const currentPin = activeInput === 'pin' ? pin : pinConfirm
  const setCurrentPin = activeInput === 'pin' ? onPinChange : onPinConfirmChange

  const handleDigit = useCallback((digit: string) => {
    if (currentPin.length < 4) {
      const newPin = currentPin + digit
      setCurrentPin(newPin)

      // Auto-switch to confirm after entering 4 digits
      if (newPin.length === 4 && activeInput === 'pin') {
        setTimeout(() => setActiveInput('confirm'), 200)
      }
    }
  }, [currentPin, setCurrentPin, activeInput])

  const handleDelete = useCallback(() => {
    setCurrentPin(currentPin.slice(0, -1))
  }, [currentPin, setCurrentPin])

  // Listen to physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        handleDigit(e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handleDelete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDigit, handleDelete])

  const renderPinDisplay = (value: string, label: string, isActive: boolean, hasError: boolean) => (
    <div
      className={`
        p-3 rounded-xl border-2 transition-all cursor-pointer
        ${isActive
          ? 'border-amber-500 bg-amber-50'
          : hasError
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 bg-white'
        }
      `}
      onClick={() => setActiveInput(isActive ? activeInput : (label === 'Crear PIN' ? 'pin' : 'confirm'))}
    >
      <p className={`text-xs font-medium mb-2 ${isActive ? 'text-amber-700' : 'text-gray-500'}`}>
        {label}
      </p>
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
              transition-all
              ${value.length > i
                ? 'bg-amber-500 text-white'
                : isActive
                  ? 'bg-amber-100 border-2 border-amber-300'
                  : 'bg-gray-100 border-2 border-gray-200'
              }
            `}
          >
            {value.length > i ? (showPin ? value[i] : '●') : ''}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      {/* PIN Displays */}
      <div className="space-y-3">
        {renderPinDisplay(pin, 'Crear PIN', activeInput === 'pin', !!errors.pin)}
        {errors.pin && (
          <p className="text-red-500 text-sm text-center">{errors.pin}</p>
        )}

        {renderPinDisplay(pinConfirm, 'Confirmar PIN', activeInput === 'confirm', !!errors.pinConfirm)}
        {errors.pinConfirm && (
          <p className="text-red-500 text-sm text-center">{errors.pinConfirm}</p>
        )}
      </div>

      {/* Toggle visibility */}
      <button
        type="button"
        onClick={() => setShowPin(!showPin)}
        className="flex items-center justify-center gap-2 text-sm text-gray-500 w-full py-2"
      >
        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
      </button>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => (
          <button
            key={key || 'empty'}
            type="button"
            onClick={() => {
              if (key === 'del') handleDelete()
              else if (key) handleDigit(key)
            }}
            disabled={key === ''}
            className={`
              h-14 rounded-xl text-xl font-bold transition-all
              ${key === ''
                ? 'invisible'
                : key === 'del'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95'
              }
            `}
          >
            {key === 'del' ? <Delete className="w-5 h-5 mx-auto" /> : key}
          </button>
        ))}
      </div>

      {/* Match indicator */}
      {pin.length === 4 && pinConfirm.length === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            p-3 rounded-xl text-center font-medium
            ${pin === pinConfirm
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }
          `}
        >
          {pin === pinConfirm ? '✓ Los PINs coinciden' : '✗ Los PINs no coinciden'}
        </motion.div>
      )}
    </motion.div>
  )
}
