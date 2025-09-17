'use client';

/**
 * NORDIA POS - PRODUCT CARD PREMIUM
 * Componente estrella nivel Mercado Pago/Ualá
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertCircle, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/design-system/utils/cn';
import { Badge, StatusBadge } from '@/design-system/components';
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

  // Variante grid (default) - La estrella del show
  const hoverAnimation = !isTouch ? { y: -4, transition: { duration: 0.2 } } : undefined;
  const shimmerEnabled = !isTouch;
  const cardClassName = cn(
    'group relative rounded-2xl border border-neutral-100 bg-white shadow-soft transition-all duration-300 select-none overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
    isSelected && (isMobile ? 'border-brand bg-brand/5 ring-1 ring-brand/40' : 'ring-2 ring-brand shadow-medium'),
    isOutOfStock ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    isMobile ? 'p-3 touch-manipulation' : ''
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverAnimation}
      whileTap={{ scale: isTouch ? 0.97 : 0.98 }}
      className={cardClassName}
      onClick={handleAdd}
      role="button"
      tabIndex={isOutOfStock ? -1 : 0}
      aria-disabled={isOutOfStock}
      onKeyDown={handleKeyDown}
      style={{ touchAction: 'manipulation', willChange: 'transform' }}
    >
      {/* Header con imagen/gradiente */}
      <div
        className={cn(
          'relative bg-gradient-to-br overflow-hidden rounded-[18px]',
          isMobile ? 'aspect-square' : 'h-32',
          getCategoryColor()
        )}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover',
              !isTouch && 'transition-transform duration-300 group-hover:scale-110'
            )}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Badges de estado */}
        <div
          className={cn(
            'absolute top-2 right-2 flex flex-col gap-1',
            isMobile && 'top-2 left-2 right-auto items-start'
          )}
        >
          {isMobile ? (
            <>
              {product.trending && (
                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </span>
              )}
              {isLowStock && (
                <span className="flex items-center gap-1 rounded-full bg-warning/90 px-2 py-1 text-[11px] font-semibold text-neutral-900">
                  <AlertCircle className="w-3 h-3" />
                  Bajo stock
                </span>
              )}
              {!product.trending && !isLowStock && hasDiscount && (
                <span className="flex items-center gap-1 rounded-full bg-danger/90 px-2 py-1 text-[11px] font-semibold text-white">
                  -{product.discount}%
                </span>
              )}
            </>
          ) : (
            <>
              {product.trending && (
                <Badge variant="success" size="sm" className="animate-pulse">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              {isLowStock && (
                <Badge variant="warning" size="sm">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Bajo stock
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="danger" size="sm" className="font-bold">
                  -{product.discount}%
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Categoría */}
        {product.category && !isMobile && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-neutral-700">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className={cn('p-4', isMobile && 'p-3')}>
        <h3 className={cn(
          'font-semibold text-neutral-900 mb-2 line-clamp-1 transition-colors',
          !isTouch && 'group-hover:text-brand',
          isMobile && 'text-base mb-1'
        )}>
          {product.name}
        </h3>

        {/* Precio con descuento */}
        <div className={cn('flex items-end gap-2 mb-3', isMobile && 'mb-2')}>
          {hasDiscount ? (
            <>
              <span className={cn('font-bold text-brand', isMobile ? 'text-lg' : 'text-xl')}>
                {formatCurrency(product.price * (1 - product.discount! / 100))}
              </span>
              <span className="text-sm text-neutral-400 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className={cn('font-bold text-brand', isMobile ? 'text-lg' : 'text-xl')}>
              {formatCurrency(product.price)}
            </span>
          )}

          {hasDiscount && isMobile && (
            <span className="ml-auto rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Info adicional */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className={cn(
            'font-medium',
            isLowStock && 'text-warning',
            isOutOfStock && 'text-danger',
            isMobile && 'text-[11px]'
          )}>
            {stockText}
          </span>
          {!isMobile && product.barcode && (
            <span className="font-mono text-neutral-400">
              {product.barcode.slice(-6)}
            </span>
          )}
        </div>
      </div>

      {/* Botón flotante de acción */}
      {showQuickActions && (
        <motion.button
          type="button"
          style={{ width: addButtonSize, height: addButtonSize }}
          className={cn(
            'absolute bottom-3 right-3 flex items-center justify-center rounded-[16px] shadow-medium transition-all duration-200 touch-manipulation',
            isOutOfStock
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              : 'bg-brand text-white hover:bg-brand-dark',
            shimmerEnabled
              ? 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
              : 'opacity-100'
          )}
          whileHover={isTouch ? undefined : { scale: 1.05 }}
          whileTap={{ scale: isTouch ? 0.92 : 0.94 }}
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          disabled={isOutOfStock}
          aria-label="Agregar al carrito"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      )}

      {/* Overlay para productos sin stock */}
      {isOutOfStock && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl"
        >
          <div className="bg-white px-4 py-2 rounded-xl shadow-medium">
            <span className="font-semibold text-neutral-900">Sin Stock</span>
          </div>
        </motion.div>
      )}

      {/* Efecto shimmer sutil en hover (sólo desktop) */}
      {shimmerEnabled && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      )}
    </motion.div>
  );
};
