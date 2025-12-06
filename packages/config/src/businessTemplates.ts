import { BusinessTemplate, BusinessType } from "./types"

export const BUSINESS_TEMPLATES: Record<BusinessType, BusinessTemplate> = {
  BUTCHER: {
    id: "BUTCHER",
    name: "Carnicería",
    icon: "🥩",
    description: "Control de cortes, mermas y combos rentables",
    color: "from-red-500 to-red-600",
    defaultStoreName: "Mi Carnicería",
    categories: [
      { name: "Cortes Vacunos", icon: "🥩" },
      { name: "Cortes Cerdo", icon: "🐷" },
      { name: "Pollo", icon: "🐔" },
      { name: "Achuras", icon: "🫀" },
      { name: "Bebidas", icon: "🥤" },
    ],
    products: [
      { name: "Asado", plu: "00001", categoryName: "Cortes Vacunos", unit: "kg", price: 5500, cost: 4200, trackStock: true },
      { name: "Vacío", plu: "00002", categoryName: "Cortes Vacunos", unit: "kg", price: 6200, cost: 4800, trackStock: true },
      { name: "Nalga", plu: "00003", categoryName: "Cortes Vacunos", unit: "kg", price: 5800, cost: 4400, trackStock: true },
      { name: "Cuadril", plu: "00004", categoryName: "Cortes Vacunos", unit: "kg", price: 6500, cost: 5000, trackStock: true },
      { name: "Lomo", plu: "00005", categoryName: "Cortes Vacunos", unit: "kg", price: 8500, cost: 6800, trackStock: true },
      { name: "Paleta", plu: "00006", categoryName: "Cortes Cerdo", unit: "kg", price: 4200, cost: 3200, trackStock: true },
      { name: "Bondiola", plu: "00007", categoryName: "Cortes Cerdo", unit: "kg", price: 4800, cost: 3600, trackStock: true },
      { name: "Pollo Entero", plu: "00008", categoryName: "Pollo", unit: "kg", price: 2800, cost: 2200, trackStock: true },
      { name: "Pechuga", plu: "00009", categoryName: "Pollo", unit: "kg", price: 3500, cost: 2800, trackStock: true },
      { name: "Mollejas", plu: "00010", categoryName: "Achuras", unit: "kg", price: 3200, cost: 2500, trackStock: true },
      { name: "Chinchulines", plu: "00011", categoryName: "Achuras", unit: "kg", price: 2800, cost: 2200, trackStock: true },
      // Bebidas (productos por unidad)
      { name: "Coca Cola 500ml", plu: "00020", barcode: "7790895000010", categoryName: "Bebidas", unit: "unit", price: 1500, cost: 1100, trackStock: true },
      { name: "Agua Mineral 500ml", plu: "00021", barcode: "7790895000027", categoryName: "Bebidas", unit: "unit", price: 800, cost: 600, trackStock: true },
      { name: "Fernet 750ml", plu: "00022", barcode: "7790895000034", categoryName: "Bebidas", unit: "unit", price: 8500, cost: 6500, trackStock: true },
      { name: "Cerveza Quilmes 1L", plu: "00023", barcode: "7790895000041", categoryName: "Bebidas", unit: "unit", price: 2200, cost: 1600, trackStock: true },
    ],
  },

  GREENGROCER: {
    id: "GREENGROCER",
    name: "Verdulería",
    icon: "🥬",
    description: "Productos por peso y rotación diaria",
    color: "from-green-500 to-green-600",
    defaultStoreName: "Mi Verdulería",
    categories: [
      { name: "Verduras", icon: "🥬" },
      { name: "Frutas", icon: "🍎" },
      { name: "Hortalizas", icon: "🥕" },
    ],
    products: [
      { name: "Tomate", plu: "00101", categoryName: "Verduras", unit: "kg", price: 800, cost: 500, trackStock: true },
      { name: "Papa", plu: "00102", categoryName: "Verduras", unit: "kg", price: 600, cost: 400, trackStock: true },
      { name: "Cebolla", plu: "00103", categoryName: "Verduras", unit: "kg", price: 500, cost: 350, trackStock: true },
      { name: "Lechuga", plu: "00104", categoryName: "Verduras", unit: "unit", price: 400, cost: 250, trackStock: true },
      { name: "Manzana", plu: "00105", categoryName: "Frutas", unit: "kg", price: 900, cost: 600, trackStock: true },
      { name: "Banana", plu: "00106", categoryName: "Frutas", unit: "kg", price: 700, cost: 450, trackStock: true },
      { name: "Naranja", plu: "00107", categoryName: "Frutas", unit: "kg", price: 650, cost: 450, trackStock: true },
      { name: "Zanahoria", plu: "00108", categoryName: "Hortalizas", unit: "kg", price: 550, cost: 350, trackStock: true },
      { name: "Zapallito", plu: "00109", categoryName: "Hortalizas", unit: "kg", price: 750, cost: 500, trackStock: true },
    ],
  },

  BAKERY: {
    id: "BAKERY",
    name: "Panadería",
    icon: "🍞",
    description: "Producción diaria y venta de panificados",
    color: "from-amber-500 to-amber-600",
    defaultStoreName: "Mi Panadería",
    categories: [
      { name: "Pan", icon: "🍞" },
      { name: "Facturas", icon: "🥐" },
      { name: "Tortas", icon: "🎂" },
    ],
    products: [
      { name: "Pan Francés", plu: "00201", categoryName: "Pan", unit: "kg", price: 1200, cost: 700, trackStock: true },
      { name: "Pan Mignon", plu: "00202", categoryName: "Pan", unit: "unit", price: 1800, cost: 1100, trackStock: true },
      { name: "Medialunas", plu: "00203", categoryName: "Facturas", unit: "unit", price: 2500, cost: 1500, trackStock: true },
      { name: "Vigilantes", plu: "00204", categoryName: "Facturas", unit: "unit", price: 350, cost: 200, trackStock: true },
      { name: "Torta Chocolate", plu: "00205", categoryName: "Tortas", unit: "unit", price: 8500, cost: 5000, trackStock: false },
    ],
  },

  MINIMARKET: {
    id: "MINIMARKET",
    name: "Despensa",
    icon: "🛒",
    description: "Almacén de barrio con productos variados",
    color: "from-blue-500 to-blue-600",
    defaultStoreName: "Mi Despensa",
    categories: [
      { name: "Almacén", icon: "📦" },
      { name: "Bebidas", icon: "🥤" },
      { name: "Lácteos", icon: "🥛" },
    ],
    products: [
      { name: "Coca Cola 2.25L", plu: "00301", categoryName: "Bebidas", unit: "unit", price: 1800, cost: 1300, trackStock: true },
      { name: "Leche Sachet 1L", plu: "00302", categoryName: "Lácteos", unit: "unit", price: 850, cost: 650, trackStock: true },
      { name: "Pan Lactal", plu: "00303", categoryName: "Almacén", unit: "unit", price: 1200, cost: 850, trackStock: true },
      { name: "Arroz 1kg", plu: "00304", categoryName: "Almacén", unit: "unit", price: 1100, cost: 800, trackStock: true },
      { name: "Fideos 500g", plu: "00305", categoryName: "Almacén", unit: "unit", price: 950, cost: 650, trackStock: true },
      { name: "Yogur", plu: "00306", categoryName: "Lácteos", unit: "unit", price: 750, cost: 550, trackStock: true },
    ],
  },

  COSMETICS: {
    id: "COSMETICS",
    name: "Cosmética",
    icon: "💄",
    description: "Productos de belleza y cuidado personal",
    color: "from-pink-500 to-pink-600",
    defaultStoreName: "Mi Cosmética",
    categories: [
      { name: "Maquillaje", icon: "💄" },
      { name: "Cuidado Personal", icon: "🧴" },
      { name: "Perfumería", icon: "💐" },
    ],
    products: [
      { name: "Labial", plu: "00401", categoryName: "Maquillaje", unit: "unit", price: 4500, cost: 2800, trackStock: true },
      { name: "Crema Facial", plu: "00402", categoryName: "Cuidado Personal", unit: "unit", price: 6500, cost: 4200, trackStock: true },
      { name: "Perfume 100ml", plu: "00403", categoryName: "Perfumería", unit: "unit", price: 15000, cost: 10000, trackStock: true },
    ],
  },

  TOYSHOP: {
    id: "TOYSHOP",
    name: "Juguetería",
    icon: "🎮",
    description: "Juguetes y entretenimiento infantil",
    color: "from-purple-500 to-purple-600",
    defaultStoreName: "Mi Juguetería",
    categories: [
      { name: "Juguetes", icon: "🧸" },
      { name: "Juegos", icon: "🎲" },
      { name: "Electrónicos", icon: "🎮" },
    ],
    products: [
      { name: "Muñeca", plu: "00501", categoryName: "Juguetes", unit: "unit", price: 8500, cost: 5500, trackStock: true },
      { name: "Auto a Control", plu: "00502", categoryName: "Juguetes", unit: "unit", price: 12000, cost: 8000, trackStock: true },
      { name: "Rompecabezas", plu: "00503", categoryName: "Juegos", unit: "unit", price: 4500, cost: 2800, trackStock: true },
    ],
  },

  KIOSK: {
    id: "KIOSK",
    name: "Kiosco",
    icon: "🍬",
    description: "Golosinas, cigarrillos y snacks",
    color: "from-yellow-500 to-yellow-600",
    defaultStoreName: "Mi Kiosco",
    categories: [
      { name: "Golosinas", icon: "🍬" },
      { name: "Bebidas", icon: "🥤" },
      { name: "Cigarrillos", icon: "🚬" },
    ],
    products: [
      { name: "Alfajor", plu: "00601", categoryName: "Golosinas", unit: "unit", price: 500, cost: 350, trackStock: true },
      { name: "Chocolatín", plu: "00602", categoryName: "Golosinas", unit: "unit", price: 450, cost: 300, trackStock: true },
      { name: "Gaseosa 500ml", plu: "00603", categoryName: "Bebidas", unit: "unit", price: 900, cost: 650, trackStock: true },
    ],
  },

  PETSHOP: {
    id: "PETSHOP",
    name: "Petshop",
    icon: "🐾",
    description: "Alimentos y accesorios para mascotas",
    color: "from-orange-500 to-orange-600",
    defaultStoreName: "Mi Petshop",
    categories: [
      { name: "Alimento Perros", icon: "🐕" },
      { name: "Alimento Gatos", icon: "🐈" },
      { name: "Accesorios", icon: "🦴" },
    ],
    products: [
      { name: "Alimento Perro 15kg", plu: "00701", categoryName: "Alimento Perros", unit: "unit", price: 25000, cost: 18000, trackStock: true },
      { name: "Alimento Gato 7.5kg", plu: "00702", categoryName: "Alimento Gatos", unit: "unit", price: 18000, cost: 13000, trackStock: true },
      { name: "Correa", plu: "00703", categoryName: "Accesorios", unit: "unit", price: 3500, cost: 2200, trackStock: true },
    ],
  },

  OTHER: {
    id: "OTHER",
    name: "Otro Rubro",
    icon: "⚙️",
    description: "Personaliza tu negocio desde cero",
    color: "from-gray-500 to-gray-600",
    defaultStoreName: "Mi Negocio",
    categories: [
      { name: "General", icon: "📦" },
    ],
    products: [
      { name: "Producto 1", plu: "00801", categoryName: "General", unit: "unit", price: 1000, cost: 700, trackStock: true },
      { name: "Producto 2", plu: "00802", categoryName: "General", unit: "unit", price: 1500, cost: 1000, trackStock: true },
    ],
  },
}

export function loadBusinessTemplate(type: BusinessType): BusinessTemplate {
  return BUSINESS_TEMPLATES[type]
}

export function getAllBusinessTemplates(): BusinessTemplate[] {
  return Object.values(BUSINESS_TEMPLATES)
}
