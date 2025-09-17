/**
 * NORDIA POS - DESIGN TOKENS: ANIMATIONS
 * Sistema de animaciones fluidas y naturales
 */

export const animations = {
  // Duración de transiciones
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Curvas de easing
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Animaciones predefinidas
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideUp: {
      '0%': {
        opacity: '0',
        transform: 'translateY(10px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateY(0)'
      },
    },
    slideDown: {
      '0%': {
        opacity: '0',
        transform: 'translateY(-10px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateY(0)'
      },
    },
    slideLeft: {
      '0%': {
        opacity: '0',
        transform: 'translateX(10px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateX(0)'
      },
    },
    slideRight: {
      '0%': {
        opacity: '0',
        transform: 'translateX(-10px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateX(0)'
      },
    },
    scaleIn: {
      '0%': {
        opacity: '0',
        transform: 'scale(0.95)'
      },
      '100%': {
        opacity: '1',
        transform: 'scale(1)'
      },
    },
    scaleOut: {
      '0%': {
        opacity: '1',
        transform: 'scale(1)'
      },
      '100%': {
        opacity: '0',
        transform: 'scale(0.95)'
      },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    pulseSoft: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.8' },
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    bounce: {
      '0%, 100%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
      },
      '50%': {
        transform: 'translateY(0)',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(-3deg)' },
      '50%': { transform: 'rotate(3deg)' },
    },
    shimmer: {
      '0%': {
        transform: 'translateX(-100%)'
      },
      '100%': {
        transform: 'translateX(100%)'
      },
    },
  },

  // Animaciones completas listas para usar
  presets: {
    fadeIn: {
      animation: 'fadeIn 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
    fadeOut: {
      animation: 'fadeOut 150ms cubic-bezier(0.4, 0, 1, 1)',
    },
    slideUp: {
      animation: 'slideUp 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
    slideDown: {
      animation: 'slideDown 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
    scaleIn: {
      animation: 'scaleIn 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    pulse: {
      animation: 'pulseSoft 2s infinite',
    },
    spin: {
      animation: 'spin 1s linear infinite',
    },
    bounce: {
      animation: 'bounce 1s infinite',
    },
    wiggle: {
      animation: 'wiggle 1s ease-in-out infinite',
    },
  },

  // Transiciones específicas por propiedad
  transitions: {
    colors: {
      fast: 'color 150ms cubic-bezier(0, 0, 0.2, 1), background-color 150ms cubic-bezier(0, 0, 0.2, 1), border-color 150ms cubic-bezier(0, 0, 0.2, 1)',
      normal: 'color 250ms cubic-bezier(0, 0, 0.2, 1), background-color 250ms cubic-bezier(0, 0, 0.2, 1), border-color 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
    transform: {
      fast: 'transform 150ms cubic-bezier(0, 0, 0.2, 1)',
      normal: 'transform 250ms cubic-bezier(0, 0, 0.2, 1)',
      spring: 'transform 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    opacity: {
      fast: 'opacity 150ms cubic-bezier(0, 0, 0.2, 1)',
      normal: 'opacity 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
    shadow: {
      fast: 'box-shadow 150ms cubic-bezier(0, 0, 0.2, 1)',
      normal: 'box-shadow 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
    all: {
      fast: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
      normal: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
    },
  },
} as const;

// Estados de hover/focus predefinidos
export const interactions = {
  hover: {
    scale: 'transform: scale(1.02)',
    lift: 'transform: translateY(-2px)',
    glow: 'box-shadow: 0 0 20px rgba(91, 63, 255, 0.3)',
  },
  focus: {
    ring: 'box-shadow: 0 0 0 3px rgba(91, 63, 255, 0.1)',
    glow: 'box-shadow: 0 0 0 3px rgba(91, 63, 255, 0.1), 0 0 20px rgba(91, 63, 255, 0.2)',
  },
  active: {
    scale: 'transform: scale(0.98)',
    press: 'transform: translateY(1px)',
  },
} as const;

// Tipos para TypeScript
export type AnimationKey = keyof typeof animations;
export type PresetKey = keyof typeof animations.presets;
export type TransitionKey = keyof typeof animations.transitions;