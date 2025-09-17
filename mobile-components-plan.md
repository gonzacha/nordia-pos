# 📱 PLAN DE COMPONENTES MOBILE - NORDIA POS

## 🏗️ NUEVA ARQUITECTURA MOBILE-FIRST

### Bottom Navigation Architecture
```typescript
interface MobileNavigation {
  tipo: "bottom-tabs-floating",
  posicion: "sticky bottom safe-area",
  altura: "64px + safe-area-inset-bottom",
  vistas: [
    {
      id: "products",
      nombre: "Productos",
      icono: "Package",
      shortcut: "F1",
      contenido: "Grid 2x2 touch-optimized",
      gestos: ["tap para agregar", "long-press para detalles"],
      navegacion: "stack-based con categorías"
    },
    {
      id: "cart",
      nombre: "Carrito",
      icono: "ShoppingBag",
      badge: "items.length",
      contenido: "Lista con swipe actions + sticky total",
      gestos: ["swipe left eliminar", "tap +/- cantidad", "pull up checkout"],
      checkout: "bottom sheet full-height"
    },
    {
      id: "scanner",
      nombre: "Scanner",
      icono: "Camera",
      contenido: "Fullscreen camera con overlay",
      gestos: ["tap screen para enfocar", "flash toggle", "gallery pick"],
      hardware: "volume buttons para captura"
    },
    {
      id: "more",
      nombre: "Más",
      icono: "Menu",
      contenido: "Stock, Caja, Configuración",
      navegacion: "bottom sheet con opciones",
      accesos: ["F3 Stock", "F8 Caja", "Settings"]
    }
  ],
  flujoOptimo: "productos -> tap add -> carrito badge -> checkout en 3 taps"
}
```

### Stack Navigation Flow
```typescript
const navegacionStack = {
  productos: {
    principal: "ProductGridMobile",
    filtros: "CategoryBottomSheet", // swipe up desde productos
    busqueda: "SearchOverlay", // tap search FAB
    detalles: "ProductDetailSheet" // long press en card
  },
  carrito: {
    principal: "CartListMobile",
    checkout: "CheckoutBottomSheet", // pull up gesture
    pago: "PaymentMethodsSheet",
    confirmacion: "SuccessOverlay"
  },
  scanner: {
    principal: "FullscreenCamera",
    manual: "ManualBarcodeInput", // si camera falla
    resultado: "ScanResultToast"
  },
  mas: {
    principal: "MoreOptionsSheet",
    stock: "StockManagerMobile",
    caja: "CashRegisterMobile",
    config: "SettingsMobile"
  }
};
```

## 📦 COMPONENTES NUEVOS NECESARIOS

### 1. Layout & Navigation

#### **MobileLayout**
```typescript
interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  cartItems: number;
  isOnline: boolean;
}

const MobileLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Status Bar */}
      <StatusBar total={total} isOnline={isOnline} />

      {/* Safe Area Content */}
      <main className="flex-1 overflow-hidden pb-safe">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        cartBadge={cartItems}
        onTabChange={onTabChange}
      />
    </div>
  );
};
```

#### **BottomNavigation**
```typescript
const BottomNavigation = ({ activeTab, cartBadge, onTabChange }) => (
  <nav className="bg-white border-t border-neutral-200 pb-safe">
    <div className="flex items-center justify-around h-16">
      {tabs.map((tab) => (
        <TouchableTab
          key={tab.id}
          tab={tab}
          active={activeTab === tab.id}
          badge={tab.id === 'cart' ? cartBadge : undefined}
          onPress={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  </nav>
);
```

### 2. Product Components Mobile

#### **ProductCardMobile**
```typescript
interface ProductCardMobileProps {
  product: Product;
  onAdd: (product: Product) => void;
  onDetails: (product: Product) => void;
  variant?: 'default' | 'compact';
}

const ProductCardMobile = ({ product, onAdd, onDetails, variant = 'default' }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={() => onAdd(product)}
      onLongPress={() => onDetails(product)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.card,
        isPressed && styles.cardPressed
      ]}
    >
      {/* Image/Category gradient - 60% height */}
      <div className="h-32 bg-gradient-to-br from-brand to-brand-dark rounded-t-xl">
        {product.image ? (
          <Image src={product.image} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-8 h-8 text-white/60" />
          </div>
        )}

        {/* Floating status badges */}
        <div className="absolute top-2 right-2">
          {product.stock <= 5 && (
            <Badge variant="warning" size="sm">{product.stock}</Badge>
          )}
        </div>
      </div>

      {/* Content - 40% height, touch optimized */}
      <div className="p-3 flex-1">
        <h3 className="text-base font-semibold text-neutral-900 mb-1 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brand">
            {formatCurrency(product.price)}
          </span>

          {/* Touch feedback add button - 40x40px minimum */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onAdd(product);
              HapticFeedback.impact();
            }}
            className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5 text-white" />
          </TouchableOpacity>
        </div>
      </div>
    </Pressable>
  );
};
```

