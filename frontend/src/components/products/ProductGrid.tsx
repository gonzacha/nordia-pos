'use client';

/**
 * NORDIA POS - PRODUCT GRID CONTAINER
 * Grid inteligente con múltiples modos de vista
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, MoreHorizontal, Search, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/design-system/utils/cn';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { Button, Input, Badge } from '@/design-system/components';

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

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  viewMode?: 'grid' | 'list' | 'compact';
  selectedCategory?: string;
  loading?: boolean;
  searchQuery?: string;
  onViewModeChange?: (mode: 'grid' | 'list' | 'compact') => void;
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  showHeader?: boolean;
  showSearch?: boolean;
  className?: string;
}

export const ProductGrid = ({
  products,
  onAddToCart,
  viewMode = 'grid',
  selectedCategory,
  loading = false,
  searchQuery = '',
  onViewModeChange,
  onSearchChange,
  onCategoryChange,
  showHeader = true,
  showSearch = true,
  className,
}: ProductGridProps) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'trending'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['Todas', ...cats];
  }, [products]);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filtro por categoría
    if (selectedCategory && selectedCategory !== 'Todas' && selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filtro por búsqueda
    const searchTerm = onSearchChange ? searchQuery : internalSearchQuery;
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm)
      );
    }

    // Ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'trending':
          comparison = (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [products, selectedCategory, searchQuery, internalSearchQuery, sortBy, sortOrder, onSearchChange]);

  // Configuración de grids por modo
  const gridClasses = {
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4',
    list: 'space-y-3',
    compact: 'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2',
  };

  const handleSearchChange = (value: string) => {
    setInternalSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleSort = () => {
    if (sortBy === 'name') {
      setSortBy('price');
    } else if (sortBy === 'price') {
      setSortBy('stock');
    } else if (sortBy === 'stock') {
      setSortBy('trending');
    } else {
      setSortBy('name');
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {showHeader && (
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-200 rounded-xl mb-4" />
            <div className="flex gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-neutral-200 rounded-lg" />
              ))}
            </div>
          </div>
        )}
        <div className={cn(gridClasses[viewMode])}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductSkeleton key={i} variant={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header con controles */}
      {showHeader && (
        <div className="space-y-4">
          {/* Búsqueda */}
          {showSearch && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar productos, categorías o códigos..."
                  value={onSearchChange ? searchQuery : internalSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  variant="filled"
                />
              </div>

              {/* Controles de vista */}
              <div className="flex items-center gap-2">
                {onViewModeChange && (
                  <div className="flex rounded-lg border border-neutral-200 bg-white p-1">
                    <button
                      onClick={() => onViewModeChange('grid')}
                      className={cn(
                        'p-2 rounded transition-colors',
                        viewMode === 'grid'
                          ? 'bg-brand text-white'
                          : 'text-neutral-600 hover:text-brand'
                      )}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewModeChange('list')}
                      className={cn(
                        'p-2 rounded transition-colors',
                        viewMode === 'list'
                          ? 'bg-brand text-white'
                          : 'text-neutral-600 hover:text-brand'
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewModeChange('compact')}
                      className={cn(
                        'p-2 rounded transition-colors',
                        viewMode === 'compact'
                          ? 'bg-brand text-white'
                          : 'text-neutral-600 hover:text-brand'
                      )}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSort}
                  icon={<SortAsc className="w-4 h-4" />}
                  className="whitespace-nowrap"
                >
                  {sortBy === 'name' && 'Nombre'}
                  {sortBy === 'price' && 'Precio'}
                  {sortBy === 'stock' && 'Stock'}
                  {sortBy === 'trending' && 'Popular'}
                </Button>
              </div>
            </div>
          )}

          {/* Filtros de categoría */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category || (category === 'Todas' && !selectedCategory) ? 'brand' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all whitespace-nowrap',
                  'hover:scale-105 active:scale-95'
                )}
                onClick={() => {
                  const newCategory = category === 'Todas' ? '' : category || '';
                  onCategoryChange?.(newCategory);
                }}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Información de resultados */}
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>
              {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              {selectedCategory && selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
              {(onSearchChange ? searchQuery : internalSearchQuery) && ` para "${onSearchChange ? searchQuery : internalSearchQuery}"`}
            </span>
            <span>
              Stock total: {filteredAndSortedProducts.reduce((acc, p) => acc + p.stock, 0)} unidades
            </span>
          </div>
        </div>
      )}

      {/* Grid de productos */}
      <AnimatePresence mode="wait">
        {filteredAndSortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-neutral-600">
              {(onSearchChange ? searchQuery : internalSearchQuery)
                ? 'Intenta con otros términos de búsqueda'
                : 'No hay productos en esta categoría'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={cn(gridClasses[viewMode])}
          >
            <AnimatePresence>
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    delay: Math.min(index * 0.05, 0.3),
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    variant={viewMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};