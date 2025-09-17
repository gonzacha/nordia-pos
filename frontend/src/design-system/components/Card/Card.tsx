'use client';

/**
 * NORDIA POS - CARD COMPONENT
 * Tarjeta premium con sistema de elevación y interactividad
 */

import React from 'react';
import { cn } from '@/design-system/utils/cn';
import { motion } from 'framer-motion';

interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  hover?: 'none' | 'lift' | 'scale' | 'glow';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export const Card = ({
  variant = 'default',
  padding = 'md',
  interactive = false,
  hover = interactive ? 'lift' : 'none',
  className,
  children,
  onClick,
  onDoubleClick,
}: CardProps) => {
  const variants = {
    default: cn(
      'bg-white shadow-soft border border-neutral-100'
    ),
    elevated: cn(
      'bg-white shadow-medium border border-neutral-100',
      'hover:shadow-large'
    ),
    bordered: cn(
      'bg-white border-2 border-neutral-200',
      'hover:border-neutral-300'
    ),
    gradient: cn(
      'bg-gradient-to-br from-brand via-brand-dark to-purple-700',
      'text-white shadow-medium'
    ),
    glass: cn(
      'bg-white/80 backdrop-blur-sm border border-white/20',
      'shadow-soft'
    ),
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverEffects = {
    none: {},
    lift: { y: -4 },
    scale: { scale: 1.02 },
    glow: { boxShadow: '0 0 20px rgba(91, 63, 255, 0.3)' },
  };

  const tapEffect = interactive ? { scale: 0.98 } : {};

  return (
    <motion.div
      whileHover={hover !== 'none' ? hoverEffects[hover] : {}}
      whileTap={tapEffect}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      className={cn(
        // Base styles
        'rounded-2xl transition-all duration-200',
        // Variant styles
        variants[variant],
        // Padding styles
        paddings[padding],
        // Interactive styles
        interactive && cn(
          'cursor-pointer select-none',
          'focus:outline-none focus:ring-4 focus:ring-brand/20'
        ),
        // Custom className
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
    >
      {children}
    </motion.div>
  );
};

// Subcomponentes para mejor composición
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={cn('pb-4 border-b border-neutral-100', className)}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={cn('py-4', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={cn('pt-4 border-t border-neutral-100', className)}>
    {children}
  </div>
);

// Export del card principal y subcomponentes
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;