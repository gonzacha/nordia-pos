/**
 * Decodificador de códigos de barras para balanzas electrónicas
 * Compatible con formato Kretz (estándar argentino)
 */

/**
 * Resultado de escaneo de balanza con precio embebido
 */
export interface BalanceScanResult {
  type: 'balance-price'
  plu: string          // PLU del producto (5 dígitos, ej: "00001")
  priceTotal: number   // Precio total ya calculado (peso × precio/kg)
}

/**
 * Resultado de escaneo de balanza con peso embebido
 */
export interface BalanceWeightScanResult {
  type: 'balance-weight'
  plu: string          // PLU del producto (5 dígitos)
  weight: number       // Peso en kg
}

/**
 * Resultado de escaneo de producto normal (código de barras estándar)
 */
export interface ProductScanResult {
  type: 'product'
  barcode: string
}

export type ScanResult = BalanceScanResult | BalanceWeightScanResult | ProductScanResult

/**
 * Decodifica un código de barras y determina su tipo
 *
 * Formato Kretz con precio embebido (prefijo 22):
 * - Formato: 22 + PLU(5) + PRECIO(5) + CHECK(1)
 * - Ejemplo: 2200001118250 = PLU 00001, Precio $1,182.50
 *
 * Formato Kretz con peso embebido (prefijo 21):
 * - Formato: 21 + PLU(5) + PESO(5) + CHECK(1)
 * - Ejemplo: 2100001021500 = PLU 00001, Peso 2.150kg
 *
 * @param barcode - Código de barras escaneado
 * @returns Resultado del escaneo con tipo y datos decodificados
 */
export function decodeBarcode(barcode: string): ScanResult {
  // Limpiar espacios en blanco
  const cleanBarcode = barcode.trim()

  // Código de balanza con PRECIO embebido (prefijo 22)
  if (cleanBarcode.startsWith('22') && cleanBarcode.length === 13) {
    const plu = cleanBarcode.substring(2, 7)
    const priceRaw = parseInt(cleanBarcode.substring(7, 12))

    return {
      type: 'balance-price',
      plu,
      priceTotal: priceRaw / 100  // Convertir centavos a pesos (11825 → $118.25)
    }
  }

  // Código de balanza con PESO embebido (prefijo 21)
  if (cleanBarcode.startsWith('21') && cleanBarcode.length === 13) {
    const plu = cleanBarcode.substring(2, 7)
    const weightGrams = parseInt(cleanBarcode.substring(7, 12))

    return {
      type: 'balance-weight',
      plu,
      weight: weightGrams / 1000  // Convertir gramos a kg (2150 → 2.15kg)
    }
  }

  // Código de producto normal (EAN-13, EAN-8, UPC, etc.)
  return {
    type: 'product',
    barcode: cleanBarcode
  }
}

/**
 * Valida si un PLU tiene el formato correcto (5 dígitos numéricos)
 */
export function isValidPlu(plu: string): boolean {
  return /^\d{5}$/.test(plu)
}

/**
 * Formatea un PLU agregando ceros a la izquierda si es necesario
 */
export function formatPlu(plu: string | number): string {
  return String(plu).padStart(5, '0')
}

/**
 * Genera un código de barras de balanza con precio embebido (para testing)
 */
export function generateBalanceBarcodeWithPrice(plu: string, priceTotal: number): string {
  const pluFormatted = formatPlu(plu)
  const priceInCents = Math.round(priceTotal * 100)
  const priceStr = String(priceInCents).padStart(5, '0')

  // Dígito verificador simple (suma módulo 10)
  const partial = `22${pluFormatted}${priceStr}`
  const checkDigit = calculateCheckDigit(partial)

  return `${partial}${checkDigit}`
}

/**
 * Calcula dígito verificador módulo 10 (algoritmo simplificado)
 */
function calculateCheckDigit(barcode: string): number {
  let sum = 0
  for (let i = 0; i < barcode.length; i++) {
    const digit = parseInt(barcode[i])
    sum += (i % 2 === 0) ? digit * 3 : digit
  }
  return (10 - (sum % 10)) % 10
}
