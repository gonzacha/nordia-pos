/**
 * NORDIA POS - DESIGN TOKENS: TYPOGRAPHY
 * Sistema tipográfico moderno y legible
 */

export const typography = {
  // Familias de fuentes
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Roboto Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },

  // Escala de tamaños
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
  },

  // Pesos de fuente
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Altura de línea
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Espaciado de letras
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Estilos de texto predefinidos
export const textStyles = {
  // Headlines
  h1: {
    fontSize: '3rem',         // 48px
    fontWeight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '2.25rem',      // 36px
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '1.875rem',     // 30px
    fontWeight: '600',
    lineHeight: '1.3',
  },
  h4: {
    fontSize: '1.5rem',       // 24px
    fontWeight: '600',
    lineHeight: '1.4',
  },
  h5: {
    fontSize: '1.25rem',      // 20px
    fontWeight: '600',
    lineHeight: '1.5',
  },
  h6: {
    fontSize: '1.125rem',     // 18px
    fontWeight: '600',
    lineHeight: '1.5',
  },

  // Body text
  body: {
    fontSize: '1rem',         // 16px
    fontWeight: '400',
    lineHeight: '1.5',
  },
  bodyLarge: {
    fontSize: '1.125rem',     // 18px
    fontWeight: '400',
    lineHeight: '1.6',
  },
  bodySmall: {
    fontSize: '0.875rem',     // 14px
    fontWeight: '400',
    lineHeight: '1.4',
  },

  // Labels y captions
  label: {
    fontSize: '0.875rem',     // 14px
    fontWeight: '500',
    lineHeight: '1.4',
  },
  caption: {
    fontSize: '0.75rem',      // 12px
    fontWeight: '400',
    lineHeight: '1.3',
  },
  overline: {
    fontSize: '0.75rem',      // 12px
    fontWeight: '600',
    lineHeight: '1.3',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },

  // Botones
  buttonLarge: {
    fontSize: '1rem',         // 16px
    fontWeight: '600',
    lineHeight: '1.5',
  },
  buttonMedium: {
    fontSize: '0.875rem',     // 14px
    fontWeight: '600',
    lineHeight: '1.4',
  },
  buttonSmall: {
    fontSize: '0.75rem',      // 12px
    fontWeight: '600',
    lineHeight: '1.3',
  },

  // Código
  code: {
    fontSize: '0.875rem',     // 14px
    fontWeight: '400',
    fontFamily: 'Roboto Mono, monospace',
    lineHeight: '1.4',
  },
  codeSmall: {
    fontSize: '0.75rem',      // 12px
    fontWeight: '400',
    fontFamily: 'Roboto Mono, monospace',
    lineHeight: '1.3',
  },
} as const;

// Tipos para TypeScript
export type TypographyKey = keyof typeof typography;
export type TextStyleKey = keyof typeof textStyles;