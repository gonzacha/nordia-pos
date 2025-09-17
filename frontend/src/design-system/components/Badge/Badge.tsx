'use client';

/**
 * NORDIA POS - BADGE COMPONENT
 * Indicadores de estado modernos con variantes semánticas
 */

import React from 'react';
import { cn } from '@/design-system/utils/cn';
import { motion } from 'framer-motion';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
}

export const Badge = ({
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  removable = false,
  icon,
  children,
  className,
  onRemove,
}: BadgeProps) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    info: 'bg-info/10 text-info border border-info/20',
    brand: 'bg-brand/10 text-brand border border-brand/20',
    outline: 'bg-transparent text-neutral-700 border-2 border-neutral-300',
  };

  const sizes = {
    sm: cn(
      'px-2 py-0.5 text-xs min-h-[20px]',
      'gap-1'
    ),
    md: cn(
      'px-2.5 py-1 text-sm min-h-[24px]',
      'gap-1.5'
    ),
    lg: cn(
      'px-3 py-1.5 text-base min-h-[28px]',
      'gap-2'
    ),
  };

  const dotColors = {
    default: 'bg-neutral-500',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    brand: 'bg-brand',
    outline: 'bg-neutral-500',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const DotIndicator = () => (
    <motion.span
      className={cn(
        'rounded-full flex-shrink-0',
        dotColors[variant],
        dotSizes[size]
      )}
      animate={pulse ? {
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: pulse ? Infinity : 0,
        ease: 'easeInOut'
      }}
    />
  );

  const RemoveButton = () => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onRemove?.();
      }}
      className={cn(
        'flex-shrink-0 rounded-full transition-colors',
        'hover:bg-black/10 focus:outline-none focus:bg-black/10',
        iconSizes[size]
      )}
      type="button"
      aria-label="Remover"
    >
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </motion.button>
  );

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        // Base styles
        'inline-flex items-center font-medium rounded-full',
        'transition-all duration-200',
        // Variant styles
        variants[variant],
        // Size styles
        sizes[size],
        // Custom className
        className
      )}
    >
      {/* Dot indicator */}
      {dot && <DotIndicator />}

      {/* Icon */}
      {icon && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {icon}
        </span>
      )}

      {/* Content */}
      <span className="flex-shrink-0">{children}</span>

      {/* Remove button */}
      {removable && <RemoveButton />}
    </motion.span>
  );
};

// Badge variants preconfigurados para casos comunes
export const StatusBadge = {
  Stock: ({ stock, className }: { stock: number; className?: string }) => (
    <Badge
      variant={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'danger'}
      size="sm"
      dot
      className={className}
    >
      {stock > 0 ? `${stock} unidades` : 'Sin stock'}
    </Badge>
  ),

  PaymentMethod: ({ method, className }: { method: string; className?: string }) => {
    const getVariant = (method: string) => {
      switch (method.toLowerCase()) {
        case 'efectivo': return 'success';
        case 'tarjeta': return 'info';
        case 'mercadopago': return 'brand';
        default: return 'default';
      }
    };

    const getIcon = (method: string) => {
      switch (method.toLowerCase()) {
        case 'efectivo': return '💵';
        case 'tarjeta': return '💳';
        case 'mercadopago': return '📱';
        default: return '💰';
      }
    };

    return (
      <Badge
        variant={getVariant(method)}
        size="sm"
        icon={<span>{getIcon(method)}</span>}
        className={className}
      >
        {method}
      </Badge>
    );
  },

  Category: ({ category, removable, onRemove, className }: {
    category: string;
    removable?: boolean;
    onRemove?: () => void;
    className?: string;
  }) => (
    <Badge
      variant="outline"
      size="sm"
      removable={removable}
      onRemove={onRemove}
      className={className}
    >
      {category}
    </Badge>
  ),

  NewFeature: ({ className }: { className?: string }) => (
    <Badge
      variant="brand"
      size="sm"
      pulse
      className={className}
    >
      ¡Nuevo!
    </Badge>
  ),
};