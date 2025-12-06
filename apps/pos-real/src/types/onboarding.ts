import { BusinessType } from "@nordia/config"

export interface OnboardingData {
  storeType: BusinessType | null
  storeName: string
  phone: string
  address: string
  pin: string
  pinConfirm: string
}

export type OnboardingStep = 1 | 2 | 3 | 4

export interface OnboardingValidation {
  isValid: boolean
  errors: Partial<Record<keyof OnboardingData, string>>
}

export const STEP_TITLES: Record<OnboardingStep, string> = {
  1: "Tipo de negocio",
  2: "Datos del negocio",
  3: "Crear PIN",
  4: "Todo listo",
}

export const STEP_DESCRIPTIONS: Record<OnboardingStep, string> = {
  1: "Selecciona el rubro de tu negocio",
  2: "Completa la información de tu negocio",
  3: "Crea un PIN de 4 dígitos para acceder",
  4: "Tu negocio está listo para empezar",
}
