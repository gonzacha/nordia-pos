/**
 * NORDIA POS - DESIGN TOKENS: SPACING
 * Sistema de espaciado 8pt grid + variaciones táctiles
 */

export const spacing = {
  // Base 8pt grid system
  0: '0px',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Espaciado semántico para componentes
export const componentSpacing = {
  // Padding interno de componentes
  padding: {
    xs: spacing[1],     // 4px
    sm: spacing[2],     // 8px
    md: spacing[3],     // 12px
    lg: spacing[4],     // 16px
    xl: spacing[6],     // 24px
    '2xl': spacing[8],  // 32px
  },

  // Márgenes entre elementos
  margin: {
    xs: spacing[1],     // 4px
    sm: spacing[2],     // 8px
    md: spacing[4],     // 16px
    lg: spacing[6],     // 24px
    xl: spacing[8],     // 32px
    '2xl': spacing[12], // 48px
  },

  // Gaps en layouts
  gap: {
    xs: spacing[1],     // 4px
    sm: spacing[2],     // 8px
    md: spacing[3],     // 12px
    lg: spacing[4],     // 16px
    xl: spacing[6],     // 24px
    '2xl': spacing[8],  // 32px
  },

  // Espaciado específico para touch interfaces
  touch: {
    minTarget: spacing[11],  // 44px (mínimo recomendado)
    comfortable: spacing[12], // 48px (cómodo)
    spacious: spacing[14],   // 56px (espacioso)
  },
} as const;

// Breakpoints responsive
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Container max widths
export const containers = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Tipos para TypeScript
export type SpacingKey = keyof typeof spacing;
export type ComponentSpacingKey = keyof typeof componentSpacing;
export type BreakpointKey = keyof typeof breakpoints;