'use client';

/**
 * NORDIA POS - PRODUCT CARD PREMIUM
 * Componente estrella nivel Mercado Pago/Ualá
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertCircle, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/design-system/utils/cn';
import { Badge, Button, StatusBadge } from '@/design-system/components';
import { formatCurrency } from '@/design-system/utils/formatters';
import { useResponsive } from '@/hooks/useResponsive';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  barcode?: string;
  lastSold?: Date;
  trending?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  variant?: 'grid' | 'list' | 'compact';
  isSelected?: boolean;
  showQuickActions?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  variant = 'grid',
  isSelected = false,
  showQuickActions = true,
}: ProductCardProps) => {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.discount && product.discount > 0;
  const { isMobile, touchTargetSize, isTouch } = useResponsive();
  const addButtonSize = Math.max(touchTargetSize, 56);

  const triggerHapticFeedback = React.useCallback(() => {
    if (!isMobile || typeof window === 'undefined') return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(16);
    }
  }, [isMobile]);

  const handleAdd = React.useCallback(() => {
    if (isOutOfStock) return;
    triggerHapticFeedback();
    onAddToCart(product);
  }, [isOutOfStock, onAddToCart, product, triggerHapticFeedback]);

  const stockText = isOutOfStock
    ? 'Sin stock'
    : isMobile
    ? `Stock ${product.stock}`
    : `Stock: ${product.stock} ${product.stock === 1 ? 'unidad' : 'unidades'}`;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isOutOfStock) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAdd();
    }
  };

  // Colores dinámicos por categoría (inspirado en Mercado Pago)
  const categoryColors = {
    'Bebidas': 'from-blue-500 to-blue-600',
    'Comidas': 'from-orange-500 to-orange-600',
    'Panadería': 'from-yellow-500 to-yellow-600',
    'Limpieza': 'from-green-500 to-green-600',
    'Cigarrillos': 'from-gray-500 to-gray-600',
    'Golosinas': 'from-pink-500 to-pink-600',
    'default': 'from-brand to-brand-dark',
  };

  const getCategoryColor = () =>
    categoryColors[product.category as keyof typeof categoryColors] || categoryColors.default;

  // Variante compacta para pantallas pequeñas
  if (variant === 'compact') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: isTouch ? 0.97 : 0.95 }}
        whileHover={isTouch ? undefined : { scale: 1.02 }}
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={cn(
          'relative p-3 rounded-xl border-2 transition-all duration-200 select-none',
          'bg-white focus:ring-4 focus:ring-brand/20 touch-manipulation',
          isTouch ? 'active:shadow-medium' : 'hover:shadow-medium',
          isSelected ? 'border-brand bg-brand/5 shadow-soft' : 'border-neutral-200',
          isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'focus:border-brand',
        )}
      >
        <div className="flex items-center justify-between">
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium text-sm text-neutral-900 truncate">
              {product.name}
            </div>
            <div className="font-bold text-brand mt-0.5">
              {formatCurrency(product.price)}
            </div>
          </div>

          {(isLowStock || product.trending) && (
            <div className="flex-shrink-0 ml-2">
              {product.trending && (
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              )}
              {isLowStock && (
                <div className="w-2 h-2 bg-warning rounded-full" />
              )}
            </div>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
            <span className="text-xs font-medium text-neutral-600">Sin Stock</span>
          </div>
        )}
      </motion.button>
    );
  }

  // Variante lista para vista horizontal
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={isTouch ? undefined : { x: 4 }}
        className={cn(
          'group flex items-center p-4 bg-white rounded-xl',
          'shadow-soft hover:shadow-medium transition-all duration-200',
          'border border-neutral-100 hover:border-brand/30',
          isSelected && 'ring-2 ring-brand bg-brand/5'
        )}
      >
        {/* Imagen/Ícono */}
        <div className={cn(
          'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0',
          'bg-gradient-to-br', getCategoryColor()
        )}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-8 h-8 text-white/60" />
            </div>
          )}

          {product.trending && (
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 ml-4 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-neutral-900 truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge.Category category={product.category || 'General'} />
                <StatusBadge.Stock stock={product.stock} />
              </div>
            </div>

            <div className="flex-shrink-0 text-right ml-4">
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="text-lg font-bold text-brand">
                    {formatCurrency(product.price * (1 - product.discount! / 100))}
                  </div>
                  <div className="text-sm text-neutral-400 line-through">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              ) : (
                <div className="text-lg font-bold text-brand">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        {showQuickActions && (
          <motion.button
            type="button"
            style={{ width: addButtonSize, height: addButtonSize }}
            aria-label="Agregar al carrito"
            whileHover={isTouch ? undefined : { scale: 1.05 }}
            whileTap={{ scale: isTouch ? 0.94 : 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            disabled={isOutOfStock}
            className={cn(
              'ml-4 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation select-none',
              'shadow-soft',
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-brand text-white hover:bg-brand-dark'
            )}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Variante grid (default)
  const hoverAnimation = !isTouch ? { y: -4, transition: { duration: 0.18 } } : undefined;

  const priceBlock = hasDiscount ? (
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-semibold text-brand">
        {formatCurrency(product.price * (1 - product.discount! / 100))}
      </span>
      <span className="text-xs text-neutral-400 line-through">
        {formatCurrency(product.price)}
      </span>
    </div>
  ) : (
    <span className="text-lg font-semibold text-brand">
      {formatCurrency(product.price)}
    </span>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: isMobile ? 8 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverAnimation}
      whileTap={{ scale: isTouch ? 0.97 : 0.99 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
        isSelected && 'border-brand shadow-medium',
        isOutOfStock ? 'opacity-60' : 'hover:shadow-soft'
      )}
      onClick={handleAdd}
      role="button"
      tabIndex={isOutOfStock ? -1 : 0}
      aria-disabled={isOutOfStock}
      onKeyDown={handleKeyDown}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
            <Package className="h-10 w-10 text-white/70" />
          </div>
        )}

        <div className="absolute inset-x-2 top-2 flex flex-wrap gap-1 text-xs">
          {product.trending && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-white backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" />Popular
            </span>
          )}
          {isLowStock && (
            <span className="flex items-center gap-1 rounded-full bg-warning px-2 py-1 text-neutral-900">
              <AlertCircle className="h-3 w-3" />Bajo stock
            </span>
          )}
          {hasDiscount && !isLowStock && !product.trending && (
            <span className="rounded-full bg-danger px-2 py-1 text-white">-{product.discount}%</span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/60 text-sm font-medium text-white">
            Sin stock
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {product.category}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {priceBlock}
          {hasDiscount && isMobile && (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
              Ahorro {product.discount}%
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
          <span className={cn('font-medium', isLowStock && 'text-warning', isOutOfStock && 'text-danger')}>
            {stockText}
          </span>
          {!isMobile && product.barcode && (
            <span className="font-mono text-neutral-400">{product.barcode.slice(-6)}</span>
          )}
        </div>

        {showQuickActions && (
          <Button
            type="button"
            size="sm"
            disabled={isOutOfStock}
            onClick={(event) => {
              event.stopPropagation();
              handleAdd();
            }}
            className="mt-1 w-full justify-center rounded-xl py-2 text-sm font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        )}
      </div>
    </motion.article>
  );

};
