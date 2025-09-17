/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/design-system/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colores del sistema de diseño
      colors: {
        brand: {
          DEFAULT: '#5B3FFF',
          dark: '#4A2FE5',
          light: '#7B5FFF',
          bg: 'rgba(91, 63, 255, 0.08)',
        },
        secondary: {
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
          light: '#FF8B55',
          bg: 'rgba(255, 107, 53, 0.08)',
        },
        accent: '#00D4FF',
        success: {
          DEFAULT: '#00D26A',
          dark: '#00B85C',
        },
        warning: '#FFB800',
        danger: '#FF3B30',
        info: '#007AFF',

        // Neutrals
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

        // Backgrounds
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F9FF',
          tertiary: '#F0F2FF',
          elevated: '#FFFFFF',
        },

        // Semantic
        text: {
          primary: '#1A1A2E',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          white: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          focus: '#5B3FFF',
          danger: '#FF3B30',
          success: '#00D26A',
        },
      },

      // Typography
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      // Animations
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },

      // Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },

      // Box shadows
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'glow': '0 0 20px rgba(91, 63, 255, 0.3)',
        'glow-soft': '0 0 40px rgba(91, 63, 255, 0.15)',
        'focus-ring': '0 0 0 3px rgba(91, 63, 255, 0.1)',
      },

      // Spacing (8pt grid + touch-friendly)
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },

      // Z-index
      zIndex: {
        'hide': '-1',
        'dropdown': '1000',
        'sticky': '1100',
        'banner': '1200',
        'overlay': '1300',
        'modal': '1400',
        'popover': '1500',
        'toast': '1700',
        'tooltip': '1800',
      },

      // Transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}