#### **ProductGridMobile**
```typescript
const ProductGridMobile = ({ products, onAddToCart, category, searchQuery }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <ProductHeaderMobile
        category={category}
        onSearch={onSearchToggle}
        onFilter={onFilterToggle}
      />

      {/* Scrollable Grid - 2 columns on mobile */}
      <ScrollView className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCardMobile
              key={product.id}
              product={product}
              onAdd={onAddToCart}
              onDetails={onShowDetails}
            />
          ))}
        </div>
      </ScrollView>

      {/* FAB para búsqueda rápida */}
      <FloatingActionButton
        icon={<Search />}
        onPress={onSearchToggle}
        position="bottom-right"
        offset={{ bottom: 80, right: 16 }} // Above bottom nav
      />
    </div>
  );
};
```

### 3. Cart Components Mobile

#### **CartListMobile**
```typescript
const CartListMobile = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with total */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Carrito ({items.length})</h2>
          <span className="text-2xl font-bold text-brand">
            {formatCurrency(calculateTotal(items))}
          </span>
        </div>
      </div>

      {/* Items list with swipe actions */}
      <ScrollView className="flex-1">
        {items.map((item) => (
          <SwipeableCartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </ScrollView>

      {/* Sticky checkout button */}
      <div className="p-4 border-t border-neutral-200">
        <TouchableOpacity
          onPress={onCheckout}
          className="w-full h-14 bg-brand rounded-xl flex items-center justify-center"
        >
          <span className="text-white text-lg font-semibold">
            Cobrar {formatCurrency(total)}
          </span>
        </TouchableOpacity>
      </div>
    </div>
  );
};
```

#### **SwipeableCartItem**
```typescript
const SwipeableCartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Swipeable
      renderRightActions={() => (
        <SwipeDeleteAction onPress={() => onRemove(item.id)} />
      )}
    >
      <div className="flex items-center p-4 border-b border-neutral-100">
        {/* Product info */}
        <div className="flex-1 mr-3">
          <h4 className="font-medium text-neutral-900">{item.name}</h4>
          <p className="text-sm text-neutral-600">
            {formatCurrency(item.price)} x {item.quantity}
          </p>
        </div>

        {/* Quantity controls - touch optimized */}
        <div className="flex items-center space-x-3">
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, -1)}
            className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center active:bg-neutral-200"
          >
            <Minus className="w-5 h-5 text-neutral-700" />
          </TouchableOpacity>

          <span className="w-8 text-center font-medium text-lg">
            {item.quantity}
          </span>

          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, 1)}
            className="w-10 h-10 bg-brand rounded-full flex items-center justify-center active:bg-brand-dark"
          >
            <Plus className="w-5 h-5 text-white" />
          </TouchableOpacity>
        </div>

        {/* Total for this item */}
        <div className="w-16 text-right">
          <span className="text-lg font-bold text-brand">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </Swipeable>
  );
};
```

### 4. Bottom Sheets & Overlays

