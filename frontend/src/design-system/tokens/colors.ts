/**
 * NORDIA POS - DESIGN TOKENS: COLORS
 * Inspirado en las mejores fintech LATAM: Mercado Pago, Ualá, Clip
 */

export const colors = {
  // Marca principal - Inspirado en fintechs LATAM
  brand: {
    primary: '#5B3FFF',      // Violeta moderno (Ualá style)
    primaryDark: '#4A2FE5',
    primaryLight: '#7B5FFF',
    primaryBg: 'rgba(91, 63, 255, 0.08)',

    secondary: '#FF6B35',    // Naranja energético (Clip style)
    secondaryDark: '#E55A2B',
    secondaryLight: '#FF8B55',
    secondaryBg: 'rgba(255, 107, 53, 0.08)',

    accent: '#00D4FF',       // Cyan moderno
    success: '#00D26A',      // Verde venta
    warning: '#FFB800',      // Amarillo alerta
    danger: '#FF3B30',       // Rojo error
    info: '#007AFF',         // Azul info
  },

  // Escala de grises premium
  neutral: {
    0: '#FFFFFF',
    50: '#FAFBFC',
    100: '#F4F6F8',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
    1000: '#000000',
  },

  // Fondos contextuals
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FF',      // Hint de violeta
    tertiary: '#F0F2FF',       // Más violeta
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
  },

  // Semánticos
  semantic: {
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textWhite: '#FFFFFF',
    textInverse: '#FFFFFF',
    border: '#E5E7EB',
    borderFocus: '#5B3FFF',
    borderDanger: '#FF3B30',
    borderSuccess: '#00D26A',
  },

  // Estados de componentes
  state: {
    hover: 'rgba(91, 63, 255, 0.1)',
    active: 'rgba(91, 63, 255, 0.15)',
    disabled: 'rgba(0, 0, 0, 0.1)',
    focus: 'rgba(91, 63, 255, 0.2)',
  },

  // Gradientes premium
  gradients: {
    primary: 'linear-gradient(135deg, #5B3FFF 0%, #4A2FE5 100%)',
    secondary: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
    success: 'linear-gradient(135deg, #00D26A 0%, #00B85C 100%)',
    neutral: 'linear-gradient(135deg, #F8F9FF 0%, #F0F2FF 100%)',
    sunset: 'linear-gradient(135deg, #FF6B35 0%, #5B3FFF 100%)',
  }
} as const;

// Tipos para TypeScript
export type ColorKey = keyof typeof colors;
export type BrandColorKey = keyof typeof colors.brand;
export type NeutralColorKey = keyof typeof colors.neutral;
export type BackgroundColorKey = keyof typeof colors.background;
export type SemanticColorKey = keyof typeof colors.semantic;