'use client';

/**
 * NORDIA POS - BUTTON COMPONENT
 * Botón premium con animaciones fluidas y variantes fintech
 */

import React from 'react';
import { cn } from '@/design-system/utils/cn';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled = false,
  onClick,
  type,
  form,
  name,
  value,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'data-testid': dataTestId,
  id,
  ...motionProps
}: ButtonProps) => {
  const variants = {
    primary: cn(
      'bg-brand text-white shadow-soft',
      'hover:bg-brand-dark hover:shadow-medium hover:-translate-y-0.5',
      'active:translate-y-0 active:shadow-soft',
      'focus:ring-4 focus:ring-brand/20'
    ),
    secondary: cn(
      'bg-secondary text-white shadow-soft',
      'hover:bg-secondary-dark hover:shadow-medium hover:-translate-y-0.5',
      'active:translate-y-0 active:shadow-soft',
      'focus:ring-4 focus:ring-secondary/20'
    ),
    success: cn(
      'bg-success text-white shadow-soft',
      'hover:bg-success-dark hover:shadow-medium hover:-translate-y-0.5',
      'active:translate-y-0 active:shadow-soft',
      'focus:ring-4 focus:ring-success/20'
    ),
    danger: cn(
      'bg-danger text-white shadow-soft',
      'hover:bg-red-600 hover:shadow-medium hover:-translate-y-0.5',
      'active:translate-y-0 active:shadow-soft',
      'focus:ring-4 focus:ring-danger/20'
    ),
    ghost: cn(
      'bg-transparent text-brand',
      'hover:bg-brand/10 hover:text-brand-dark',
      'active:bg-brand/15',
      'focus:ring-4 focus:ring-brand/20'
    ),
    outline: cn(
      'bg-transparent text-brand border-2 border-brand',
      'hover:bg-brand hover:text-white hover:shadow-soft hover:-translate-y-0.5',
      'active:translate-y-0',
      'focus:ring-4 focus:ring-brand/20'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
    xl: 'px-8 py-4 text-xl min-h-[60px]',
  };

  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center',
        'font-semibold rounded-xl transition-all duration-200',
        'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        'disabled:transform-none disabled:shadow-none',
        // Variant styles
        variants[variant],
        // Size styles
        sizes[size],
        // Full width
        fullWidth && 'w-full',
        // Custom className
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      form={form}
      name={name}
      value={value}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      data-testid={dataTestId}
      id={id}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2 opacity-70">Procesando...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && iconPosition === 'left' && (
            <span className="mr-2 flex-shrink-0">{icon}</span>
          )}

          <span className="flex-1">{children}</span>

          {icon && iconPosition === 'right' && (
            <span className="ml-2 flex-shrink-0">{icon}</span>
          )}
        </div>
      )}
    </motion.button>
  );
};