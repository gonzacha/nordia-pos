/**
 * NORDIA POS - DESIGN SYSTEM COMPONENTS
 * Exportador principal de todos los componentes base
 */

// Core Components
export { Button } from './Button/Button';
export { Card, CardHeader, CardBody, CardFooter } from './Card/Card';
export { Input } from './Input/Input';
export { Badge, StatusBadge } from './Badge/Badge';

// Loading & Feedback Components
export { Skeleton, SkeletonPresets } from './Skeleton/Skeleton';
export { ToastProvider, showToast, useToast } from './Toast/Toast';

// Re-export design tokens para conveniencia
export { theme, colors, typography, spacing } from '../tokens';

// Re-export utilities
export { cn, createVariants } from '../utils/cn';
export { formatCurrency, formatDate, formatStock, formatTransactionId } from '../utils/formatters';

// Tipos comunes para TypeScript
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardVariant = 'default' | 'elevated' | 'bordered' | 'gradient' | 'glass';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'outline';
export type InputVariant = 'default' | 'filled' | 'outlined';
export type SkeletonVariant = 'text' | 'rectangular' | 'circular' | 'rounded';