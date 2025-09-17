/**
 * NORDIA POS - UTILITY: CLASSNAME MERGER
 * Combina y optimiza clases de Tailwind CSS evitando conflictos
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Función utilitaria para combinar y optimizar clases CSS
 * Usa clsx para manejar condicionales y twMerge para evitar conflictos
 *
 * @param inputs - Array de valores de clase (strings, objetos, arrays, etc.)
 * @returns String de clases CSS optimizado
 *
 * @example
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4' (elimina conflicto px-2)
 * cn('bg-red-500', condition && 'bg-blue-500') // Condicional
 * cn(['flex', 'items-center'], { 'bg-gray-100': isActive }) // Mixed types
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utilidad para crear variantes de componentes
 * Facilita la creación de sistemas de variantes consistentes
 *
 * @param base - Clases base del componente
 * @param variants - Objeto con variantes y sus clases
 * @param defaultVariants - Variantes por defecto
 * @returns Función que acepta props y devuelve clases combinadas
 *
 * @example
 * const buttonVariants = createVariants({
 *   base: 'px-4 py-2 rounded font-medium transition-colors',
 *   variants: {
 *     variant: {
 *       primary: 'bg-brand text-white hover:bg-brand-dark',
 *       secondary: 'bg-secondary text-white hover:bg-secondary-dark',
 *       outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white'
 *     },
 *     size: {
 *       sm: 'px-3 py-1.5 text-sm',
 *       md: 'px-4 py-2 text-base',
 *       lg: 'px-6 py-3 text-lg'
 *     }
 *   },
 *   defaultVariants: {
 *     variant: 'primary',
 *     size: 'md'
 *   }
 * });
 *
 * buttonVariants({ variant: 'outline', size: 'lg' })
 */
export function createVariants<T extends Record<string, Record<string, string>>>({
  base,
  variants,
  defaultVariants,
}: {
  base: string;
  variants: T;
  defaultVariants?: Partial<{
    [K in keyof T]: keyof T[K];
  }>;
}) {
  return (props?: Partial<{
    [K in keyof T]: keyof T[K];
  }> & { className?: string }) => {
    const { className, ...variantProps } = props || {};

    // Combinar variantes por defecto con las proporcionadas
    const resolvedVariants = { ...defaultVariants, ...variantProps };

    // Generar clases para cada variante
    const variantClasses = Object.entries(resolvedVariants)
      .map(([key, value]) => {
        const variantGroup = variants[key as keyof T];
        return variantGroup?.[value as keyof typeof variantGroup] || '';
      })
      .filter(Boolean);

    return cn(base, ...variantClasses, className);
  };
}