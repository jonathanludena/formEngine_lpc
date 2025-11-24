# 📦 Despliegue en GitHub Packages

Esta guía te ayudará a publicar la librería `@lpc/form-engine` en GitHub Packages paso a paso.

## 📋 Prerrequisitos

- Repositorio Git configurado en GitHub
- Node.js y npm instalados
- Token de GitHub con permisos de escritura en packages

## 🔧 Paso 1: Configurar el Repositorio

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

## 🔑 Paso 2: Crear Token de Acceso Personal

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

## 🔐 Paso 3: Configurar NPM con GitHub Packages

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

## 📝 Paso 4: Actualizar package.json

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

## 🏗️ Paso 5: Compilar la Librería

```powershell
# Instalar dependencias
npm install

# Compilar la librería
npm run build:lib
```

Esto generará el directorio `dist/` con los archivos compilados.

## 🚀 Paso 6: Publicar el Paquete

```powershell
npm publish
```

Si todo está configurado correctamente, verás algo como:
```
+ @YOUR_USERNAME/form-engine@1.0.0
```

## ✅ Paso 7: Verificar la Publicación

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Packages** (derecha)
3. Deberías ver `form-engine` listado

O visita directamente:
```
https://github.com/YOUR_USERNAME?tab=packages
```

## 📥 Instalar el Paquete en Otro Proyecto

### Configuración del proyecto consumidor

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
      <InsuranceQuoteForm 
        insuranceType="health"
        brand="brand_A" 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}
```

## 🔄 Actualizar Versiones

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

## 🔧 Automatización con GitHub Actions (Opcional)

Crea `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          
      - run: npm ci
      - run: npm run build:lib
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Con esto, cada vez que crees un **Release** en GitHub, se publicará automáticamente.

## ❌ Solución de Problemas

### Error: 401 Unauthorized
- Verifica que el token sea válido
- Verifica que el token tenga permisos `write:packages`
- Verifica que el `.npmrc` esté configurado correctamente

### Error: 404 Not Found
- Verifica que el nombre del paquete incluya tu usuario: `@YOUR_USERNAME/form-engine`
- Verifica que el repositorio exista

### Error: Package already exists
- Incrementa la versión en `package.json`
- No puedes publicar la misma versión dos veces

## 📚 Recursos Adicionales

- [Documentación oficial de GitHub Packages](https://docs.github.com/en/packages)
- [Working with npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
