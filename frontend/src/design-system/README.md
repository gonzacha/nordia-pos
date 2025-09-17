# 🎨 Sistema de Diseño - Nordia POS

## 📖 Filosofía

Combinar la **confianza de un banco** con la **innovación de una fintech**. Nuestro sistema de diseño está inspirado en las mejores prácticas de las fintech LATAM líderes: Mercado Pago, Ualá, Clip.

## 🎯 Principios de Diseño

### 1. **Claridad sobre Decoración**
- Información siempre visible y legible
- Jerarquía visual clara
- Contenido prioritario destacado

### 2. **Velocidad sobre Complejidad**
- Mínimos clics para completar tareas
- Flujos directos y predecibles
- Interfaces optimizadas para eficiencia

### 3. **Feedback Inmediato**
- Confirmación visual instantánea
- Estados de carga claros
- Errores descriptivos y accionables

### 4. **Flexibilidad Contextual**
- Adaptable a diferentes dispositivos
- Escalable según volumen de datos
- Personalizable por tipo de usuario

### 5. **Accesibilidad Total**
- WCAG 2.1 AA compliant
- Navegación por teclado
- Contraste y legibilidad optimizados

## 🎨 Paleta de Colores

### Colores Principales
```css
/* Violeta moderno (inspirado en Ualá) */
--brand-primary: #5B3FFF;
--brand-primary-dark: #4A2FE5;
--brand-primary-light: #7B5FFF;

/* Naranja energético (inspirado en Clip) */
--secondary: #FF6B35;
--secondary-dark: #E55A2B;
--secondary-light: #FF8B55;

/* Cyan moderno */
--accent: #00D4FF;
```

### Colores Semánticos
```css
--success: #00D26A;    /* Verde venta */
--warning: #FFB800;    /* Amarillo alerta */
--danger: #FF3B30;     /* Rojo error */
--info: #007AFF;       /* Azul información */
```

### Escala de Grises
Sistema neutral de 11 niveles (0-1000) optimizado para interfaces modernas.

## ✏️ Tipografía

### Jerarquía de Fuentes
- **Principal**: Inter (clean, legible, moderna)
- **Monospace**: Roboto Mono (códigos, datos numéricos)
- **Display**: Inter (títulos grandes)

### Escalas de Texto
| Tamaño | Uso | Ejemplo |
|--------|-----|---------|
| `text-6xl` | Heroes, landing | Nordia POS |
| `text-4xl` | Títulos principales | Dashboard |
| `text-2xl` | Títulos sección | Productos |
| `text-xl` | Subtítulos | Categoría: Bebidas |
| `text-base` | Texto normal | Descripción producto |
| `text-sm` | Labels, captions | Stock: 25 unidades |
| `text-xs` | Metadatos | Última actualización |

## 📐 Espaciado

### Sistema 8pt Grid
Base matemática que garantiza consistencia visual y alineación perfecta.

```css
/* Espaciado base */
1 = 4px    2 = 8px     3 = 12px    4 = 16px
5 = 20px   6 = 24px    8 = 32px    12 = 48px
```

### Espaciado Táctil
- **Mínimo**: 44px (requerimiento iOS/Android)
- **Cómodo**: 48px (recomendado para botones principales)
- **Espacioso**: 56px (ideal para acciones críticas)

## 🌊 Animaciones

### Curvas de Easing
```css
/* Naturales y suaves */
ease-out: cubic-bezier(0, 0, 0.2, 1)      /* Entradas */
ease-in: cubic-bezier(0.4, 0, 1, 1)       /* Salidas */
spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)  /* Bounce */
```

### Duraciones
- **Fast**: 150ms (hover, focus)
- **Normal**: 250ms (transiciones generales)
- **Slow**: 350ms (modales, overlays)

### Animaciones Predefinidas
```css
animate-fade-in     /* Aparición suave */
animate-slide-up    /* Entrada desde abajo */
animate-scale-in    /* Zoom suave */
animate-pulse-soft  /* Respiración sutil */
animate-shimmer     /* Efecto loading */
```

## 💫 Sombras y Elevación

### Niveles de Elevación
```css
shadow-soft    /* Cards en reposo */
shadow-medium  /* Cards en hover */
shadow-large   /* Modales, dropdowns */
shadow-glow    /* Estados de focus con color */
```

### Focus States
Sistema de anillos de enfoque para navegación por teclado:
```css
focus-ring     /* Anillo violeta para elementos interactivos */
```

