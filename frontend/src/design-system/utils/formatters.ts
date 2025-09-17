/**
 * NORDIA POS - UTILITY: FORMATTERS
 * Funciones de formateo para moneda, fechas, números, etc.
 */

import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea números como moneda argentina
 */
export const formatCurrency = (value: number | string, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '$0,00';

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true
  } = options || {};

  const formatted = new Intl.NumberFormat('es-AR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'ARS',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numValue);

  return formatted;
};

/**
 * Formatea números enteros con separadores de miles
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '0';

  return new Intl.NumberFormat('es-AR').format(numValue);
};

/**
 * Formatea fechas en formato argentino
 */
export const formatDate = (date: Date | string, pattern = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) return '';

    return format(dateObj, pattern, { locale: es });
  } catch {
    return '';
  }
};

/**
 * Formatea fecha y hora completa
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Formatea solo la hora
 */
export const formatTime = (date: Date | string): string => {
  return formatDate(date, 'HH:mm');
};

/**
 * Formatea fecha relativa (hace 2 horas, ayer, etc.)
 */
export const formatRelativeTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) return '';

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: es
    });
  } catch {
    return '';
  }
};

/**
 * Formatea porcentajes
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  if (isNaN(value)) return '0%';

  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Formatea códigos de barras para mostrar
 */
export const formatBarcode = (barcode: string): string => {
  if (!barcode) return '';

  // Agregar espacios cada 4 dígitos para legibilidad
  return barcode.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Formatea números de teléfono argentinos
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';

  const cleanPhone = phone.replace(/\D/g, '');

  // Formato: +54 9 11 1234-5678
  if (cleanPhone.length === 13 && cleanPhone.startsWith('549')) {
    return `+54 9 ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 9)}-${cleanPhone.slice(9)}`;
  }

  // Formato: 11 1234-5678
  if (cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }

  return phone;
};

/**
 * Formatea CUIT/CUIL argentino
 */
export const formatCuit = (cuit: string): string => {
  if (!cuit) return '';

  const cleanCuit = cuit.replace(/\D/g, '');

  if (cleanCuit.length === 11) {
    return `${cleanCuit.slice(0, 2)}-${cleanCuit.slice(2, 10)}-${cleanCuit.slice(10)}`;
  }

  return cuit;
};

/**
 * Trunca texto con ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + '…';
};

/**
 * Formatea tamaños de archivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Capitaliza primera letra de cada palabra
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Valida y formatea email
 */
export const formatEmail = (email: string): string => {
  if (!email) return '';

  return email.toLowerCase().trim();
};

/**
 * Formatea stock con unidades
 */
export const formatStock = (stock: number, unit = 'unidades'): string => {
  if (stock === 0) return 'Sin stock';
  if (stock === 1) return `1 ${unit.slice(0, -1)}`; // singular

  return `${formatNumber(stock)} ${unit}`;
};

/**
 * Formatea ID de venta/transacción
 */
export const formatTransactionId = (id: string | number): string => {
  const idStr = id.toString();
  return `#${idStr.padStart(6, '0')}`;
};