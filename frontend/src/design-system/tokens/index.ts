/**
 * NORDIA POS - DESIGN TOKENS
 * Punto de entrada principal para todos los tokens del sistema de diseño
 */

import { colors } from './colors';
import type { ColorKey, BrandColorKey, NeutralColorKey } from './colors';
import { typography, textStyles } from './typography';
import type { TypographyKey, TextStyleKey } from './typography';
import { spacing, componentSpacing, breakpoints, containers, zIndex } from './spacing';
import type { SpacingKey } from './spacing';
import { shadows, elevation, focusRings } from './shadows';
import type { ShadowKey, ElevationKey } from './shadows';
import { animations, interactions } from './animations';
import type { AnimationKey, PresetKey } from './animations';

export {
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
};

export type {
  ColorKey,
  BrandColorKey,
  NeutralColorKey,
  TypographyKey,
  TextStyleKey,
  SpacingKey,
  ShadowKey,
  ElevationKey,
  AnimationKey,
  PresetKey,
};

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
