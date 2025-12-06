#!/usr/bin/env node
/**
 * Script para generar iconos PWA
 * Requiere: npm install sharp
 * Uso: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Tamaños de iconos necesarios
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG base del icono
const createSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f97316"/>
      <stop offset="100%" style="stop-color:#ea580c"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.1875)}" fill="url(#bg)"/>
  <text x="${size/2}" y="${size * 0.66}" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.55)}" font-weight="bold" fill="white" text-anchor="middle">N</text>
</svg>`;

const iconsDir = path.join(__dirname, '../public/icons');

// Asegurar que el directorio existe
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Intentar usar sharp si está instalado
    const sharp = require('sharp');

    for (const size of sizes) {
      const svg = createSvg(size);
      const outputPath = path.join(iconsDir, `icon-${size}.png`);

      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`Created: icon-${size}.png`);
    }

    console.log('All icons generated successfully!');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log('Sharp not installed. Creating SVG placeholders instead.');
      console.log('To generate PNG icons, run: pnpm add -D sharp && node scripts/generate-icons.js');

      // Crear SVGs como fallback
      for (const size of sizes) {
        const svg = createSvg(size);
        const outputPath = path.join(iconsDir, `icon-${size}.svg`);
        fs.writeFileSync(outputPath, svg);
        console.log(`Created: icon-${size}.svg`);
      }
    } else {
      throw err;
    }
  }
}

generateIcons();