#### **BottomSheet**
```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: string[];
  children: React.ReactNode;
  dismissible?: boolean;
}

const BottomSheet = ({ isOpen, onClose, snapPoints = ['25%', '50%', '90%'], children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onTap={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50"
            style={{ maxHeight: '90vh' }}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-4" />

            {/* Content */}
            <div className="pb-safe">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

#### **CheckoutBottomSheet**
```typescript
const CheckoutBottomSheet = ({ items, total, onPaymentMethod, onProcess }) => {
  return (
    <BottomSheet isOpen snapPoints={['60%', '90%']}>
      <div className="px-6">
        <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>

        {/* Order summary */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-lg">
            <span>Subtotal ({items.length} productos)</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment methods - mobile optimized */}
        <PaymentMethodsMobile
          onSelect={onPaymentMethod}
          selected={selectedMethod}
        />

        {/* Process button */}
        <TouchableOpacity
          onPress={onProcess}
          className="w-full h-16 bg-brand rounded-2xl flex items-center justify-center mt-6"
        >
          <span className="text-white text-xl font-bold">
            Procesar ${formatCurrency(total)}
          </span>
        </TouchableOpacity>
      </div>
    </BottomSheet>
  );
};
```

### 5. Mobile-Specific Components

#### **NumericKeypad**
```typescript
const NumericKeypad = ({ onNumber, onDelete, onConfirm, value }) => {
  const keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['⌫', 0, '✓']
  ];

  return (
    <div className="bg-white p-4 rounded-t-3xl">
      <div className="text-center mb-4">
        <span className="text-3xl font-bold text-brand">
          ${value || '0.00'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {keys.flat().map((key, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleKeyPress(key)}
            className="h-16 bg-neutral-100 rounded-xl flex items-center justify-center active:bg-neutral-200"
          >
            <span className="text-2xl font-semibold">
              {key}
            </span>
          </TouchableOpacity>
        ))}
      </div>
    </div>
  );
};
```

#### **SearchOverlay**
```typescript
const SearchOverlay = ({ isOpen, onClose, onSearch, products }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 left-0 right-0 bg-white z-30 shadow-lg"
        >
          <div className="p-4">
            <SearchInput
              autoFocus
              placeholder="Buscar productos..."
              onChangeText={onSearch}
              onCancel={onClose}
            />

            {/* Quick results */}
            <SearchResults products={filteredProducts} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## 🔄 COMPONENTES A REEMPLAZAR

### Desktop → Mobile Mapping
```typescript
const componentMigration = {
  // Layout changes
  "page.tsx grid layout": "MobileLayout + BottomNavigation",
  "module tabs": "BottomTabs with icons",
  "header desktop": "StatusBar mobile",

  // Product components
  "ProductGrid desktop": "ProductGridMobile (2-col)",
  "ProductCard desktop": "ProductCardMobile (touch-optimized)",
  "Search complex": "SearchOverlay + FAB",

  // Cart components
  "Cart sidebar": "CartListMobile + BottomSheet",
  "Cart controls tiny": "SwipeableCartItem (44px targets)",
  "Checkout inline": "CheckoutBottomSheet",

  // Modules
  "StockManager desktop": "StockManagerMobile (vertical form)",
  "BarcodeScanner modal": "FullscreenCamera",
  "CashRegister desktop": "CashMobile (simplified)",

  // Interactions
  "Hover states": "Press states + haptics",
  "Mouse clicks": "Touch gestures + swipes",
  "Keyboard shortcuts": "Hardware buttons + gestures"
};
```

## 📱 GESTOS Y INTERACCIONES

### Touch Gestures Mapping
```typescript
const gestureMap = {
  // Products
  "tap": "add to cart",
  "long-press": "show details",
  "double-tap": "quick view",

  // Cart
  "swipe-left": "delete item",
  "swipe-right": "add quantity",
  "pull-up": "open checkout",

  // Navigation
  "swipe-horizontal": "change category",
  "pull-to-refresh": "reload products",
  "edge-swipe": "back navigation",

  // Scanner
  "tap-screen": "focus camera",
  "volume-buttons": "capture",
  "pinch": "zoom camera",

  // General
  "shake": "clear cart (with confirmation)",
  "3d-touch": "quick actions menu"
};
```

### Hardware Integration
```typescript
const hardwareFeatures = {
  camera: {
    api: "navigator.mediaDevices.getUserMedia",
    features: ["torch", "autofocus", "zoom"],
    fallback: "manual barcode input"
  },

  vibration: {
    api: "navigator.vibrate",
    patterns: {
      "success": [100],
      "error": [50, 50, 50],
      "add-cart": [25]
    }
  },

  screen: {
    "wake-lock": "prevent sleep during use",
    "orientation": "portrait preferred",
    "brightness": "auto-adjust for outdoor"
  },

  audio: {
    "beep": "scan success",
    "error-sound": "validation fail",
    "click": "button feedback"
  }
};
```

## 🎯 SUCCESS METRICS

### Component Performance Targets
```typescript
const componentTargets = {
  "ProductCardMobile": {
    "render-time": "<16ms (60fps)",
    "touch-response": "<100ms",
    "image-load": "<500ms",
    "memory-usage": "<2MB per card"
  },

  "BottomSheet": {
    "animation-smooth": "60fps guaranteed",
    "open-time": "<200ms",
    "gesture-response": "<50ms",
    "backdrop-tap": "<100ms"
  },

  "SwipeableCartItem": {
    "swipe-threshold": "30px minimum",
    "swipe-velocity": "0.5px/ms",
    "delete-confirm": "visual + haptic",
    "restore-undo": "3s window"
  }
};
```

## 🚀 NEXT STEPS

1. **Implementar MobileLayout** - Base para toda la arquitectura
2. **Crear BottomNavigation** - Navegación principal mobile
3. **Refactorizar ProductCard** - Touch-optimized version
4. **Implementar BottomSheet** - Base para overlays
5. **Crear SwipeableCartItem** - Interacciones cart mobile

**Prioridad**: Empezar con MobileLayout + BottomNavigation para establecer la base, luego iterar componente por componente.