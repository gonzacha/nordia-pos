'use client';

/**
 * NORDIA POS - INPUT COMPONENT
 * Input moderno con validación, estados y accesibilidad
 */

import React, { forwardRef, useState } from 'react';
import { cn } from '@/design-system/utils/cn';
import { motion } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  icon,
  suffix,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  className,
  id,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const variants = {
    default: cn(
      'bg-white border-2 border-neutral-200',
      'focus:border-brand focus:ring-4 focus:ring-brand/10',
      error && 'border-danger focus:border-danger focus:ring-danger/10',
      success && 'border-success focus:border-success focus:ring-success/10'
    ),
    filled: cn(
      'bg-neutral-50 border-2 border-transparent',
      'focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10',
      error && 'bg-red-50 focus:border-danger focus:ring-danger/10',
      success && 'bg-green-50 focus:border-success focus:ring-success/10'
    ),
    outlined: cn(
      'bg-transparent border-2 border-neutral-300',
      'focus:border-brand focus:ring-4 focus:ring-brand/10',
      error && 'border-danger focus:border-danger focus:ring-danger/10',
      success && 'border-success focus:border-success focus:ring-success/10'
    ),
  };

  const sizes = {
    sm: cn(
      'px-3 py-2 text-sm min-h-[36px]',
      icon && 'pl-9',
      suffix && 'pr-9'
    ),
    md: cn(
      'px-4 py-3 text-base min-h-[44px]',
      icon && 'pl-10',
      suffix && 'pr-10'
    ),
    lg: cn(
      'px-5 py-4 text-lg min-h-[52px]',
      icon && 'pl-12',
      suffix && 'pr-12'
    ),
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconPositions = {
    sm: 'left-2.5',
    md: 'left-3',
    lg: 'left-4',
  };

  const suffixPositions = {
    sm: 'right-2.5',
    md: 'right-3',
    lg: 'right-4',
  };

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={inputId}
          initial={false}
          animate={{
            color: error ? '#FF3B30' :
                   success ? '#00D26A' :
                   isFocused ? '#5B3FFF' : '#6B7280'
          }}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            'cursor-pointer'
          )}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className={cn(
            'absolute top-1/2 -translate-y-1/2 z-10',
            'text-neutral-400 pointer-events-none',
            iconSizes[size],
            iconPositions[size],
            isFocused && 'text-brand',
            error && 'text-danger',
            success && 'text-success'
          )}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          id={inputId}
          initial={false}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            // Base styles
            'w-full rounded-xl transition-all duration-200',
            'focus:outline-none placeholder:text-neutral-400',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'disabled:bg-neutral-100',
            // Variant styles
            variants[variant],
            // Size styles
            sizes[size],
            // Custom className
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          disabled={disabled}
          required={required}
          {...props}
        />

        {/* Right Suffix */}
        {suffix && (
          <div className={cn(
            'absolute top-1/2 -translate-y-1/2 z-10',
            'text-neutral-400',
            suffixPositions[size]
          )}>
            {suffix}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="min-h-[1.25rem]">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-danger flex items-center"
          >
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}

        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-success flex items-center"
          >
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </motion.p>
        )}

        {hint && !error && !success && (
          <p className="text-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';