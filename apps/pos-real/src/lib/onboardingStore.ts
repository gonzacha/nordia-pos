"use client"

import { create } from 'zustand'
import { BusinessType, BusinessTemplate, BUSINESS_TEMPLATES } from "@nordia/config"
import { OnboardingStep, OnboardingData, OnboardingValidation } from '@/types/onboarding'
import { supabase } from './supabase'
import { Database } from '@/types/database'

// Type helpers for Supabase inserts
type StoreInsert = Database['public']['Tables']['stores']['Insert']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type UserInsert = Database['public']['Tables']['users']['Insert']

// Generic insert helper to bypass strict type checking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertInto = (table: string, data: any) => supabase.from(table as any).insert(data as any)

interface OnboardingStore {
  // State
  step: OnboardingStep
  data: OnboardingData
  isLoading: boolean
  error: string | null
  createdStoreId: string | null

  // Actions
  setStep: (step: OnboardingStep) => void
  nextStep: () => void
  prevStep: () => void

  setStoreType: (type: BusinessType) => void
  setStoreName: (name: string) => void
  setPhone: (phone: string) => void
  setAddress: (address: string) => void
  setPin: (pin: string) => void
  setPinConfirm: (pin: string) => void

  validateStep: (step: OnboardingStep) => OnboardingValidation
  getSelectedTemplate: () => BusinessTemplate | null

  createStore: () => Promise<boolean>
  reset: () => void
}

const initialData: OnboardingData = {
  storeType: null,
  storeName: '',
  phone: '',
  address: '',
  pin: '',
  pinConfirm: '',
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  step: 1,
  data: initialData,
  isLoading: false,
  error: null,
  createdStoreId: null,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const { step } = get()
    if (step < 4) {
      set({ step: (step + 1) as OnboardingStep })
    }
  },

  prevStep: () => {
    const { step } = get()
    if (step > 1) {
      set({ step: (step - 1) as OnboardingStep })
    }
  },

  setStoreType: (type) => {
    const template = BUSINESS_TEMPLATES[type]
    set((state) => ({
      data: {
        ...state.data,
        storeType: type,
        storeName: state.data.storeName || template?.defaultStoreName || '',
      }
    }))
  },

  setStoreName: (name) => set((state) => ({
    data: { ...state.data, storeName: name }
  })),

  setPhone: (phone) => set((state) => ({
    data: { ...state.data, phone }
  })),

  setAddress: (address) => set((state) => ({
    data: { ...state.data, address }
  })),

  setPin: (pin) => set((state) => ({
    data: { ...state.data, pin }
  })),

  setPinConfirm: (pin) => set((state) => ({
    data: { ...state.data, pinConfirm: pin }
  })),

  validateStep: (step) => {
    const { data } = get()
    const errors: Partial<Record<keyof OnboardingData, string>> = {}

    switch (step) {
      case 1:
        if (!data.storeType) {
          errors.storeType = 'Selecciona un tipo de negocio'
        }
        break

      case 2:
        if (!data.storeName || data.storeName.length < 3) {
          errors.storeName = 'El nombre debe tener al menos 3 caracteres'
        }
        if (data.phone && !/^\d{10,11}$/.test(data.phone.replace(/\D/g, ''))) {
          errors.phone = 'El teléfono debe tener 10-11 dígitos'
        }
        break

      case 3:
        if (!/^\d{4}$/.test(data.pin)) {
          errors.pin = 'El PIN debe ser de 4 dígitos'
        }
        if (data.pin !== data.pinConfirm) {
          errors.pinConfirm = 'Los PINs no coinciden'
        }
        break
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  getSelectedTemplate: () => {
    const { data } = get()
    return data.storeType ? BUSINESS_TEMPLATES[data.storeType] : null
  },

  createStore: async () => {
    const { data, validateStep } = get()

    // Validar paso 3 antes de crear
    const validation = validateStep(3)
    if (!validation.isValid) {
      set({ error: 'Por favor completa todos los campos correctamente' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const template = BUSINESS_TEMPLATES[data.storeType!]

      // 1. Crear la tienda
      const storeInsert: StoreInsert = {
        name: data.storeName,
        type: data.storeType,
        phone: data.phone || null,
        address: data.address || null,
      }

      const { data: storeData, error: storeError } = await insertInto('stores', storeInsert).select().single()

      if (storeError) throw storeError

      const storeResult = storeData as { id: string }
      const storeId = storeResult.id

      // 2. Crear categorías del template
      const categoriesData: CategoryInsert[] = template.categories.map((cat, idx) => ({
        store_id: storeId,
        name: cat.name,
        icon: cat.icon || '📦',
        sort_order: idx,
      }))

      const { data: createdCategories, error: catError } = await insertInto('categories', categoriesData).select()

      if (catError) throw catError

      const categoriesResult = createdCategories as Array<{ id: string; name: string }>

      // Mapear nombres de categorías a IDs
      const categoryMap = new Map(
        categoriesResult.map(c => [c.name, c.id])
      )

      // 3. Crear productos del template
      const productsData: ProductInsert[] = template.products.map((prod) => ({
        store_id: storeId,
        category_id: categoryMap.get(prod.categoryName || 'General') || categoriesResult[0].id,
        name: prod.name,
        plu: prod.plu,
        barcode: prod.barcode || null,
        price: prod.price,
        cost: prod.cost || 0,
        unit: prod.unit,
        track_stock: prod.trackStock,
        active: true,
      }))

      const { error: prodError } = await insertInto('products', productsData)

      if (prodError) throw prodError

      // 4. Crear usuario admin con el PIN
      const userInsert: UserInsert = {
        store_id: storeId,
        name: 'Administrador',
        pin: data.pin,
        role: 'admin',
        active: true,
      }

      const { error: userError } = await insertInto('users', userInsert)

      if (userError) throw userError

      set({
        isLoading: false,
        createdStoreId: storeId,
        step: 4
      })

      return true

    } catch (error) {
      console.error('Error creating store:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al crear el negocio'
      })
      return false
    }
  },

  reset: () => set({
    step: 1,
    data: initialData,
    isLoading: false,
    error: null,
    createdStoreId: null,
  }),
}))
