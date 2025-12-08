# Soluciones de Build para Vercel

## Cambios Implementados

### 1. **vercel.json** - Comando de Build Optimizado

- ✅ Simplificado el `buildCommand` para evitar problemas de caché
- ✅ Uso de `--frozen-lockfile` para builds consistentes
- ✅ Agregado `outputDirectory` explícito
- ✅ Eliminado `--force` que podía causar reinstalaciones innecesarias

**Antes:**

```json
"buildCommand": "cd ../.. && pnpm install && cd packages/forms && pnpm build && cd ../../apps/next-host-demo && rm -rf .next node_modules/.cache && pnpm build"
```

**Después:**

```json
"buildCommand": "cd ../.. && pnpm install --frozen-lockfile && pnpm build:forms && cd apps/next-host-demo && pnpm build"
```

### 2. **next.config.ts** - Configuración de Producción

- ✅ Agregado `output: 'standalone'` para optimizar el bundle de producción
- ✅ Configurado `ignoreWarnings` para suprimir warnings específicos de webpack
- ✅ Mejorado `fallback` de cliente con `crypto: false`
- ✅ Optimizada la configuración de webpack para producción

### 3. **tsconfig.json** - TypeScript Mejorado

- ✅ Agregado `forceConsistentCasingInFileNames` para prevenir errores de importación
- ✅ Configurado `noUnusedLocals` y `noUnusedParameters` en `false` para evitar errores de build
- ✅ Mejorada la lista de exclusiones con `.next`, `dist`, `build`

### 4. **.vercelignore** - Optimización de Upload

- ✅ Creado archivo para excluir archivos innecesarios del deploy
- ✅ Reduce tiempo de upload y tamaño del bundle

### 5. **.env.production** - Variables de Entorno

- ✅ Template para configuración de producción
- ✅ Guía clara de variables requeridas

## Variables de Entorno Requeridas en Vercel

Configura estas variables en el Dashboard de Vercel:

1. **DATABASE_URL** - URL de tu base de datos Turso

   ```
   libsql://[your-db].turso.io
   ```

2. **TURSO_AUTH_TOKEN** - Token de autenticación de Turso

   ```
   your-turso-auth-token
   ```

3. **JWT_SECRET** - Secreto para JWT (generar uno fuerte)

   ```bash
   # Generar con:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **API_KEY** - Clave API para comunicación server-to-server

   ```
   your-secure-api-key
   ```

5. **NEXT_PUBLIC_APP_URL** - URL de tu aplicación

   ```
   https://your-app.vercel.app
   ```

6. **NODE_ENV** - Ambiente (ya configurado por Vercel)
   ```
   production
   ```

## Warnings Comunes Suprimidos

### ✅ "Critical dependency: the request of a dependency is an expression"

- **Causa:** Webpack no puede analizar estáticamente algunas dependencias dinámicas
- **Solución:** Agregado a `ignoreWarnings` en webpack config

### ✅ "Module not found: Can't resolve 'encoding'"

- **Causa:** Dependencia opcional de `node-fetch` que no es necesaria
- **Solución:** Agregado a `ignoreWarnings` en webpack config

## Checklist de Verificación Pre-Deploy

- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Database Turso creada y configurada
- [ ] JWT_SECRET generado y configurado
- [ ] API_KEY configurado si es necesario
- [ ] Build local exitoso (`pnpm build`)
- [ ] Prisma generado (`pnpm prisma:generate`)

## Comandos de Verificación Local

```bash
# 1. Build del paquete forms
cd packages/forms
pnpm build

# 2. Build de Next.js
cd ../../apps/next-host-demo
pnpm build

# 3. O desde la raíz
pnpm build
```

## Solución de Problemas

### Error: "DATABASE_URL is not set"

**Solución:** Configurar `DATABASE_URL` en variables de entorno de Vercel

### Error: "Cannot find module '@jonathanludena/form-engine'"

**Solución:** Asegurar que el build de `packages/forms` se ejecute primero

### Error: "Prisma Client not generated"

**Solución:** El `postinstall` script debería ejecutar `prisma generate` automáticamente

### Warning: "Fast Refresh had to perform a full reload"

**Solución:** Normal en desarrollo, no afecta producción

## Monitoreo Post-Deploy

1. Verificar logs en Vercel Dashboard
2. Revisar Function Logs para errores de runtime
3. Verificar que las API routes respondan correctamente
4. Probar formularios de quote y claim

## Optimizaciones Adicionales (Opcional)

### Reducir Tamaño de Bundle

```typescript
// En next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react'],
}
```

### Configurar ISR (Incremental Static Regeneration)

```typescript
// En páginas estáticas
export const revalidate = 3600; // 1 hora
```

### Agregar Compression

```typescript
// En next.config.ts
compress: true, // Ya habilitado por defecto
```

## Recursos

- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Turso Database](https://turso.tech/docs)
- [Next.js Configuration](https://nextjs.org/docs/app/api-reference/next-config-js)
- [Prisma with Turso](https://www.prisma.io/docs/orm/overview/databases/turso)
