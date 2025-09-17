/**
 * NORDIA POS - PRODUCTS COMPONENTS
 * Exportador principal de componentes de productos
 */

export { ProductCard } from './ProductCard';
export { ProductGrid } from './ProductGrid';
export { ProductSkeleton, ProductGridSkeleton } from './ProductSkeleton';

// Tipos compartidos
export interface Product {
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

export type ProductViewMode = 'grid' | 'list' | 'compact';