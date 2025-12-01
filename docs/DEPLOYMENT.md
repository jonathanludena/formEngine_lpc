# 🚀 Guía de Despliegue

Esta guía cubre el despliegue de la librería en **GitHub Packages** y del demo en **Vercel** (Next.js con SSR).

## 🔄 Automatización

- **GitHub Packages**: Automatizado con GitHub Actions (`.github/workflows/publish-forms.yml`)
- **Vercel**: Configurado con `vercel.json` para ignorar cambios irrelevantes.

## 📦 Despliegue en GitHub Packages

Publica la librería `@lpc/form-engine` como paquete npm en GitHub Packages.

### Prerrequisitos

- Repositorio Git configurado en GitHub
- Node.js y npm instalados
- Token de GitHub con permisos de escritura en packages

### Paso 1: Configurar el Repositorio

1. **Inicializar Git** (si aún no lo has hecho):

```powershell
git init
git add .
git commit -m "Initial commit: Form Engine LPC"
```

2. **Crear repositorio en GitHub**:
   - Ve a https://github.com/new
   - Nombre: `formEngine_lpc`
   - Visibilidad: Público o Privado (según tu preferencia)
   - NO inicialices con README (ya tienes uno local)

3. **Conectar repositorio local con GitHub**:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/formEngine_lpc.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Token de Acceso Personal

1. Ve a **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   - URL directa: https://github.com/settings/tokens

2. Click en **Generate new token** → **Generate new token (classic)**

3. Configura el token:
   - **Note**: `Form Engine Package Deploy`
   - **Expiration**: `No expiration` o el tiempo que prefieras
   - **Select scopes**:
     - ✅ `write:packages` - Permite publicar paquetes
     - ✅ `read:packages` - Permite leer paquetes
     - ✅ `delete:packages` - Permite eliminar paquetes (opcional)
     - ✅ `repo` - Acceso completo a repos privados (si tu repo es privado)

4. Click en **Generate token**

5. **¡IMPORTANTE!** Copia el token inmediatamente (solo se muestra una vez)

### Paso 3: Configurar NPM con GitHub Packages

1. **Crear archivo `.npmrc` en la raíz del proyecto**:

```powershell
@YOUR_USERNAME:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN
```

Reemplaza:

- `YOUR_USERNAME` con tu usuario de GitHub
- `YOUR_PERSONAL_ACCESS_TOKEN` con el token que copiaste

2. **Agregar `.npmrc` al `.gitignore`**:

```powershell
echo ".npmrc" >> .gitignore
```

⚠️ **NUNCA** subas el archivo `.npmrc` con el token al repositorio.

### Paso 4: Actualizar package.json

Asegúrate de que tu `package.json` tenga la configuración correcta:

```json
{
  "name": "@YOUR_USERNAME/form-engine",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/formEngine_lpc.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

Reemplaza `YOUR_USERNAME` con tu usuario de GitHub.

### Paso 5: Compilar la Librería

```powershell
# Instalar dependencias
npm install

# Compilar la librería
npm run build:lib
```

Esto generará el directorio `dist/` con los archivos compilados.

### Paso 6: Publicar el Paquete

```powershell
npm publish
```

Si todo está configurado correctamente, verás algo como:

```
+ @YOUR_USERNAME/form-engine@1.0.0
```

### Paso 7: Verificar la Publicación

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Packages** (derecha)
3. Deberías ver `form-engine` listado

O visita directamente:

```
https://github.com/YOUR_USERNAME?tab=packages
```

### Instalar el Paquete en Otro Proyecto

#### Configuración del proyecto consumidor

1. **Crear `.npmrc` en el proyecto que usará la librería**:

```
@YOUR_USERNAME:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN
```

2. **Instalar el paquete**:

```powershell
npm install @YOUR_USERNAME/form-engine
```

3. **Usar en tu aplicación**:

```tsx
import { InsuranceQuoteForm, ClaimForm } from '@YOUR_USERNAME/form-engine';
import '@YOUR_USERNAME/form-engine/styles.css';

