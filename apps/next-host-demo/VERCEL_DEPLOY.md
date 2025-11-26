# Despliegue en Vercel - Guía Rápida

## 📦 Pre-requisitos

1. ✅ Código pusheado a GitHub
2. ✅ Cuenta en Vercel
3. ✅ Base de datos Turso configurada (ver `TURSO_SETUP.md`)

## 🚀 Pasos de Deploy

### 1. Conectar repositorio a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New Project"**
3. Importa tu repositorio `formEngine_lpc`

### 2. Configurar el proyecto

**Framework Preset:** Next.js (detectado automáticamente)

**Root Directory:** `apps/next-host-demo`

**Build Command:**

```bash
cd ../.. && pnpm install && cd apps/next-host-demo && pnpm build
```

**Output Directory:** `.next` (default)

**Install Command:**

```bash
pnpm install
```

### 3. Variables de Entorno

Agrega estas variables en Vercel → Settings → Environment Variables:

```bash
# Turso Database
DATABASE_URL=libsql://formengine-demo-[username].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSI...

# Security
JWT_SECRET=production-secret-change-this-to-random-string
API_KEY=production-api-key-change-this

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**⚠️ IMPORTANTE:** Marca todas como **Production** y **Preview** si quieres.

### 4. Deploy

Click en **"Deploy"** - El proceso tomará ~2-3 minutos.

## ✅ Verificación Post-Deploy

### 1. Check de APIs

```bash
# Reemplaza con tu URL de Vercel
curl https://your-app.vercel.app/api/brokers
curl https://your-app.vercel.app/api/insurers
curl https://your-app.vercel.app/api/plans
```

### 2. Test de Formularios

1. Ve a `https://your-app.vercel.app/quote/health`
2. Completa el formulario
3. Submit → Debería guardar en Turso

### 3. Verificar datos en Turso

```bash
turso db shell formengine-demo

SELECT COUNT(*) FROM Quote;
SELECT * FROM Quote ORDER BY createdAt DESC LIMIT 1;
```

## 🔧 Configuración Build en Vercel

**Si el build falla**, ajusta la configuración:

### Opción A: Usar vercel.json

Crea `apps/next-host-demo/vercel.json`:

```json
{
  "buildCommand": "pnpm install && pnpm prisma:generate && pnpm build",
  "framework": "nextjs",
  "installCommand": "pnpm install --shamefully-hoist"
}
```

### Opción B: Configurar en Dashboard

Settings → General:

- **Framework:** Next.js
- **Node Version:** 20.x (o 22.x)
- **Package Manager:** pnpm

## 🌍 Dominios Custom (Opcional)

### Agregar dominio propio

1. Vercel Dashboard → Project → Settings → Domains
2. Agregar dominio (ej: `formengine.tudominio.com`)
3. Configurar DNS según instrucciones de Vercel
4. Actualizar `NEXT_PUBLIC_APP_URL` en variables de entorno

## 🔄 Redeploys Automáticos

Cada push a la rama configurada (ej: `main` o `reimplementacion`) triggerea un deploy automático.

**Para branches preview:**

- Cada PR crea un ambiente preview con URL única
- Usa las mismas variables de entorno (o configura separadas)

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
vercel logs [deployment-url] --follow
```

### Dashboard de Vercel

- **Analytics:** Tráfico, performance
- **Speed Insights:** Core Web Vitals
- **Logs:** Errores y requests

## 🐛 Problemas Comunes

### "Cannot find module '@jonathanludena/forms'"

**Causa:** Workspace dependency no se resuelve en monorepo.

**Solución:**

```bash
# En vercel.json o Build Settings
"buildCommand": "cd ../.. && pnpm install && cd apps/next-host-demo && pnpm build"
```

### "Prisma Client not generated"

**Causa:** `prisma generate` no corrió durante build.

**Solución:** Agregar postinstall script en `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### "DATABASE_URL is not defined"

**Causa:** Variables de entorno no configuradas.

**Solución:** Vercel Dashboard → Settings → Environment Variables → Agregar todas las variables.

## 🎯 Checklist Final

- [ ] Repositorio pusheado a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Root directory configurado: `apps/next-host-demo`
- [ ] Variables de entorno agregadas
- [ ] Turso DB creada y poblada
- [ ] Deploy exitoso (status verde)
- [ ] API endpoints responden
- [ ] Formularios funcionan
- [ ] Datos se guardan en Turso

---

**🎉 ¡Listo!** Tu demo está en producción en Vercel + Turso.

**URL compartible:** `https://your-app.vercel.app`
