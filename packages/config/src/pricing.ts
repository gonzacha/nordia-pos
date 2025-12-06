import { PricingPlan, PlanType } from "./types"

export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  FREE: {
    id: "FREE",
    name: "Freemium",
    price: 0,
    currency: "USD",
    features: [
      "30 facturas AFIP/mes",
      "1 usuario",
      "1 sucursal",
      "Ventas básicas",
      "Stock básico",
      "Reportes simples",
    ],
    limitations: ["Branding Nordia visible"],
  },
  START: {
    id: "START",
    name: "Start",
    price: 9.9,
    currency: "USD",
    features: [
      "Facturas ilimitadas AFIP",
      "3 usuarios",
      "1 sucursal",
      "Reportes básicos",
      "App móvil PWA",
      "Soporte email",
    ],
  },
  BUSINESS: {
    id: "BUSINESS",
    name: "Business",
    price: 24.9,
    currency: "USD",
    features: [
      "Facturas ilimitadas AFIP",
      "10 usuarios",
      "3 sucursales",
      "Reportes avanzados",
      "Alertas inteligentes",
      "Multi-sucursal",
      "Soporte prioritario",
    ],
  },
  INTELLIGENCE: {
    id: "INTELLIGENCE",
    name: "Intelligence",
    price: 49.9,
    currency: "USD",
    features: [
      "Todo de Business +",
      "Usuarios ilimitados",
      "Sucursales ilimitadas",
      "Heatmap comercial",
      "Predicción de demanda IA",
      "API access",
      "Integraciones avanzadas",
      "Soporte 24/7",
    ],
  },
}

export function getPricingPlan(planType: PlanType): PricingPlan {
  return PRICING_PLANS[planType]
}

export function getAllPricingPlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS)
}
