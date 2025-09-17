# 🛡️ Proceso de Backup y Recuperación - Nordia POS

## 📦 Backup Creado

- **Fecha**: 2025-09-16 23:19 UTC
- **Versión**: 3.0-original
- **Ubicación**: `/frontend/src/components-backup-20250916/`
- **Motivo**: Pre-transformación UI/UX suprema hacia nivel Mercado Pago/Ualá

## 🚀 Cómo Restaurar

### Método Automático (Recomendado)
```bash
# Desde la raíz del proyecto
npm run restore-backup 20250916

# O directamente con Node.js
node scripts/restore-backup.js 20250916
```

### Método Manual
```bash
# Copiar archivos desde backup
cp -r frontend/src/components-backup-20250916/modules/* frontend/src/components/modules/
cp frontend/src/components-backup-20250916/app/* frontend/src/app/
cp frontend/src/components-backup-20250916/lib/* frontend/src/lib/

# Reinstalar dependencias
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📋 Archivos Incluidos en el Backup

| Archivo | Líneas | Tamaño | Funcionalidad |
|---------|--------|--------|---------------|
| `page.tsx` | 426 | 15.4KB | **Interfaz principal F1** |
| `layout.tsx` | 35 | 0.8KB | Layout base con tipografías |
| `globals.css` | 436 | 9.8KB | **Sistema CSS Enterprise v3.0** |
| `StockManager.tsx` | 150 | 4.8KB | **Módulo F3 - Gestión Stock** |
| `BarcodeScanner.tsx` | 98 | 3.1KB | **Módulo F11 - Scanner** |
| `CashRegister.tsx` | 187 | 6.6KB | **Módulo F8 - Caja** |
| `api.ts` | 69 | 2.0KB | **Cliente API REST** |

**Total**: 7 archivos, 1,401 líneas, 42.5KB

## 🔍 Verificación Post-Restauración

Ejecutar esta checklist después de restaurar:

### ✅ Funcionalidades Core
- [ ] **F1 - Ventas**: Catálogo productos, carrito, checkout completo
- [ ] **F3 - Stock**: Upload CSV, agregar productos, lista inventario
- [ ] **F8 - Caja**: Apertura, movimientos, cierre Z, reportes
- [ ] **F11 - Scanner**: Activación cámara, decodificación códigos

### ✅ Integraciones
- [ ] **Conexión API**: Endpoints backend responden
- [ ] **Métodos Pago**: Efectivo, tarjeta, MercadoPago
- [ ] **Base de Datos**: Productos, ventas, stock sincronizado

### ✅ UI/UX Original
- [ ] **Estilos**: CSS enterprise v3.0 aplicado
- [ ] **Colores**: Verde esmeralda (#10B981) + azul eléctrico
- [ ] **Tipografía**: Inter + Roboto Mono cargadas
- [ ] **Responsive**: Grid/flexbox en móvil y desktop

### ✅ Atajos de Teclado
- [ ] **F1**: Módulo ventas activo
- [ ] **F3**: Módulo stock activo
- [ ] **F8**: Módulo caja activo
- [ ] **F11**: Scanner modal abierto
- [ ] **F12**: Procesar venta

### ✅ Performance
- [ ] **Build**: `npm run build` exitoso
- [ ] **Desarrollo**: `npm run dev` sin errores
- [ ] **Navegación**: Cambio módulos fluido
- [ ] **Carga**: Productos renderizados < 2 segundos

## 🔧 Script de Restauración

El script `/scripts/restore-backup.js` incluye:

### Características
- ✅ **Verificación integridad**: Valida todos los archivos existen
- ✅ **Backup seguridad**: Respalda archivos actuales antes de sobrescribir
- ✅ **Reinstalación dependencias**: Limpia node_modules y reinstala
- ✅ **Verificación build**: Confirma que proyecto compila
- ✅ **Logging detallado**: Reporta cada paso del proceso

### Salida Esperada
```
🔄 Iniciando restauración de backup del 20250916...
📋 Leyendo manifest del backup...
   Versión: 3.0-original
   Archivos: 7
   Fecha backup: 2025-09-16T23:19:00Z
🔍 Verificando integridad del backup...
   ✅ Todos los archivos de backup están presentes
💾 Creando backup de archivos actuales en: components-backup-current-1726523940123
📁 Restaurando archivos...
   ✅ /src/app/page.tsx
   ✅ /src/app/layout.tsx
   ✅ /src/app/globals.css
   ✅ /src/components/modules/StockManager.tsx
   ✅ /src/components/modules/BarcodeScanner.tsx
   ✅ /src/components/modules/CashRegister.tsx
   ✅ /src/lib/api.ts
🧹 Limpiando node_modules y reinstalando dependencias...
🔨 Verificando que el proyecto compile...
   ✅ Proyecto compila correctamente

🎉 RESTAURACIÓN COMPLETADA EXITOSAMENTE
```

## 🚨 Resolución de Problemas

### Error: "Backup no encontrado"
```bash
# Listar backups disponibles
ls frontend/src/components-backup-*/

# Verificar fecha correcta
node scripts/restore-backup.js
```

### Error: "Archivos faltantes"
```bash
# Verificar integridad manualmente
cat frontend/src/components-backup-20250916/backup-manifest.json

# Restaurar archivos individualmente
cp frontend/src/components-backup-20250916/app/page.tsx frontend/src/app/
```

### Error: "No compila después de restaurar"
```bash
# Limpiar completamente
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### Error: "Funcionalidad no responde"
```bash
# Verificar API backend activo
curl https://nordia-backend.onrender.com/api/products

# Revisar console browser para errores JS
# Verificar .env.local tiene variables correctas
```

## 📂 Estructura de Backups

```
frontend/src/
├── components-backup-20250916/     # ← BACKUP ORIGINAL
│   ├── modules/
│   │   ├── StockManager.tsx
│   │   ├── BarcodeScanner.tsx
│   │   └── CashRegister.tsx
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── api.ts
│   └── backup-manifest.json
├── components-backup-current-*/    # ← Backup automático pre-restauración
└── [archivos actuales]
```

## 🎯 Siguiente Paso

Una vez verificado que el backup funciona correctamente:

**✅ Proceder con**: `prompt-003-setup-design-system.md`

El backup garantiza **rollback 100% seguro** en cualquier momento durante la transformación UI/UX.

---

**⚡ EMERGENCY ROLLBACK**: `npm run restore-backup 20250916`
**📞 Soporte**: Revisar `audit-report.md` para contexto completo