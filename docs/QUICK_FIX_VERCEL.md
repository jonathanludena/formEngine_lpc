# ⚡ Quick Fix - Errores de Build en Vercel

## 🚨 Si tu build está fallando en Vercel, sigue estos pasos:

### 1️⃣ Verificar Variables de Entorno (MÁS COMÚN)

En Vercel Dashboard → Settings → Environment Variables, agrega:

```
DATABASE_URL=libsql://[tu-db].turso.io
TURSO_AUTH_TOKEN=[tu-token]
JWT_SECRET=[genera-uno-fuerte]
API_KEY=[tu-api-key]
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
NODE_ENV=production
```

**Generar JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2️⃣ Verificar Build Settings en Vercel

- ✅ **Framework Preset**: Next.js
- ✅ **Root Directory**: `apps/next-host-demo`
- ✅ **Node.js Version**: 20.x
- ✅ **Build Command**: (automático desde vercel.json)
- ✅ **Install Command**: (automático desde vercel.json)

### 3️⃣ Verificar que el Archivo vercel.json esté correcto

Debería verse así:

```json
{
  "git": {
    "ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
  },
  "buildCommand": "cd ../.. && pnpm install --frozen-lockfile && pnpm build:forms && cd apps/next-host-demo && pnpm build",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "crons": []
}
```

### 4️⃣ Configurar Turso Database

```bash
# Instalar CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Crear DB
turso db create formengine-lpc-prod

# Obtener URL (copiar a Vercel)
turso db show formengine-lpc-prod --url

# Crear token (copiar a Vercel)
turso db tokens create formengine-lpc-prod
```

### 5️⃣ Redeploy

Después de configurar las variables:

1. Ve a Vercel Dashboard
2. Deployments → último deploy
3. Click en "..." → Redeploy

---

## 🔍 Errores Específicos

### ❌ "Cannot find module '@jonathanludena/form-engine'"

**Solución:** El vercel.json ya tiene el orden correcto. Redeploy.

### ❌ "DATABASE_URL is not set"

**Solución:** Configura las variables de entorno en Vercel Dashboard (paso 1)

### ❌ "Prisma Client not generated"

**Solución:** El postinstall script lo hace automáticamente. Redeploy.

### ❌ Build timeout

**Solución:** Ya optimizado en vercel.json. Si persiste, contacta soporte de Vercel.

### ⚠️ Warnings de webpack

**Solución:** Ya suprimidos en next.config.ts. Los warnings no bloquean el build.

---

## ✅ Verificación Rápida Local

Antes de hacer deploy, ejecuta:

```bash
# Desde la raíz del proyecto
pnpm build

# Si hay errores, revisa:
pnpm verify:deploy
```

---

## 📚 Documentación Completa

- `docs/VERCEL_DEPLOY.md` - Guía completa paso a paso
- `docs/VERCEL_BUILD_FIXES.md` - Soluciones técnicas detalladas
- `docs/BUILD_CHANGES_SUMMARY.md` - Resumen de todos los cambios

---

## 🆘 ¿Aún tienes problemas?

1. Revisa los logs completos en Vercel Dashboard
2. Copia el error específico
3. Busca en `docs/VERCEL_BUILD_FIXES.md`
4. Verifica que todos los archivos modificados estén en el repo:
   - ✅ `apps/next-host-demo/vercel.json`
   - ✅ `apps/next-host-demo/next.config.ts`
   - ✅ `apps/next-host-demo/.vercelignore`
   - ✅ `apps/next-host-demo/tsconfig.json`

---

**Tiempo estimado para fix completo: 10-15 minutos** ⏱️
