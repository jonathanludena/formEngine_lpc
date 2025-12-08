#!/usr/bin/env node

/**
 * Pre-deploy verification script
 * Verifica que el proyecto esté listo para deploy en Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando proyecto para deploy...\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Verificar que existan archivos de configuración críticos
console.log('📋 Verificando archivos de configuración...');
const requiredFiles = [
  'next.config.ts',
  'vercel.json',
  'package.json',
  'tsconfig.json',
  '.vercelignore',
  'prisma/schema.prisma',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
    hasErrors = true;
  }
});

// 2. Verificar variables de entorno ejemplo
console.log('\n📋 Verificando variables de entorno...');
const envExample = path.join(__dirname, '..', '.env.example');
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, 'utf-8');
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'API_KEY',
    'NEXT_PUBLIC_APP_URL',
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`  ✅ ${varName} definida en .env.example`);
    } else {
      console.log(`  ⚠️  ${varName} - No encontrada en .env.example`);
      hasWarnings = true;
    }
  });
} else {
  console.log('  ⚠️  .env.example no encontrado');
  hasWarnings = true;
}

// 3. Verificar que Prisma Client esté generado
console.log('\n📋 Verificando Prisma Client...');
const prismaClientPath = path.join(__dirname, '..', 'src', 'generated', 'prisma');
if (fs.existsSync(prismaClientPath)) {
  console.log('  ✅ Prisma Client generado');
} else {
  console.log('  ⚠️  Prisma Client no generado - ejecutar: pnpm prisma:generate');
  hasWarnings = true;
}

// 4. Verificar package.json scripts
console.log('\n📋 Verificando scripts en package.json...');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
);

const requiredScripts = ['build', 'start', 'prisma:generate', 'postinstall'];
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`  ✅ Script "${script}" definido`);
  } else {
    console.log(`  ❌ Script "${script}" - NO ENCONTRADO`);
    hasErrors = true;
  }
});

// 5. Verificar versión de Node.js
console.log('\n📋 Verificando versión de Node.js...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
if (majorVersion >= 20) {
  console.log(`  ✅ Node.js ${nodeVersion} (>= 20.0.0)`);
} else {
  console.log(`  ❌ Node.js ${nodeVersion} - Se requiere >= 20.0.0`);
  hasErrors = true;
}

// 6. Verificar que no haya errores de TypeScript
console.log('\n📋 Verificando TypeScript...');
try {
  execSync('pnpm tsc --noEmit', { stdio: 'pipe' });
  console.log('  ✅ Sin errores de TypeScript');
} catch (error) {
  console.log('  ⚠️  Hay errores de TypeScript - revisar con: pnpm tsc --noEmit');
  hasWarnings = true;
}

// 7. Verificar estructura de monorepo
console.log('\n📋 Verificando estructura de monorepo...');
const formsPackagePath = path.join(__dirname, '..', '..', '..', 'packages', 'forms', 'package.json');
if (fs.existsSync(formsPackagePath)) {
  console.log('  ✅ Paquete @jonathanludena/form-engine encontrado');
} else {
  console.log('  ❌ Paquete @jonathanludena/form-engine - NO ENCONTRADO');
  hasErrors = true;
}

// Resumen
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ VERIFICACIÓN FALLIDA - Hay errores críticos');
  console.log('   Por favor, corrige los errores antes de hacer deploy');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  VERIFICACIÓN CON WARNINGS');
  console.log('   Puedes hacer deploy, pero revisa las advertencias');
  process.exit(0);
} else {
  console.log('✅ VERIFICACIÓN EXITOSA');
  console.log('   El proyecto está listo para deploy en Vercel');
  process.exit(0);
}
