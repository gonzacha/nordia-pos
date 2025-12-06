'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { OnboardingStep } from '@/types/onboarding'

interface StepIndicatorProps {
  currentStep: OnboardingStep
  totalSteps?: number
}

export function StepIndicator({ currentStep, totalSteps = 4 }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-600 text-slate-400'
                }
              `}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                step
              )}
            </motion.div>

            {step < totalSteps && (
              <div
                className={`
                  w-8 h-1 mx-1 rounded-full transition-colors duration-300
                  ${step < currentStep ? 'bg-green-500' : 'bg-slate-600'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
