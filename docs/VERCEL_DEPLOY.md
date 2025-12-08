# Deploy en Vercel - Guía Rápida

## 🚀 Pre-requisitos

1. **Cuenta en Vercel**: [vercel.com](https://vercel.com)
2. **Base de datos Turso**: [turso.tech](https://turso.tech)
3. **Repositorio en GitHub**: Conectado con Vercel

## 📋 Checklist Pre-Deploy

```bash
# 1. Verificar que todo compile localmente
pnpm build

# 2. Ejecutar script de verificación
pnpm verify:deploy
```

## ⚙️ Configuración en Vercel Dashboard

### 1. Build & Development Settings

```
Framework Preset: Next.js
Build Command: (usar el del vercel.json)
Output Directory: (usar el del vercel.json)
Install Command: (usar el del vercel.json)
```

### 2. Root Directory

```
apps/next-host-demo
```

### 3. Node.js Version

```
20.x
```

### 4. Environment Variables

#### Production Environment

| Variable              | Valor                         | Descripción             |
| --------------------- | ----------------------------- | ----------------------- |
| `DATABASE_URL`        | `libsql://[your-db].turso.io` | URL de Turso            |
| `TURSO_AUTH_TOKEN`    | `your-token`                  | Token de Turso          |
| `JWT_SECRET`          | `[generated-secret]`          | Secreto JWT (32+ chars) |
| `API_KEY`             | `your-api-key`                | API Key interna         |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | URL de la app           |
| `NODE_ENV`            | `production`                  | Ambiente                |

#### Generar JWT_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🗄️ Configurar Turso Database

```bash
# 1. Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 2. Login
turso auth login

# 3. Crear database
turso db create formengine-lpc-prod

# 4. Obtener URL
turso db show formengine-lpc-prod --url

# 5. Crear token
turso db tokens create formengine-lpc-prod

# 6. Migrar schema (desde tu local)
tsx prisma/migrate-turso.ts
```

## 📦 Orden de Deploy

El `vercel.json` ya está configurado para:

1. ✅ Instalar todas las dependencias del monorepo
2. ✅ Construir el paquete `@jonathanludena/form-engine`
3. ✅ Construir la aplicación Next.js
4. ✅ Generar Prisma Client automáticamente

## 🔍 Verificar Deploy

### Durante el Build

Verifica en los logs de Vercel:

```
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
✓ Finalizing page optimization
```

### Después del Deploy

1. **Health Check**: Visita `https://your-app.vercel.app/`
2. **API Check**: Prueba `https://your-app.vercel.app/api/brokers`
3. **Forms Check**: Prueba las rutas de formularios

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot find module '@jonathanludena/form-engine'"

**Causa**: El paquete forms no se compiló antes de Next.js

**Solución**: Verifica que el `buildCommand` en `vercel.json` incluya `pnpm build:forms`

### Error: "DATABASE_URL is not set"

**Causa**: Variables de entorno no configuradas

**Solución**:

1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega todas las variables requeridas
3. Redeploy

### Error: "Prisma Client not generated"

**Causa**: El script postinstall no se ejecutó

**Solución**: Verifica que `scripts/postinstall.js` exista y contenga:

```javascript
execSync('prisma generate', { stdio: 'inherit' });
```

### Error: Build timeout

**Causa**: El build tarda mucho

**Solución**:

1. Revisa que no haya dependencias innecesarias
2. Considera usar caché de Vercel
3. Optimiza el `buildCommand`

### Warning: "Critical dependency: the request of a dependency is an expression"

**Causa**: Normal con algunas dependencias dinámicas

**Solución**: Ya está suprimido en `next.config.ts` con `ignoreWarnings`

### Error: "TURSO_AUTH_TOKEN expired"

**Causa**: El token de Turso expiró

**Solución**:

```bash
turso db tokens create formengine-lpc-prod
# Actualiza el token en Vercel Dashboard
```

## 🔄 Redeploy

### Desde Vercel Dashboard

1. Ve a Deployments
2. Clic en "..." del último deploy
3. Selecciona "Redeploy"

### Desde CLI

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### Trigger automático

Cada push a `main` hará deploy automáticamente si está configurado en Vercel.

## 📊 Monitoreo

### Logs en tiempo real

```bash
vercel logs --follow
```

### Analytics

Vercel Dashboard → Analytics

### Performance

Vercel Dashboard → Speed Insights

## 🔐 Seguridad

### Headers configurados

- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy

### Recomendaciones

1. Rotar JWT_SECRET cada 90 días
2. Usar tokens de Turso con TTL
3. Monitorear logs de acceso
4. Implementar rate limiting en APIs

## 📚 Recursos

- [Vercel Docs - Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Turso Docs](https://docs.turso.tech/)
- [Prisma + Turso](https://www.prisma.io/docs/orm/overview/databases/turso)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel Dashboard
2. Ejecuta `pnpm verify:deploy` localmente
3. Consulta `docs/VERCEL_BUILD_FIXES.md`
4. Revisa las Issues en GitHub
