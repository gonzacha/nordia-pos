/**
 * DEVICE DETECTION & RESPONSIVE UTILITIES
 * Mobile-first responsive system for Nordia POS
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Mobile-first breakpoints optimized for POS usage
export const BREAKPOINTS = {
  xs: 0,     // 375px+ (mobile portrait)
  sm: 640,   // 640px+ (mobile landscape)
  md: 768,   // 768px+ (tablet portrait)
  lg: 1024,  // 1024px+ (tablet landscape)
  xl: 1280,  // 1280px+ (desktop)
} as const

// Critical device profiles for POS vendors
export const DEVICE_PROFILES = {
  mobile: {
    maxWidth: 767,
    touchOptimized: true,
    minTouchTarget: 44,
    preferredOrientation: 'portrait',
    features: ['camera', 'vibration', 'geolocation'],
    limitations: ['small-screen', 'limited-multitasking']
  },
  tablet: {
    minWidth: 768,
    maxWidth: 1023,
    touchOptimized: true,
    minTouchTarget: 44,
    preferredOrientation: 'landscape',
    features: ['camera', 'vibration', 'geolocation', 'split-view'],
    limitations: ['touch-only']
  },
  desktop: {
    minWidth: 1024,
    touchOptimized: false,
    minTouchTarget: 24,
    preferredOrientation: 'landscape',
    features: ['mouse', 'keyboard', 'multi-window'],
    limitations: []
  }
} as const

/**
 * Detect current device type based on viewport
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'mobile' // SSR default

  const width = window.innerWidth

  if (width < DEVICE_PROFILES.tablet.minWidth) {
    return 'mobile'
  } else if (width <= DEVICE_PROFILES.tablet.maxWidth) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

/**
 * Get current breakpoint size
 */
export function getBreakpointSize(): BreakpointSize {
  if (typeof window === 'undefined') return 'xs'

  const width = window.innerWidth

  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * Check if current device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true // Assume touch for SSR

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Check if device is in landscape orientation
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return false

  return window.innerWidth > window.innerHeight
}

/**
 * Get optimal grid columns for current device
 */
export function getOptimalGridColumns(deviceType?: DeviceType): number {
  const device = deviceType || getDeviceType()

  switch (device) {
    case 'mobile':
      return isLandscape() ? 3 : 2
    case 'tablet':
      return isLandscape() ? 4 : 3
    case 'desktop':
      return 6
    default:
      return 2
  }
}

/**
 * Get touch target size for current device
 */
export function getTouchTargetSize(deviceType?: DeviceType): number {
  const device = deviceType || getDeviceType()
  return DEVICE_PROFILES[device].minTouchTarget
}

/**
 * Check if device supports specific features
 */
export function supportsFeature(feature: string, deviceType?: DeviceType): boolean {
  const device = deviceType || getDeviceType()
  return DEVICE_PROFILES[device].features.includes(feature as any)
}

/**
 * Get device-specific CSS classes
 */
export function getDeviceClasses(deviceType?: DeviceType): string {
  const device = deviceType || getDeviceType()
  const isTouch = isTouchDevice()
  const landscape = isLandscape()

  return [
    `device-${device}`,
    isTouch ? 'touch-device' : 'no-touch',
    landscape ? 'landscape' : 'portrait'
  ].join(' ')
}

/**
 * Media query helpers for CSS-in-JS
 */
export const mediaQueries = {
  mobile: `(max-width: ${DEVICE_PROFILES.tablet.minWidth - 1}px)`,
  tablet: `(min-width: ${DEVICE_PROFILES.tablet.minWidth}px) and (max-width: ${DEVICE_PROFILES.tablet.maxWidth}px)`,
  desktop: `(min-width: ${DEVICE_PROFILES.desktop.minWidth}px)`,

  // Touch-specific queries
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',

  // Orientation queries
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',

  // High DPI displays (common on mobile)
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
} as const

/**
 * Responsive hook for React components
 */
export function useResponsive() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'mobile' as DeviceType,
      breakpoint: 'xs' as BreakpointSize,
      isTouch: true,
      isLandscape: false,
      gridColumns: 2,
      touchTargetSize: 44
    }
  }

  const deviceType = getDeviceType()
  const breakpoint = getBreakpointSize()
  const isTouch = isTouchDevice()
  const isLandscapeMode = isLandscape()
  const gridColumns = getOptimalGridColumns(deviceType)
  const touchTargetSize = getTouchTargetSize(deviceType)

  return {
    deviceType,
    breakpoint,
    isTouch,
    isLandscape: isLandscapeMode,
    gridColumns,
    touchTargetSize
  }
}