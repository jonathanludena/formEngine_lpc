# 🚀 Form Engine LPC - Sistema de Gestión de Seguros

Sistema de gestión de formularios dinámicos para Broker de Seguros. Maneja seguros de **Salud**, **Vida**, **Vida y Ahorro** y **Vehículos**.

> **v2.1** - 100% libre de shadcn/ui y Radix UI. Todos los componentes creados con Tailwind CSS + CSS vanilla. 0 vulnerabilidades, versiones fijas sin `^`. **Nuevo: Accordions collapsables en formularios**.

## 📋 Características

- ✅ Formularios dinámicos con validaciones avanzadas
- ✅ **Accordions collapsables** - Una sección a la vez, mejor UX
- ✅ Cotizador de seguros con comparación
- ✅ Sistema de reclamos por tipo de seguro
- ✅ Copys dinámicos por marca
- ✅ Design tokens y temas adaptables
- ✅ Atomic Design
- ✅ Tree-shaking optimizado
- ✅ TypeScript + React + Vite
- ✅ **Componentes UI 100% personalizados** (sin dependencias externas)
- ✅ **0 vulnerabilidades de seguridad**
- ✅ **Build minificado** - 71% más pequeño que v2.0

## 🛠️ Stack Tecnológico

- **UI:** Componentes personalizados con Tailwind CSS + CSS vanilla
- **Lenguaje:** TypeScript 5.7.2
- **Framework:** React 18.3.1
- **Build:** Vite 6.4.1 + Rollup
- **Forms:** react-hook-form 7.53.2
- **Validación:** Zod 3.23.8
- **Data Fetching:** TanStack Query 5.62.8
- **Routing:** React Router 6.28.0
- **Animaciones:** CSS keyframes (sin librerías externas)

## 📦 Instalación

```bash
npm install
```

## 🏗️ Build System (Vite + Rollup)

La librería utiliza **Vite con Rollup** para generar builds optimizados:

### Build de Librería

```bash
npm run build:lib
```

**Genera:**

- `dist/index.js` - ESM (import) - 84.35 KB minificado
- `dist/index.cjs` - CommonJS (require) - 50.93 KB minificado
- `dist/index.d.ts` - TypeScript declarations
- `dist/style.css` - Estilos (opcional)

**Características:**

- ✅ **Tree-shaking**: Solo empaqueta lo que usas
- ✅ **Externalización**: React, Zod, react-hook-form como peer deps
- ✅ **Dual format**: ESM + CJS para compatibilidad
- ✅ **TypeScript**: Declaraciones generadas automáticamente
- ✅ **Minificado con esbuild**: -71% vs v2.0
- ✅ **Sin sourcemaps**: Optimizado para producción

**Bundle Size (gzip):**

- ESM: 14.26 KB
- CJS: 11.79 KB

### Build del Demo

```bash
npm run build
```

Genera `dist-demo/` con la landing page de ejemplo.

# Build del demo

npm run build

# Preview del build

npm run preview

```

## 📁 Estructura del Proyecto

```

src/
├── components/ # Atomic Design
│ ├── atoms/ # Componentes básicos
│ ├── molecules/ # Componentes compuestos
│ ├── organisms/ # Componentes complejos (formularios)
│ ├── templates/ # Layouts
│ └── ui/ # shadcn/ui components
├── lib/ # Lógica exportable
│ ├── index.ts # Entry point de la librería
│ ├── schemas/ # Schemas Zod
│ ├── types/ # TypeScript types
│ └── utils/ # Utilidades
├── hooks/ # Custom hooks
├── data/ # Mock data
├── styles/ # Estilos globales
└── pages/ # Páginas de la landing

````

## 🎨 Design Tokens

El sistema soporta temas dinámicos del host. Configura las variables CSS en tu aplicación:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... más tokens */
}
````

## 📝 Uso de la Librería

### Instalación en tu proyecto

```bash
# Opción 1: Desde paquete local
npm install ../formEngine_lpc/lpc-form-engine-2.0.0.tgz

# Opción 2: Desde GitHub Packages
npm install @lpc/form-engine

# Opción 3: Directo desde Git
npm install git+https://github.com/YOUR_USERNAME/formEngine_lpc.git
```

