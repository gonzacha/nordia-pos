#!/usr/bin/env node

/**
 * NORDIA POS - BACKUP RESTORATION SCRIPT
 * Restaura componentes desde backup completo
 * Uso: npm run restore-backup 20250916
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const restoreBackup = async (backupDate) => {
  console.log(`🔄 Iniciando restauración de backup del ${backupDate}...`);

  const backupDir = `frontend/src/components-backup-${backupDate}`;
  const manifestPath = path.join(backupDir, 'backup-manifest.json');

  try {
    // 1. Verificar que existe el backup
    if (!fs.existsSync(backupDir)) {
      throw new Error(`❌ Backup no encontrado: ${backupDir}`);
    }

    // 2. Leer manifest
    console.log('📋 Leyendo manifest del backup...');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`   Versión: ${manifest.version}`);
    console.log(`   Archivos: ${manifest.totalFiles}`);
    console.log(`   Fecha backup: ${manifest.backupDate}`);

    // 3. Verificar integridad
    console.log('🔍 Verificando integridad del backup...');
    for (const file of manifest.files) {
      const backupFilePath = path.join('frontend/src', file.backup.replace('/src/', ''));
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`❌ Archivo de backup faltante: ${backupFilePath}`);
      }
    }
    console.log('   ✅ Todos los archivos de backup están presentes');

    // 4. Crear backup de los archivos actuales (por seguridad)
    const currentBackupDir = `frontend/src/components-backup-current-${Date.now()}`;
    console.log(`💾 Creando backup de archivos actuales en: ${currentBackupDir}`);
    execSync(`mkdir -p ${currentBackupDir}/modules ${currentBackupDir}/app ${currentBackupDir}/lib`);

    // 5. Copiar archivos de vuelta
    console.log('📁 Restaurando archivos...');
    for (const file of manifest.files) {
      const sourceBackup = path.join('frontend/src', file.backup.replace('/src/', ''));
      const targetOriginal = path.join('frontend/src', file.original.replace('/src/', ''));
      const targetDir = path.dirname(targetOriginal);

      // Crear directorio si no existe
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Backup del archivo actual antes de sobrescribir
      if (fs.existsSync(targetOriginal)) {
        const currentBackupFile = path.join(currentBackupDir, file.original.replace('/src/', ''));
        const currentBackupFileDir = path.dirname(currentBackupFile);
        if (!fs.existsSync(currentBackupFileDir)) {
          fs.mkdirSync(currentBackupFileDir, { recursive: true });
        }
        fs.copyFileSync(targetOriginal, currentBackupFile);
      }

      // Restaurar archivo desde backup
      fs.copyFileSync(sourceBackup, targetOriginal);
      console.log(`   ✅ ${file.original}`);
    }

    // 6. Limpiar node_modules y reinstalar dependencias
    console.log('🧹 Limpiando node_modules y reinstalando dependencias...');
    process.chdir('frontend');

    if (fs.existsSync('node_modules')) {
      execSync('rm -rf node_modules');
    }

    if (fs.existsSync('package-lock.json')) {
      execSync('rm package-lock.json');
    }

    execSync('npm install');

    // 7. Verificar que compile
    console.log('🔨 Verificando que el proyecto compile...');
    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('   ✅ Proyecto compila correctamente');
    } catch (buildError) {
      console.warn('   ⚠️  Warning: El proyecto no compila, pero archivos restaurados');
    }

    process.chdir('..');

    console.log('\\n🎉 RESTAURACIÓN COMPLETADA EXITOSAMENTE');
    console.log('\\n📋 VERIFICACIONES RECOMENDADAS:');
    manifest.restoreInstructions.verification.forEach(check => {
      console.log(`   • ${check}`);
    });

    console.log(`\\n💾 Backup de archivos previos guardado en: ${currentBackupDir}`);
    console.log('\\n🚀 El sistema ha sido restaurado a la versión original');

    return true;

  } catch (error) {
    console.error(`\\n❌ ERROR EN RESTAURACIÓN: ${error.message}`);
    console.error('\\n🔧 PASOS PARA SOLUCIONAR:');
    console.error('   1. Verificar que existe el directorio de backup');
    console.error('   2. Revisar permisos de archivos');
    console.error('   3. Restaurar manualmente copiando archivos');
    console.error(`   4. Contactar soporte si persiste el problema`);
    return false;
  }
};

// Validar argumentos de línea de comandos
const backupDate = process.argv[2];

if (!backupDate) {
  console.error('❌ Error: Debe especificar fecha del backup');
  console.error('\\n📖 USO:');
  console.error('   npm run restore-backup 20250916');
  console.error('   node scripts/restore-backup.js 20250916');
  console.error('\\n📂 BACKUPS DISPONIBLES:');

  // Listar backups disponibles
  const backupDirs = fs.readdirSync('frontend/src/')
    .filter(dir => dir.startsWith('components-backup-'))
    .map(dir => dir.replace('components-backup-', ''));

  if (backupDirs.length > 0) {
    backupDirs.forEach(date => console.error(`   • ${date}`));
  } else {
    console.error('   • No hay backups disponibles');
  }

  process.exit(1);
}

// Ejecutar restauración
restoreBackup(backupDate)
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  });