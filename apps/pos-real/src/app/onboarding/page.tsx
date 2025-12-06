'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useOnboardingStore } from '@/lib/onboardingStore'
import { STEP_TITLES, STEP_DESCRIPTIONS } from '@/types/onboarding'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { StoreTypeSelector } from '@/components/onboarding/StoreTypeSelector'
import { StoreDetailsForm } from '@/components/onboarding/StoreDetailsForm'
import { PinSetup } from '@/components/onboarding/PinSetup'
import { OnboardingSuccess } from '@/components/onboarding/OnboardingSuccess'

export default function OnboardingPage() {
  const {
    step,
    data,
    isLoading,
    error,
    nextStep,
    prevStep,
    setStoreType,
    setStoreName,
    setPhone,
    setAddress,
    setPin,
    setPinConfirm,
    validateStep,
    getSelectedTemplate,
    createStore,
  } = useOnboardingStore()

  const validation = validateStep(step)
  const template = getSelectedTemplate()

  const handleNext = async () => {
    if (step === 3) {
      // Create store on step 3
      await createStore()
    } else {
      nextStep()
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.storeType !== null
      case 2:
        return data.storeName.length >= 3
      case 3:
        return data.pin.length === 4 && data.pin === data.pinConfirm
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center px-4 py-8">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="text-xl font-bold text-white">Nordia POS</h1>
          <p className="text-slate-400 text-sm">Configurá tu negocio</p>
        </motion.div>

        {/* Step Indicator (hide on success) */}
        {step !== 4 && (
          <div className="mb-6">
            <StepIndicator currentStep={step} />
          </div>
        )}

        {/* Main Content Card */}
        <motion.div
          layout
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          {/* Step Header (hide on success) */}
          {step !== 4 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {STEP_TITLES[step]}
              </h2>
              <p className="text-gray-500 text-sm">
                {STEP_DESCRIPTIONS[step]}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StoreTypeSelector
                  selected={data.storeType}
                  onSelect={setStoreType}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StoreDetailsForm
                  data={data}
                  errors={validation.errors}
                  onStoreName={setStoreName}
                  onPhone={setPhone}
                  onAddress={setAddress}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PinSetup
                  pin={data.pin}
                  pinConfirm={data.pinConfirm}
                  onPinChange={setPin}
                  onPinConfirmChange={setPinConfirm}
                  errors={validation.errors}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <OnboardingSuccess
                  storeName={data.storeName}
                  template={template}
                  pin={data.pin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons (hide on success) */}
          {step !== 4 && (
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-semibold transition-all
                  flex items-center justify-center gap-2
                  ${canProceed() && !isLoading
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando...
                  </>
                ) : step === 3 ? (
                  <>
                    Crear negocio
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Login Link */}
        {step !== 4 && (
          <p className="text-center text-slate-400 text-sm mt-6">
            ¿Ya tenés cuenta?{' '}
            <a href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
              Iniciar sesión
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
