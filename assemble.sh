#!/bin/bash
# assemble.sh - Recrear estructura del Nordia Deployment Pack
# Este script recrea la estructura completa del deployment pack desde los archivos base

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_NAME="nordia-deployment-pack"
TEMP_DIR="/tmp/${PACK_NAME}-assembly"
ZIP_FILE="${SCRIPT_DIR}/${PACK_NAME}.zip"

echo "🚀 Nordia Deployment Pack - Assembler"
echo "======================================"

# Limpiar directorio temporal si existe
if [ -d "$TEMP_DIR" ]; then
    echo "🧹 Limpiando directorio temporal..."
    rm -rf "$TEMP_DIR"
fi

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p "$TEMP_DIR/$PACK_NAME"
mkdir -p "$TEMP_DIR/$PACK_NAME/01-setup"
mkdir -p "$TEMP_DIR/$PACK_NAME/02-development"
mkdir -p "$TEMP_DIR/$PACK_NAME/04-production"
mkdir -p "$TEMP_DIR/$PACK_NAME/05-deployment"

# Verificar archivos fuente
SOURCE_DIR="/home/nordia/MVPs/nordia-deployment-pack"
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Directorio fuente no encontrado: $SOURCE_DIR"
    exit 1
fi

# Copiar archivos del deployment pack
echo "📄 Copiando archivos del deployment pack..."

# Archivos raíz
cp "$SOURCE_DIR/README.md" "$TEMP_DIR/$PACK_NAME/"
cp "$SOURCE_DIR/MASTER-PROMPT.md" "$TEMP_DIR/$PACK_NAME/"

# Archivos por directorio
cp "$SOURCE_DIR/01-setup/initial-setup.md" "$TEMP_DIR/$PACK_NAME/01-setup/"
cp "$SOURCE_DIR/02-development/backend-api.md" "$TEMP_DIR/$PACK_NAME/02-development/"
cp "$SOURCE_DIR/02-development/frontend-pos.md" "$TEMP_DIR/$PACK_NAME/02-development/"
cp "$SOURCE_DIR/04-production/docker-setup.md" "$TEMP_DIR/$PACK_NAME/04-production/"
cp "$SOURCE_DIR/05-deployment/vps-setup.md" "$TEMP_DIR/$PACK_NAME/05-deployment/"

# Agregar manifest.json al pack
echo "📋 Agregando manifest.json..."
cp "$SCRIPT_DIR/manifest.json" "$TEMP_DIR/$PACK_NAME/"

# Crear archivo de checksums
echo "🔐 Generando checksums..."
cd "$TEMP_DIR/$PACK_NAME"
find . -type f -exec sha256sum {} \; | sort > checksums.txt

# Agregar scripts útiles al pack
echo "🛠️  Agregando scripts útiles..."

# Script de verificación
cat > "$TEMP_DIR/$PACK_NAME/verify.sh" << 'EOF'
#!/bin/bash
# verify.sh - Verificar integridad del deployment pack

echo "🔍 Verificando integridad del Nordia Deployment Pack..."

if [ ! -f "checksums.txt" ]; then
    echo "❌ Archivo checksums.txt no encontrado"
    exit 1
fi

if sha256sum -c checksums.txt --quiet; then
    echo "✅ Todos los archivos verificados correctamente"
    echo "📦 Pack listo para usar"
    echo ""
    echo "Próximo paso:"
    echo "1. Lee MASTER-PROMPT.md"
    echo "2. Sigue las instrucciones paso a paso"
    echo "3. ¡Tendrás tu POS funcionando en 2 horas!"
else
    echo "❌ Algunos archivos no coinciden con los checksums"
    exit 1
fi
EOF

chmod +x "$TEMP_DIR/$PACK_NAME/verify.sh"

# Script de quick start
cat > "$TEMP_DIR/$PACK_NAME/quick-start.sh" << 'EOF'
#!/bin/bash
# quick-start.sh - Inicio rápido del deployment

echo "🚀 NORDIA POS - QUICK START"
echo "=========================="
echo ""
echo "Este deployment pack contiene todo lo necesario para:"
echo "- ✅ Backend FastAPI con MercadoPago"
echo "- ✅ Frontend Next.js responsivo"
echo "- ✅ Base de datos PostgreSQL"
echo "- ✅ Docker para producción"
echo "- ✅ Deploy completo a VPS con SSL"
echo ""
echo "⏱️  Tiempo estimado: ~2 horas"
echo "🇦🇷 Configurado para Argentina (ARS + MercadoPago)"
echo ""
echo "📖 PASOS A SEGUIR:"
echo "1. Abre MASTER-PROMPT.md en tu editor"
echo "2. Copia los prompts en Claude Code o ChatGPT"
echo "3. Sigue las fases secuencialmente"
echo "4. ¡Tendrás tu POS listo para producción!"
echo ""
echo "📁 Estructura del pack:"
echo "- MASTER-PROMPT.md    → Prompt principal"
echo "- 01-setup/           → Configuración inicial"
echo "- 02-development/     → Código completo"
echo "- 04-production/      → Docker setup"
echo "- 05-deployment/      → Deploy a VPS"
echo ""
read -p "Presiona Enter para ver el contenido del MASTER-PROMPT..."
cat MASTER-PROMPT.md
EOF

chmod +x "$TEMP_DIR/$PACK_NAME/quick-start.sh"

# Crear el ZIP final
echo "📦 Creando archivo ZIP..."
cd "$TEMP_DIR"
zip -r "$ZIP_FILE" "$PACK_NAME" > /dev/null

# Obtener tamaño del ZIP
ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)

# Limpiar directorio temporal
echo "🧹 Limpiando archivos temporales..."
rm -rf "$TEMP_DIR"

# Resumen final
echo ""
echo "✅ PACK COMPLETO"
echo "================"
echo "📍 Archivo: $ZIP_FILE"
echo "📏 Tamaño: $ZIP_SIZE"
echo ""
echo "📄 Contenido del pack:"
echo "- 7 archivos de documentación y prompts"
echo "- 1 manifest.json con metadatos"
echo "- 1 checksums.txt para verificación"
echo "- 2 scripts utilitarios (verify.sh, quick-start.sh)"
echo ""
echo "🎯 El pack está listo para:"
echo "- Descargar y descomprimir"
echo "- Ejecutar ./quick-start.sh"
echo "- Seguir MASTER-PROMPT.md"
echo "- Tener POS funcionando en producción"
echo ""
echo "🎉 ¡Nordia Deployment Pack generado exitosamente!"