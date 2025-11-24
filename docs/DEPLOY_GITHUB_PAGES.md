# 🌐 Despliegue en GitHub Pages

Esta guía te ayudará a desplegar la landing page demo de los formularios en GitHub Pages paso a paso.

## 📋 Prerrequisitos

- Repositorio Git en GitHub
- Node.js y npm instalados
- El proyecto debe estar en la rama `main`

## 🔧 Paso 1: Configurar Vite para GitHub Pages

La configuración de `vite.config.ts` ya está preparada para producción con `base: './'`, lo que permite que funcione en cualquier subdirectorio.

Si tu repositorio se llama `formEngine_lpc`, la URL final será:
```
https://YOUR_USERNAME.github.io/formEngine_lpc/
```

## 🏗️ Paso 2: Compilar el Proyecto

```powershell
# Instalar dependencias (si aún no lo has hecho)
npm install

# Compilar la aplicación demo
npm run build
```

Esto genera el directorio `dist-demo/` con todos los archivos estáticos listos para desplegar.

## 📁 Paso 3: Configurar GitHub Pages

### Opción A: Usar GitHub Actions (Recomendado)

1. **Crear directorio de workflows**:
```powershell
mkdir -p .github/workflows
```

2. **Crear archivo `.github/workflows/deploy.yml`**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist-demo'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Hacer commit y push**:
```powershell
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

4. **Habilitar GitHub Pages en el repositorio**:
   - Ve a tu repositorio en GitHub
   - Click en **Settings** (⚙️)
   - En el menú lateral, click en **Pages**
   - En **Source**, selecciona **GitHub Actions**
   - Click en **Save**

5. **Esperar el despliegue**:
   - Ve a la pestaña **Actions** en tu repositorio
   - Verás el workflow "Deploy to GitHub Pages" ejecutándose
   - Cuando termine (✅), tu sitio estará disponible

### Opción B: Despliegue Manual con gh-pages

1. **Instalar el paquete gh-pages**:
```powershell
npm install --save-dev gh-pages
```

2. **Agregar scripts a package.json**:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist-demo"
  }
}
```

3. **Desplegar**:
```powershell
npm run deploy
```

4. **Habilitar GitHub Pages**:
   - Ve a **Settings** → **Pages**
   - En **Source**, selecciona la rama `gh-pages`
   - Click en **Save**

## ✅ Paso 4: Verificar el Despliegue

1. Una vez completado el despliegue, GitHub te mostrará la URL:
```
🌐 Your site is published at https://YOUR_USERNAME.github.io/formEngine_lpc/
```

2. Visita la URL y verifica que todo funcione correctamente:
   - ✅ La página de inicio carga correctamente
   - ✅ El menú lateral (sidebar) funciona
   - ✅ Los formularios se muestran
   - ✅ Las validaciones funcionan
   - ✅ Los estilos se aplican correctamente

## 🔄 Actualizaciones Automáticas

### Con GitHub Actions (Opción A)
Cada vez que hagas push a la rama `main`, el sitio se actualizará automáticamente:

```powershell
# Hacer cambios
git add .
git commit -m "Update forms"
git push origin main

# GitHub Actions se encarga del resto
```

### Con gh-pages (Opción B)
Debes ejecutar manualmente:

```powershell
npm run deploy
```

## 🎨 Personalizar el Dominio (Opcional)

Si quieres usar un dominio personalizado:

1. **Agregar archivo `CNAME`** en la carpeta `public/`:
```
formengine.tudominio.com
```

2. **Configurar DNS** en tu proveedor de dominio:
   - Tipo: `CNAME`
   - Nombre: `formengine` (o el subdominio que quieras)
   - Valor: `YOUR_USERNAME.github.io`

3. **Configurar en GitHub**:
   - **Settings** → **Pages**
   - En **Custom domain**, ingresa: `formengine.tudominio.com`
   - ✅ Enforce HTTPS

## 📊 Añadir Google Analytics (Opcional)

1. **Crear cuenta en Google Analytics**: https://analytics.google.com

2. **Agregar el script en `index.html`**:
```html
<head>
  <!-- ... otros tags ... -->
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

Reemplaza `G-XXXXXXXXXX` con tu ID de medición.

## 🔒 Consideraciones de Seguridad

### Variables de Entorno
Si necesitas usar API keys o tokens:

1. **Nunca incluyas secrets en el código**

2. **Usa GitHub Secrets**:
   - **Settings** → **Secrets and variables** → **Actions**
   - Click en **New repository secret**
   - Agregar: `VITE_API_KEY`

3. **Usar en el workflow**:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

4. **Acceder en el código**:
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

## ❌ Solución de Problemas

### Página en blanco
- Verifica que `base: './'` esté en `vite.config.ts`
- Verifica que los archivos estén en `dist-demo/`
- Revisa la consola del navegador para errores

### Estilos no cargan
- Verifica que `styles.css` esté importado en `main.tsx`
- Verifica que TailwindCSS esté configurado correctamente

### 404 en rutas
- GitHub Pages no soporta client-side routing por defecto
- Solución: Usa hash routing o agrega un archivo `404.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'"></meta>
  </head>
</html>
```

Y en `main.tsx`:
```typescript
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.href) {
  history.replaceState(null, null, redirect);
}
```

### Workflow falla
- Verifica que los permisos estén configurados en Settings → Actions
- Verifica que el archivo YAML esté bien indentado
- Revisa los logs en la pestaña Actions

## 📱 Optimizaciones Adicionales

### PWA (Progressive Web App)
Instala el plugin de Vite PWA:

```powershell
npm install -D vite-plugin-pwa
```

Agrega a `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Form Engine LPC',
        short_name: 'FormEngine',
        description: 'Sistema de formularios dinámicos',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 📚 Recursos Adicionales

- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions para Pages](https://github.com/actions/deploy-pages)

## 🎉 ¡Listo!

Tu landing page demo ahora está disponible públicamente en:
```
https://YOUR_USERNAME.github.io/formEngine_lpc/
```

Comparte esta URL para mostrar tu sistema de formularios dinámicos. 🚀