function App() {
  const handleSubmit = (data) => {
    console.log('Quote data:', data);
  };

  return (
    <div>
      <InsuranceQuoteForm insuranceType="health" brandId="lpc" onSubmit={handleSubmit} />
    </div>
  );
}
```

### Actualizar Versiones

Cada vez que hagas cambios en la librería:

1. **Actualizar la versión en package.json**:

```powershell
# Incrementar versión patch (1.0.0 → 1.0.1)
npm version patch

# O versión minor (1.0.0 → 1.1.0)
npm version minor

# O versión major (1.0.0 → 2.0.0)
npm version major
```

2. **Compilar y publicar**:

```powershell
npm run build:lib
npm publish
```

3. **Hacer push del tag**:

```powershell
git push --follow-tags
```

### Automatización con GitHub Actions (Implementado)

Se ha creado el workflow `.github/workflows/publish-forms.yml` para automatizar la publicación.

**Workflow:**

- **Trigger:** Push a `main` con cambios en `packages/forms/**`.
- **Acción:** Construye y publica el paquete automáticamente.

Solo necesitas asegurar que el `GITHUB_TOKEN` tenga permisos de escritura en packages.

Crea `.github/workflows/publish.yml`:

```yaml
name: Publish Package to GitHub Packages

on:
  release:
    types: [created]

jobs:
  publish-package:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@YOUR_USERNAME'
          cache: 'pnpm'

      - name: Install dependencies
        run: |
          cd packages/forms
          pnpm install --frozen-lockfile

      - name: Build package
        run: |
          cd packages/forms
          pnpm build

      - name: Publish to GitHub Packages
        run: |
          cd packages/forms
          pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Configuración:**

1. Reemplaza `@YOUR_USERNAME` con tu usuario de GitHub en el scope
2. Este workflow se ejecutará automáticamente cada vez que crees un **Release** en GitHub
3. Solo publica el paquete `@jonathanludena/forms` (o `@YOUR_USERNAME/form-engine`) a GitHub Packages

**⚠️ Importante:**

- Este workflow **NO** despliega la demo en Vercel
- Vercel maneja su propio despliegue automático cuando conectas el repositorio
- Este workflow solo se encarga de publicar la librería como paquete npm
- Para cambios en `packages/forms/`, el workspace dependency se resolverá automáticamente durante el build de Vercel

---

## 🌐 Despliegue en Vercel

Despliega la aplicación demo Next.js en Vercel. La aplicación utiliza **Server-Side Rendering (SSR)** y requiere una base de datos para funcionar.

### 🔄 Cómo Funciona la Detección de Cambios

**Vercel está conectado a TODO tu repositorio**, pero solo despliega `apps/next-host-demo/`. Esto es lo que necesitas saber:

- ✅ **Vercel monitorea el repositorio completo** - Cada push a GitHub es detectado
- ✅ **Analiza qué archivos cambiaron** - Compara el commit anterior con el actual
- ✅ **Despliega si hay cambios relevantes** - En `apps/next-host-demo/` o `packages/forms/`
- ✅ **Ignora cambios irrelevantes** - Con "Ignore Build Step" configurado

**Ejemplo de flujo:**

```
1. Haces push a GitHub
   git push origin main

2. Vercel detecta el push
   → Analiza archivos modificados

3. Evalúa si hacer build
   → ¿Cambios en apps/next-host-demo/? → SÍ → Build
   → ¿Cambios en packages/forms/? → SÍ → Build
   → ¿Solo docs/README? → NO → Ignora

4. Si hay cambios relevantes
   → Instala dependencias (pnpm install)
   → Build de apps/next-host-demo
   → Despliega automáticamente
```

### Prerrequisitos

- Repositorio Git en GitHub
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Base de datos configurada (Turso recomendado para producción)
- Node.js >= 20 y pnpm >= 9

### Paso 1: Preparar el Repositorio

1. **Asegúrate de que tu código esté en GitHub**:

```powershell
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Paso 2: Conectar Repositorio a Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New Project"** o **"Import Project"**
3. Importa tu repositorio `formEngine_lpc` desde GitHub
4. Autoriza a Vercel para acceder a tu repositorio si es necesario

### Paso 3: Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Next.js. Configura lo siguiente:

**Framework Preset:** Next.js (detectado automáticamente)

**Root Directory:** `apps/next-host-demo`

⚠️ **Importante:** Con el Root Directory configurado, Vercel monitoreará TODO el repositorio pero solo desplegará cuando detecte cambios relevantes en:

- `apps/next-host-demo/` (siempre)
- `packages/forms/` (dependencia del workspace)
- Archivos raíz que afecten la configuración (pnpm-workspace.yaml, package.json, etc.)

**Build Command:**

```bash
cd ../.. && pnpm install && cd apps/next-host-demo && pnpm prisma:generate && pnpm build
```

**Output Directory:** `.next` (default de Next.js)

**Install Command:**

```bash
pnpm install
```

**Node Version:** 20.x o superior

**Package Manager:** pnpm

### Paso 4: Configurar Variables de Entorno

En Vercel Dashboard → Tu Proyecto → Settings → Environment Variables, agrega:

#### Variables Requeridas

```bash
# Base de datos (Turso o PostgreSQL)
DATABASE_URL=libsql://formengine-demo-[username].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSI...

# Seguridad
JWT_SECRET=production-secret-change-this-to-random-string-min-32-chars
API_KEY=production-api-key-change-this

# URL de la aplicación
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

⚠️ **IMPORTANTE:**

- Marca todas las variables para **Production**, **Preview** y **Development** según necesites
- Genera secrets seguros para producción (no uses los valores de ejemplo)
- El `JWT_SECRET` debe tener al menos 32 caracteres

#### Configuración de Base de Datos

**Opción A: Turso (SQLite en la nube - Recomendado)**

1. Crea una cuenta en [Turso](https://turso.tech)
2. Instala el CLI de Turso:

```powershell
# Windows
irm https://get.tur.so/install.ps1 | iex

# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

3. Crea la base de datos:

```powershell
turso auth login
turso db create formengine-demo
turso db show formengine-demo --url
turso db tokens create formengine-demo
```

4. Aplica el schema:

```powershell
cd apps/next-host-demo
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." pnpm prisma db push
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." pnpm db:seed
```

**Opción B: PostgreSQL**

Configura una base de datos PostgreSQL y actualiza `DATABASE_URL` con la cadena de conexión.

### Paso 5: Configurar Build Settings y Detección de Cambios

#### Configuración de Build (Opcional)

Si necesitas configuraciones adicionales, crea `apps/next-host-demo/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm install && cd apps/next-host-demo && pnpm prisma:generate && pnpm build",
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "outputDirectory": ".next"
}
```

#### Optimizar Detección de Cambios en Monorepo (Implementado)

Se ha incluido un archivo `vercel.json` en `apps/next-host-demo/vercel.json` con la configuración necesaria:

```json
{
  "git": {
    "ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
  }
}
```

Esto asegura que Vercel **solo** despliegue cuando hay cambios dentro de `apps/next-host-demo`.

**Nota:** Si deseas que cambios en `packages/forms` también disparen el despliegue de la app, deberás modificar este comando o eliminarlo, pero la configuración actual aísla los despliegues como se solicitó.

### Paso 6: Deploy

1. Click en **"Deploy"** en Vercel Dashboard
2. Espera a que el build complete (típicamente 2-4 minutos)
3. Vercel te proporcionará una URL única: `https://your-app.vercel.app`

### Paso 7: Verificar el Despliegue

#### 1. Verificar API Routes

```bash
# Reemplaza con tu URL de Vercel
curl https://your-app.vercel.app/api/brokers
curl https://your-app.vercel.app/api/insurers
curl https://your-app.vercel.app/api/plans
```

#### 2. Probar Formularios

1. Ve a `https://your-app.vercel.app/quote/health`
2. Completa el formulario de cotización
3. Envía el formulario → Debería guardarse en la base de datos

#### 3. Verificar Datos en Base de Datos

Si usas Turso:

```bash
turso db shell formengine-demo
SELECT COUNT(*) FROM Quote;
SELECT * FROM Quote ORDER BY createdAt DESC LIMIT 1;
```

### Detección de Cambios en Monorepo

**¿Cómo detecta Vercel los cambios?**

Vercel está conectado a tu **repositorio completo** de GitHub. Con el **Root Directory** configurado en `apps/next-host-demo`, el comportamiento es:

1. **Vercel monitorea TODO el repositorio** - Cada push a la rama configurada es detectado
2. **Analiza qué cambió** - Compara los archivos modificados en el commit
3. **Decide si hacer build** - Basado en qué archivos cambiaron

#### Cambios que triggeran despliegue automático:

✅ **Cambios en `apps/next-host-demo/`** - Siempre triggeran despliegue

```powershell
# Ejemplo: Modificar una página
git add apps/next-host-demo/src/app/page.tsx
git commit -m "Update home page"
git push origin main
# → Vercel detecta y despliega automáticamente
```

✅ **Cambios en `packages/forms/`** - Triggeran despliegue (dependencia del workspace)

⚠️ **Importante:** Cuando cambias `packages/forms/`, tienes dos opciones:

**Opción A: Build manual antes del push** (Recomendado para cambios grandes)

```powershell
# 1. Hacer cambios en packages/forms
# 2. Build de la librería
cd packages/forms
pnpm build
cd ../..

# 3. Commit y push
git add packages/forms
git commit -m "feat: improve claim form"
git push origin main
# → Vercel detecta los cambios, reinstala dependencias y despliega
```

**Opción B: Dejar que Vercel lo compile** (Para cambios pequeños)

```powershell
# 1. Hacer cambios en packages/forms
git add packages/forms/src/forms/ClaimForm.tsx
git commit -m "feat: improve claim form"
git push origin main

# → Vercel detecta cambios, durante el build ejecutará:
#    - pnpm install (resuelve workspace dependencies)
#    - Build de packages/forms automáticamente
#    - Build de apps/next-host-demo
#    - Despliega
```

**Nota:** Con el build command configurado (`cd ../.. && pnpm install && cd apps/next-host-demo && pnpm build`), Vercel automáticamente:

1.  Instala todas las dependencias del workspace (incluyendo `packages/forms`)
2.  Si `packages/forms` tiene cambios en el código fuente, pnpm los incluirá en el build
3.  La app se build con la versión más reciente de `packages/forms`

⚠️ **Cambios en archivos raíz** - Pueden triggerar despliegue

- `pnpm-workspace.yaml` - Cambios en workspace config
- `package.json` (raíz) - Cambios en configuración del monorepo
- `.npmrc` - Cambios en configuración de npm

❌ **Cambios que NO deberían triggerar despliegue:**

- `docs/` - Solo documentación
- `README.md` - Solo documentación
- `.github/workflows/` - Solo CI/CD (a menos que afecte el build)

#### Optimización con Ignore Build Step (Recomendado)

Para evitar despliegues innecesarios cuando solo cambias documentación, configura **Ignore Build Step** en:

**Vercel Dashboard → Settings → Git → Ignore Build Step**

**Opción 1: Script simple**

```bash
git diff --name-only HEAD^ HEAD | grep -qE "(apps/next-host-demo|packages/forms)" || exit 0; exit 1
```

**Opción 2: Script más detallado** (crear `.vercelignore-build.sh` en la raíz)

```bash
#!/bin/bash
# Ignorar builds cuando solo hay cambios irrelevantes

CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null || echo "")

if [ -z "$CHANGED_FILES" ]; then
  exit 1  # Si no hay cambios detectados, hacer build por seguridad
fi

# Si hay cambios en apps/next-host-demo, hacer build
if echo "$CHANGED_FILES" | grep -q "apps/next-host-demo"; then
  exit 1
fi

# Si hay cambios en packages/forms (dependencia), hacer build
if echo "$CHANGED_FILES" | grep -q "packages/forms"; then
  exit 1
fi

# Si hay cambios en archivos raíz relevantes, hacer build
if echo "$CHANGED_FILES" | grep -qE "(pnpm-workspace.yaml|package.json|\.npmrc)"; then
  exit 1
fi

# Si solo hay cambios en docs, README, etc., ignorar build
if echo "$CHANGED_FILES" | grep -qE "^docs/|^README|^\.github/|^LICENSE"; then
  exit 0
fi

# Por defecto, hacer build
exit 1
```

Y en **Ignore Build Step** del Dashboard:

```bash
bash .vercelignore-build.sh
```

### Actualizaciones Automáticas

**Vercel maneja automáticamente los despliegues** cuando conectas tu repositorio. No necesitas configurar GitHub Actions para el despliegue de la demo.

#### Flujo de Detección Automática

Vercel funciona de la siguiente manera:

1. **Conectado al repositorio completo** - Vercel tiene acceso a todo tu repo de GitHub
2. **Monitorea todos los pushes** - Cada commit a la rama configurada es evaluado
3. **Detecta cambios relevantes** - Basado en qué archivos cambiaron (ver sección anterior)
4. **Despliega automáticamente** - Si hay cambios relevantes, ejecuta el build y despliega

#### Ejemplos de Flujos de Despliegue

**Caso 1: Cambios solo en la app (`apps/next-host-demo/`)**

```powershell
# Modificar archivo en la app
git add apps/next-host-demo/src/app/page.tsx
git commit -m "feat: update home page"
git push origin main

# → Vercel detecta cambios en apps/next-host-demo/
# → Ejecuta build de la app
# → Despliega automáticamente
```

**Caso 2: Cambios en la librería (`packages/forms/`)**

```powershell
# Opción A: Build manual antes del push (Recomendado)
cd packages/forms
pnpm build  # Compilar la librería
cd ../..
git add packages/forms
git commit -m "feat: improve claim form"
git push origin main

# Opción B: Dejar que Vercel lo compile
git add packages/forms/src/forms/ClaimForm.tsx
git commit -m "feat: improve claim form"
git push origin main

# → Vercel detecta cambios en packages/forms/
# → Durante el build, pnpm install resuelve el workspace
# → El código fuente de packages/forms se usa directamente (workspace:*)
# → Build de apps/next-host-demo incluye los cambios
# → Despliega automáticamente
```

**⚠️ Nota importante sobre `packages/forms/`:**

Con `workspace:*` en `package.json`, pnpm usa el código fuente directamente del workspace, no el build de `dist/`. Esto significa:

- ✅ **No necesitas** hacer `pnpm build` antes del push
- ✅ Vercel compilará automáticamente durante el build
- ✅ Los cambios se reflejan inmediatamente en el despliegue

**Caso 3: Cambios solo en documentación**

```powershell
# Solo cambiar docs
git add docs/INSTALLATION.md
git commit -m "docs: update installation guide"
git push origin main

# → Con "Ignore Build Step" configurado, Vercel ignora el build
# → No se despliega (ahorra recursos)
```

#### Resumen del Proceso

```
Push a GitHub
    ↓
Vercel detecta el push
    ↓
Evalúa "Ignore Build Step" (si está configurado)
    ↓
¿Hay cambios relevantes? → NO → Ignora build
    ↓ SÍ
Ejecuta Install Command (pnpm install desde raíz)
    ↓
Ejecuta Build Command (build de apps/next-host-demo)
    ↓
Despliega a producción o preview
```

**Nota:** El despliegue automático de Vercel es independiente de GitHub Actions. Solo necesitas conectar tu repositorio en el dashboard de Vercel y los despliegues ocurrirán automáticamente.

### Preview Deployments

Cada Pull Request creará automáticamente un ambiente preview con URL única:

```
https://your-app-git-branch-name.vercel.app
```

Esto permite probar cambios antes de mergear a producción.

### Personalizar el Dominio (Opcional)

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Domains**
2. Click en **Add Domain**
3. Ingresa tu dominio (ej: `formengine.tudominio.com`)
4. Sigue las instrucciones de Vercel para configurar DNS
5. Actualiza `NEXT_PUBLIC_APP_URL` en variables de entorno con tu dominio personalizado

### Monitoreo y Analytics

Vercel proporciona herramientas integradas:

- **Analytics**: Métricas de tráfico y performance
- **Speed Insights**: Core Web Vitals
- **Logs**: Logs de errores y requests en tiempo real
- **Function Logs**: Logs específicos de API routes

Accede desde el Dashboard de Vercel → Tu Proyecto → **Analytics** o **Logs**

---

## ❌ Solución de Problemas

### Error: 401 Unauthorized (GitHub Packages)

- Verifica que el token sea válido
- Verifica que el token tenga permisos `write:packages`
- Verifica que el `.npmrc` esté configurado correctamente

### Error: 404 Not Found (GitHub Packages)

- Verifica que el nombre del paquete incluya tu usuario: `@YOUR_USERNAME/form-engine`
- Verifica que el repositorio exista

### Error: Package already exists

- Incrementa la versión en `package.json`
- No puedes publicar la misma versión dos veces

### Build falla en Vercel

**Error: "Cannot find module '@jonathanludena/forms'"**

**Causa:** Dependencia del workspace no se resuelve en el monorepo.

**Solución:**

- Asegúrate de que el build command incluya el install desde la raíz:

```bash
cd ../.. && pnpm install && cd apps/next-host-demo && pnpm build
```

- O configura el Root Directory como la raíz del monorepo y ajusta el build command

**Error: "Prisma Client not generated"**

**Causa:** `prisma generate` no se ejecutó durante el build.

**Solución:**

1. Agrega `prisma:generate` al build command:

```bash
cd ../.. && pnpm install && cd apps/next-host-demo && pnpm prisma:generate && pnpm build
```

2. O agrega un script postinstall en `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

**Error: "DATABASE_URL is not defined"**

**Causa:** Variables de entorno no configuradas en Vercel.

**Solución:**

1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega todas las variables requeridas
3. Asegúrate de marcarlas para el ambiente correcto (Production/Preview/Development)
4. Vuelve a hacer deploy

### Error de conexión a base de datos

**Error: "Connection refused" o "Authentication failed"**

**Solución:**

- Verifica que `DATABASE_URL` y `TURSO_AUTH_TOKEN` estén configuradas correctamente
- Si usas Turso, verifica que el token sea válido y tenga los permisos correctos
- Verifica que la base de datos esté accesible desde la región de Vercel

### Página en blanco o errores 500

**Solución:**

1. Revisa los logs en Vercel Dashboard → Deployments → [Tu deploy] → Functions
2. Verifica la consola del navegador para errores del cliente
3. Verifica que todas las variables de entorno estén configuradas
4. Revisa que Prisma Client esté generado correctamente

### API Routes no funcionan

**Solución:**

- Verifica que las rutas estén en `apps/next-host-demo/src/app/api/`
- Verifica los logs de funciones en Vercel Dashboard
- Asegúrate de que las dependencias estén instaladas correctamente

## 📚 Recursos Adicionales

- [Documentación oficial de GitHub Packages](https://docs.github.com/en/packages)
- [Working with npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js Deployment en Vercel](https://nextjs.org/docs/deployment)
- [Turso Documentation](https://docs.turso.tech)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 📄 Licencia

MIT