### Uso básico

```tsx
import { InsuranceQuoteForm, ClaimForm } from '@lpc/form-engine';
import type { InsuranceQuoteData, ClaimFormData } from '@lpc/form-engine';

// Formulario de cotización
function QuotePage() {
  const handleSubmit = (data: InsuranceQuoteData) => {
    console.log('Cotización:', data);
    // Enviar a tu API
  };

  return (
    <InsuranceQuoteForm
      insuranceType="health" // 'health' | 'life' | 'life_savings' | 'vehicle'
      brandId="lpc"
      onSubmit={handleSubmit}
      onCancel={() => window.history.back()}
    />
  );
}

// Formulario de reclamos
function ClaimPage() {
  const handleSubmit = (data: ClaimFormData) => {
    console.log('Reclamo:', data);
    // Enviar a tu API
  };

  return (
    <ClaimForm
      insuranceType="health" // 'health' | 'vehicle'
      brandId="lpc"
      onSubmit={handleSubmit}
      onCancel={() => window.history.back()}
    />
  );
}
```

**📚 Documentación completa**: Ver [docs/INSTALLATION.md](./docs/INSTALLATION.md)

## 📚 Documentación del Proyecto

La documentación está organizada en la carpeta [`docs/`](./docs/) con las siguientes guías:

### 📦 Instalación y Uso

- **[INSTALLATION.md](./docs/INSTALLATION.md)** - Guía completa de instalación, configuración y uso de la librería como dependencia, incluyendo:
  - Instalación desde diferentes fuentes (local, GitHub Packages, Git)
  - Configuración de dependencias y peer dependencies
  - Configuración de Tailwind CSS y estilos
  - Ejemplos de uso básico y avanzado
  - Proyecto consumidor completo con código fuente
  - Troubleshooting y solución de problemas

### 🏗️ Arquitectura

- **[README_MONOREPO.md](./docs/README_MONOREPO.md)** - Guía completa de la arquitectura del monorepo:
  - Estructura del proyecto
  - CustomEvents y comunicación
  - API Routes y endpoints
  - Base de datos y modelos Prisma
  - Seguridad y autenticación

### 🚀 Guías Rápidas

- **[QUICK_START.md](./docs/QUICK_START.md)** - Guía rápida de instalación y ejecución en 5 minutos

### 🚀 Despliegue

- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guía completa de despliegue que incluye:
  - **GitHub Packages**: Publicación de la librería como paquete npm
  - **GitHub Pages**: Despliegue de la landing page demo
  - Configuración de tokens y autenticación
  - Automatización con GitHub Actions
  - Solución de problemas comunes

### ✅ Verificación

- **[VERIFICATION_CHECKLIST.md](./docs/VERIFICATION_CHECKLIST.md)** - Checklist de verificación post-refactor para asegurar que todo funciona correctamente:
  - Verificación de componentes UI
  - Pruebas funcionales
  - Builds de producción
  - Seguridad y dependencias

### 📋 Archivos del Paquete

- **[packages/forms/README.md](./packages/forms/README.md)** - Documentación específica del paquete de formularios
- **[packages/forms/CHANGELOG.md](./packages/forms/CHANGELOG.md)** - Historial de cambios del paquete

## 🔧 Agregar Nuevos Formularios

1. Crear schema en `src/lib/schemas/`
2. Crear componente en `src/components/organisms/`
3. Agregar copys en `src/data/copies/`
4. Exportar desde `src/lib/index.ts`

## 📚 Copys por Marca

Los textos se manejan mediante schemas JSON:

```typescript
{
  "brand_A": {
    "quoteForm": {
      "title": "Cotiza tu seguro",
      "subtitle": "Compara y elige la mejor opción",
      "fields": {
        "name": {
          "label": "Nombre completo",
          "placeholder": "Ingresa tu nombre",
          "error": "El nombre es requerido"
        }
      }
    }
  }
}
```

## 📄 Licencia

MIT © LPC
