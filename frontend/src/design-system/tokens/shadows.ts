/**
 * NORDIA POS - DESIGN TOKENS: SHADOWS
 * Sistema de elevación y sombras premium
 */

export const shadows = {
  // Sombras base (elevación)
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Sombras internas
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  innerSm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  innerLg: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',

  // Sombras de marca (con color)
  brand: {
    sm: '0 1px 3px 0 rgba(91, 63, 255, 0.1), 0 1px 2px 0 rgba(91, 63, 255, 0.06)',
    md: '0 4px 6px -1px rgba(91, 63, 255, 0.1), 0 2px 4px -1px rgba(91, 63, 255, 0.06)',
    lg: '0 10px 15px -3px rgba(91, 63, 255, 0.1), 0 4px 6px -2px rgba(91, 63, 255, 0.05)',
    glow: '0 0 20px rgba(91, 63, 255, 0.3)',
    glowSoft: '0 0 40px rgba(91, 63, 255, 0.15)',
  },

  // Sombras de estado
  success: {
    sm: '0 1px 3px 0 rgba(0, 210, 106, 0.1), 0 1px 2px 0 rgba(0, 210, 106, 0.06)',
    glow: '0 0 20px rgba(0, 210, 106, 0.3)',
  },

  warning: {
    sm: '0 1px 3px 0 rgba(255, 184, 0, 0.1), 0 1px 2px 0 rgba(255, 184, 0, 0.06)',
    glow: '0 0 20px rgba(255, 184, 0, 0.3)',
  },

  danger: {
    sm: '0 1px 3px 0 rgba(255, 59, 48, 0.1), 0 1px 2px 0 rgba(255, 59, 48, 0.06)',
    glow: '0 0 20px rgba(255, 59, 48, 0.3)',
  },

  // Sombras especiales para componentes
  card: {
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    pressed: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },

  button: {
    default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    pressed: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  modal: {
    backdrop: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    content: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  dropdown: {
    default: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  toast: {
    default: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// Niveles de elevación semánticos
export const elevation = {
  0: shadows.none,
  1: shadows.xs,
  2: shadows.sm,
  3: shadows.md,
  4: shadows.lg,
  5: shadows.xl,
  6: shadows['2xl'],
} as const;

// Focus rings para accesibilidad
export const focusRings = {
  default: '0 0 0 3px rgba(91, 63, 255, 0.1)',
  danger: '0 0 0 3px rgba(255, 59, 48, 0.1)',
  success: '0 0 0 3px rgba(0, 210, 106, 0.1)',
  warning: '0 0 0 3px rgba(255, 184, 0, 0.1)',
} as const;

// Tipos para TypeScript
export type ShadowKey = keyof typeof shadows;
export type ElevationKey = keyof typeof elevation;
export type FocusRingKey = keyof typeof focusRings;