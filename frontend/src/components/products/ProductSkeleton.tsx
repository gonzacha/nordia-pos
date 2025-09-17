'use client';

/**
 * NORDIA POS - PRODUCT SKELETON LOADER
 * Loading states para diferentes variantes de ProductCard
 */

import React from 'react';
import { cn } from '@/design-system/utils/cn';
import { Skeleton } from '@/design-system/components';

interface ProductSkeletonProps {
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}

export const ProductSkeleton = ({
  variant = 'grid',
  className,
}: ProductSkeletonProps) => {
  // Variante compacta
  if (variant === 'compact') {
    return (
      <div className={cn('p-3 bg-white rounded-xl border border-neutral-200', className)}>
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" height="14px" />
            <Skeleton variant="text" width="50%" height="16px" />
          </div>
          <Skeleton variant="circular" width="8px" height="8px" className="ml-2" />
        </div>
      </div>
    );
  }

  // Variante lista
  if (variant === 'list') {
    return (
      <div className={cn(
        'flex items-center p-4 bg-white rounded-xl border border-neutral-100 shadow-soft',
        className
      )}>
        {/* Imagen/Ícono skeleton */}
        <Skeleton variant="rounded" width="64px" height="64px" className="flex-shrink-0" />

        {/* Contenido */}
        <div className="flex-1 ml-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height="18px" />
              <div className="flex items-center gap-2">
                <Skeleton variant="rounded" width="60px" height="20px" />
                <Skeleton variant="rounded" width="80px" height="20px" />
              </div>
            </div>
            <div className="flex-shrink-0 ml-4 space-y-1 text-right">
              <Skeleton variant="text" width="80px" height="20px" />
              <Skeleton variant="text" width="60px" height="14px" />
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <Skeleton variant="circular" width="40px" height="40px" className="ml-4" />
      </div>
    );
  }

  // Variante grid (default) - La más detallada
  return (
    <div className={cn(
      'bg-white rounded-2xl overflow-hidden shadow-soft border border-neutral-100',
      className
    )}>
      {/* Header con gradiente */}
      <div className="relative h-32">
        <Skeleton
          variant="rectangular"
          height="128px"
          className="animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
        />

        {/* Badges skeleton */}
        <div className="absolute top-2 right-2 space-y-1">
          <Skeleton variant="rounded" width="60px" height="20px" />
        </div>

        {/* Categoría skeleton */}
        <div className="absolute bottom-2 left-2">
          <Skeleton variant="rounded" width="50px" height="24px" />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Título */}
        <Skeleton variant="text" width="80%" height="18px" />

        {/* Precio */}
        <div className="flex items-end gap-2">
          <Skeleton variant="text" width="60%" height="24px" />
          <Skeleton variant="text" width="40%" height="16px" />
        </div>

        {/* Info adicional */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="50%" height="12px" />
          <Skeleton variant="text" width="30%" height="12px" />
        </div>
      </div>

      {/* Botón flotante skeleton (simulando hover state) */}
      <div className="absolute bottom-3 right-3">
        <Skeleton variant="circular" width="44px" height="44px" />
      </div>
    </div>
  );
};

// Componente de grid skeleton completo
export const ProductGridSkeleton = ({
  count = 12,
  viewMode = 'grid',
  showHeader = true,
  className,
}: {
  count?: number;
  viewMode?: 'grid' | 'list' | 'compact';
  showHeader?: boolean;
  className?: string;
}) => {
  const gridClasses = {
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4',
    list: 'space-y-3',
    compact: 'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header skeleton */}
      {showHeader && (
        <div className="space-y-4">
          {/* Búsqueda skeleton */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton variant="rounded" height="44px" className="flex-1" />
            <div className="flex items-center gap-2">
              <Skeleton variant="rounded" width="120px" height="44px" />
              <Skeleton variant="rounded" width="80px" height="44px" />
            </div>
          </div>

          {/* Filtros skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width="16px" height="16px" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={`${60 + Math.random() * 40}px`}
                height="28px"
              />
            ))}
          </div>

          {/* Info resultados skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="200px" height="14px" />
            <Skeleton variant="text" width="150px" height="14px" />
          </div>
        </div>
      )}

      {/* Grid skeleton */}
      <div className={cn(gridClasses[viewMode])}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductSkeleton
            key={i}
            variant={viewMode}
            className="animate-pulse"
            style={{
              animationDelay: `${i * 50}ms`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>
    </div>
  );
};