## 🧩 Componentes Base

### Button
5 variantes principales:
- **Primary**: Acciones principales (Cobrar, Guardar)
- **Secondary**: Acciones secundarias (Cancelar)
- **Outline**: Acciones alternativas (Editar)
- **Danger**: Acciones destructivas (Eliminar)
- **Ghost**: Acciones sutiles (Ver más)

### Card
4 estilos contextuales:
- **Default**: Contenido general
- **Elevated**: Información destacada
- **Interactive**: Clickeable/hoverable
- **Outlined**: Bordes definidos

### Input
Estados completos:
- **Default**: Estado normal
- **Focus**: Con anillo de enfoque
- **Error**: Con mensaje de error
- **Success**: Validación exitosa
- **Disabled**: No interactivo

### Badge
Indicadores de estado:
- **Default**: Información general
- **Success**: Estados positivos
- **Warning**: Alertas
- **Danger**: Errores/críticos
- **Info**: Datos contextuales

## 🛠️ Utilidades

### className Merger (cn)
```typescript
import { cn } from '@/design-system/utils/cn';

// Combina y optimiza clases Tailwind
cn('px-2 py-1', 'px-4') // → 'py-1 px-4'

// Maneja condicionales
cn('bg-white', isActive && 'bg-brand')

// Evita conflictos automáticamente
cn('text-sm font-bold', 'text-lg') // → 'font-bold text-lg'
```

### Formatters
```typescript
import { formatCurrency, formatDate, formatStock } from '@/design-system/utils/formatters';

formatCurrency(1500)           // → "$1.500,00"
formatDate(new Date())         // → "16/09/2025"
formatStock(0)                 // → "Sin stock"
formatStock(25)                // → "25 unidades"
```

## 🚀 Uso Práctico

### Importación de Tokens
```typescript
import { colors, spacing, textStyles } from '@/design-system/tokens';

// Acceso a valores específicos
const primaryColor = colors.brand.primary;  // #5B3FFF
const cardPadding = spacing[4];              // 1rem
const titleStyle = textStyles.h2;           // objeto con font settings
```

### Clases Tailwind Extendidas
```html
<!-- Colores de marca -->
<div class="bg-brand text-white">Botón principal</div>
<div class="bg-secondary hover:bg-secondary-dark">Acción secundaria</div>

<!-- Sombras premium -->
<div class="shadow-soft hover:shadow-medium">Card interactivo</div>

<!-- Animaciones suaves -->
<div class="animate-fade-in">Contenido que aparece</div>
<div class="transition-all duration-250 ease-out">Hover suave</div>

<!-- Focus ring para accesibilidad -->
<button class="focus:shadow-focus-ring">Botón accesible</button>
```

## 📚 Ejemplos de Componentes

### ProductCard Premium
```typescript
<div className={cn(
  'bg-white rounded-xl shadow-soft hover:shadow-medium',
  'p-6 transition-all duration-250',
  'border border-neutral-200 hover:border-brand-light'
)}>
  <h3 className="text-lg font-semibold text-text-primary">
    {product.name}
  </h3>
  <p className="text-2xl font-bold text-brand">
    {formatCurrency(product.price)}
  </p>
  <span className="text-sm text-text-muted">
    {formatStock(product.stock)}
  </span>
</div>
```

### Button con Variants
```typescript
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => (
  <button
    className={cn(
      'font-medium rounded-lg transition-all duration-150',
      {
        'bg-brand text-white hover:bg-brand-dark': variant === 'primary',
        'bg-secondary text-white hover:bg-secondary-dark': variant === 'secondary',
        'border-2 border-brand text-brand hover:bg-brand hover:text-white': variant === 'outline',
      },
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      }
    )}
    {...props}
  >
    {children}
  </button>
);
```

## 🔄 Próximos Pasos

1. **Componentes Base** → Button, Input, Card, Badge completos
2. **Componentes Business** → ProductCard, CartSidebar, PaymentSelector
3. **Módulos Especializados** → Modernización F3, F8, F11
4. **Modo Oscuro** → Theme switching
5. **Documentación Interactiva** → Storybook/componentes vivos

---

## 📞 Soporte

- **Backup disponible**: `npm run restore-backup 20250916`
- **Tokens reference**: `/src/design-system/tokens/`
- **Utilidades**: `/src/design-system/utils/`

---

**🎨 Design System v1.0** - Preparado para transformación UI nivel fintech premium