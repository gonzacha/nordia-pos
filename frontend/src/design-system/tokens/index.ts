/**
 * NORDIA POS - DESIGN TOKENS
 * Punto de entrada principal para todos los tokens del sistema de diseño
 */

export { colors, type ColorKey, type BrandColorKey, type NeutralColorKey } from './colors';
export { typography, textStyles, type TypographyKey, type TextStyleKey } from './typography';
export { spacing, componentSpacing, breakpoints, containers, zIndex, type SpacingKey } from './spacing';
export { shadows, elevation, focusRings, type ShadowKey, type ElevationKey } from './shadows';
export { animations, interactions, type AnimationKey, type PresetKey } from './animations';

// Theme principal que combina todos los tokens
export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  componentSpacing,
  breakpoints,
  containers,
  zIndex,
  shadows,
  elevation,
  focusRings,
  animations,
  interactions,
} as const;

export type Theme = typeof theme;