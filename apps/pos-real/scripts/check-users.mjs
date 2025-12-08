#!/usr/bin/env node
/**
 * Script para verificar usuarios en Supabase
 * Diagnóstico del bug: PIN del dueño no funciona
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nsodkpjxvvqursgqldcy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zb2RrcGp4dnZxdXJzZ3FsZGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIyNjUsImV4cCI6MjA4MDU2ODI2NX0.6M3NDIDeSmHBYttQkYp3BfNY9wfpfl-V9hoY5NTzy-w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUsers() {
  console.log('🔍 Consultando usuarios en Supabase...\n');

  const { data: users, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      pin,
      role,
      active,
      store_id,
      created_at,
      stores (id, name, type)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error consultando usuarios:', error);
    return;
  }

  console.log(`📋 USUARIOS EN BASE DE DATOS: ${users?.length || 0}\n`);
  console.log('=' .repeat(80));

  if (!users || users.length === 0) {
    console.log('⚠️  No hay usuarios en la base de datos');
    return;
  }

  // Mostrar cada usuario
  users.forEach((user, idx) => {
    const store = user.stores;
    console.log(`\n👤 USUARIO ${idx + 1}:`);
    console.log(`   ID:        ${user.id}`);
    console.log(`   Nombre:    ${user.name}`);
    console.log(`   PIN:       "${user.pin}" (length: ${user.pin?.length}, type: ${typeof user.pin})`);
    console.log(`   Rol:       ${user.role}`);
    console.log(`   Activo:    ${user.active ? '✅ Sí' : '❌ No'}`);
    console.log(`   Store ID:  ${user.store_id || '(null)'}`);
    console.log(`   Store:     ${store?.name || '(sin tienda)'} (${store?.type || '-'})`);
    console.log(`   Creado:    ${user.created_at}`);
  });

  console.log('\n' + '=' .repeat(80));

  // Resumen
  const admins = users.filter(u => u.role === 'admin');
  const cashiers = users.filter(u => u.role === 'cashier');
  const activos = users.filter(u => u.active);
  const inactivos = users.filter(u => !u.active);

  console.log('\n📊 RESUMEN:');
  console.log(`   Total usuarios:  ${users.length}`);
  console.log(`   Admins:          ${admins.length}`);
  console.log(`   Cajeros:         ${cashiers.length}`);
  console.log(`   Activos:         ${activos.length}`);
  console.log(`   Inactivos:       ${inactivos.length}`);

  // PINs disponibles
  console.log('\n🔑 PINs DISPONIBLES PARA LOGIN:');
  activos.forEach(u => {
    console.log(`   ${u.role.toUpperCase().padEnd(8)} PIN: ${u.pin}  (${u.name})`);
  });

  // Verificar posibles problemas
  console.log('\n🔎 DIAGNÓSTICO:');

  // 1. PINs duplicados
  const pinsActivos = activos.map(u => u.pin);
  const duplicados = pinsActivos.filter((pin, idx) => pinsActivos.indexOf(pin) !== idx);
  if (duplicados.length > 0) {
    console.log(`   ⚠️  PINs DUPLICADOS: ${duplicados.join(', ')}`);
    console.log(`      Esto causa que .single() falle!`);
  } else {
    console.log(`   ✅ No hay PINs duplicados`);
  }

  // 2. Usuarios sin store
  const sinStore = users.filter(u => !u.store_id);
  if (sinStore.length > 0) {
    console.log(`   ⚠️  Usuarios sin tienda: ${sinStore.map(u => u.name).join(', ')}`);
  }

  // 3. Verificar PIN esperado del dueño
  const adminActivo = admins.find(a => a.active);
  if (adminActivo) {
    console.log(`\n🔐 PARA PROBAR LOGIN ADMIN:`);
    console.log(`   Ingresa el PIN: ${adminActivo.pin}`);
  }
}

checkUsers().catch(console.error);
