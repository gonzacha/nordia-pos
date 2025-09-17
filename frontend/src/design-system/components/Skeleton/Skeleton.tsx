'use client';

/**
 * NORDIA POS - SKELETON COMPONENT
 * Loading states modernos y fluidos
 */

import React from 'react';
import { cn } from '@/design-system/utils/cn';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
}: SkeletonProps) => {
  const variants = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        // Base styles
        'bg-neutral-200',
        // Variant styles
        variants[variant],
        // Animation styles
        animations[animation],
        // Custom className
        className
      )}
      style={{
        width: width || (variant === 'text' ? '100%' : '100%'),
        height: height || (variant === 'text' ? '1rem' : '100%'),
      }}
    />
  );
};

// Skeletons preconfigurados para componentes comunes
export const SkeletonPresets = {
  // Skeleton para ProductCard
  ProductCard: ({ className }: { className?: string }) => (
    <div className={cn('p-4 space-y-3', className)}>
      <Skeleton variant="rounded" height="120px" />
      <div className="space-y-2">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),

  // Skeleton para CartItem
  CartItem: ({ className }: { className?: string }) => (
    <div className={cn('flex items-center space-x-3 p-3', className)}>
      <Skeleton variant="rounded" width="60px" height="60px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
      </div>
      <div className="space-y-1">
        <Skeleton variant="text" width="60px" />
        <Skeleton variant="text" width="40px" />
      </div>
    </div>
  ),

  // Skeleton para Tabla
  Table: ({ rows = 5, columns = 4, className }: {
    rows?: number;
    columns?: number;
    className?: string;
  }) => (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height="20px" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              height="16px"
              width={`${60 + Math.random() * 40}%`}
            />
          ))}
        </div>
      ))}
    </div>
  ),

  // Skeleton para Dashboard Stats
  StatCard: ({ className }: { className?: string }) => (
    <div className={cn('p-6 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="circular" width="40px" height="40px" />
      </div>
      <Skeleton variant="text" height="32px" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  ),

  // Skeleton para Lista de Productos
  ProductList: ({ count = 6, className }: {
    count?: number;
    className?: string;
  }) => (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPresets.ProductCard key={`product-${i}`} />
      ))}
    </div>
  ),

  // Skeleton para Header/Navigation
  Navigation: ({ className }: { className?: string }) => (
    <div className={cn('flex items-center justify-between p-4', className)}>
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width="40px" height="40px" />
        <Skeleton variant="text" width="120px" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton variant="rounded" width="80px" height="36px" />
        <Skeleton variant="rounded" width="80px" height="36px" />
        <Skeleton variant="circular" width="36px" height="36px" />
      </div>
    </div>
  ),

  // Skeleton para Modal/Dialog
  Modal: ({ className }: { className?: string }) => (
    <div className={cn('p-6 space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <Skeleton variant="text" width="40%" height="24px" />
        <Skeleton variant="circular" width="24px" height="24px" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="85%" />
        <Skeleton variant="text" width="75%" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton variant="text" width="25%" height="16px" />
          <Skeleton variant="rounded" height="44px" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" width="30%" height="16px" />
          <Skeleton variant="rounded" height="44px" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Skeleton variant="rounded" width="80px" height="40px" />
        <Skeleton variant="rounded" width="100px" height="40px" />
      </div>
    </div>
  ),

  // Skeleton para Loading completo de página
  FullPage: ({ className }: { className?: string }) => (
    <div className={cn('min-h-screen bg-neutral-50', className)}>
      {/* Navigation */}
      <SkeletonPresets.Navigation className="bg-white border-b border-neutral-200" />

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPresets.StatCard key={`stat-${i}`} className="bg-white rounded-xl" />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-6">
          <Skeleton variant="text" width="30%" height="24px" className="mb-4" />
          <SkeletonPresets.Table rows={8} columns={5} />
        </div>
      </div>
    </div>
  ),
};