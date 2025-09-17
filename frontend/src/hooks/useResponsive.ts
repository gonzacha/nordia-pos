/**
 * HOOK RESPONSIVO PARA NORDIA POS
 * Mobile-first responsive system con detección de dispositivos
 */

import { useState, useEffect } from 'react'
import {
  getDeviceType,
  getBreakpointSize,
  isTouchDevice,
  isLandscape,
  getOptimalGridColumns,
  getTouchTargetSize,
  getDeviceClasses,
  type DeviceType,
  type BreakpointSize
} from '@/lib/device-detection'

interface ResponsiveState {
  deviceType: DeviceType
  breakpoint: BreakpointSize
  isTouch: boolean
  isLandscape: boolean
  gridColumns: number
  touchTargetSize: number
  deviceClasses: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
}

/**
 * Hook principal para manejo responsivo
 * Detecta cambios en viewport y orientación
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Estado inicial para SSR (asume móvil)
    if (typeof window === 'undefined') {
      return {
        deviceType: 'mobile',
        breakpoint: 'xs',
        isTouch: true,
        isLandscape: false,
        gridColumns: 2,
        touchTargetSize: 44,
        deviceClasses: 'device-mobile touch-device portrait',
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
        screenHeight: 667
      }
    }

    // Estado inicial del cliente
    const deviceType = getDeviceType()
    const breakpoint = getBreakpointSize()
    const touchDevice = isTouchDevice()
    const landscape = isLandscape()
    const gridColumns = getOptimalGridColumns(deviceType)
    const touchTargetSize = getTouchTargetSize(deviceType)
    const deviceClasses = getDeviceClasses(deviceType)

    return {
      deviceType,
      breakpoint,
      isTouch: touchDevice,
      isLandscape: landscape,
      gridColumns,
      touchTargetSize,
      deviceClasses,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateResponsiveState = () => {
      const deviceType = getDeviceType()
      const breakpoint = getBreakpointSize()
      const touchDevice = isTouchDevice()
      const landscape = isLandscape()
      const gridColumns = getOptimalGridColumns(deviceType)
      const touchTargetSize = getTouchTargetSize(deviceType)
      const deviceClasses = getDeviceClasses(deviceType)

      setState({
        deviceType,
        breakpoint,
        isTouch: touchDevice,
        isLandscape: landscape,
        gridColumns,
        touchTargetSize,
        deviceClasses,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      })
    }

    // Actualizar en cambios de viewport
    window.addEventListener('resize', updateResponsiveState)
    window.addEventListener('orientationchange', updateResponsiveState)

    // Limpiar listeners
    return () => {
      window.removeEventListener('resize', updateResponsiveState)
      window.removeEventListener('orientationchange', updateResponsiveState)
    }
  }, [])

  return state
}

/**
 * Hook específico para layouts adaptativos del POS
 */
export function usePOSLayout() {
  const responsive = useResponsive()

  // Configuraciones específicas para módulos del POS
  const layoutConfig = {
    // Configuración del carrito
    cart: {
      position: responsive.isMobile ? 'bottom-sheet' : 'sidebar',
      maxHeight: responsive.isMobile ? '60vh' : '80vh',
      collapsible: responsive.isMobile,
      stickyCheckout: responsive.isMobile
    },

    // Configuración de navegación
    navigation: {
      type: responsive.isMobile ? 'bottom-tabs' : 'top-tabs',
      showLabels: !responsive.isMobile || responsive.isLandscape,
      iconOnly: responsive.isMobile && !responsive.isLandscape
    },

    // Configuración de productos
    products: {
      gridColumns: responsive.gridColumns,
      cardVariant: responsive.isMobile ? 'compact' : 'default',
      showQuickActions: !responsive.isMobile,
      lazyLoadThreshold: responsive.isMobile ? 2 : 4
    },

    // Configuración de modales
    modals: {
      fullscreen: responsive.isMobile,
      backdrop: responsive.isMobile ? 'blur' : 'dark',
      closeOnOutsideClick: !responsive.isMobile
    },

    // Configuración de formularios
    forms: {
      layout: responsive.isMobile ? 'vertical' : 'grid',
      inputHeight: responsive.touchTargetSize,
      showLabels: 'always'
    }
  }

  return {
    ...responsive,
    layout: layoutConfig
  }
}

/**
 * Hook para componentes específicos de touch
 */
export function useTouchOptimization() {
  const { isTouch, touchTargetSize, isMobile } = useResponsive()

  return {
    // Tamaños mínimos para touch targets
    touchStyles: {
      minHeight: `${touchTargetSize}px`,
      minWidth: `${touchTargetSize}px`,
      padding: isMobile ? '12px' : '8px'
    },

    // Estados de interacción
    interactionStates: {
      hover: !isTouch,
      active: isTouch,
      focus: true
    },

    // Gestos habilitados
    gestures: {
      swipe: isTouch,
      longPress: isTouch,
      doubleClick: !isTouch,
      contextMenu: !isTouch
    },

    // Feedback háptico (solo móvil)
    hapticFeedback: isMobile && 'vibrate' in navigator
  }
}

/**
 * Hook para optimizaciones de rendimiento por dispositivo
 */
export function usePerformanceOptimization() {
  const { deviceType, isMobile } = useResponsive()

  return {
    // Configuración de lazy loading
    lazyLoading: {
      threshold: isMobile ? 1 : 2,
      rootMargin: isMobile ? '100px' : '200px'
    },

    // Configuración de animaciones
    animations: {
      reduce: isMobile && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      duration: isMobile ? 'fast' : 'normal',
      complexity: deviceType === 'mobile' ? 'simple' : 'complex'
    },

    // Configuración de imágenes
    images: {
      quality: isMobile ? 'medium' : 'high',
      format: 'webp',
      sizes: deviceType === 'mobile' ? 'small' : 'large'
    },

    // Bundle splitting
    bundleStrategy: {
      splitByRoute: true,
      preloadCritical: !isMobile,
      deferNonCritical: isMobile
    }
  }
}