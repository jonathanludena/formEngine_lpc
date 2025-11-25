# 📦 Instalación y Uso como Dependencia

## 🎯 Descripción

`@lpc/form-engine` es una librería React compilada con **Vite + Rollup** que exporta formularios dinámicos de cotización y reclamos para seguros.

## ✅ Características del Build

- ✅ **ESM + CommonJS**: Soporta ambos formatos (`index.js` y `index.cjs`)
- ✅ **Tree-shaking**: Importa solo lo que uses
- ✅ **TypeScript**: Declaraciones de tipos incluidas (`index.d.ts`)
- ✅ **Sourcemaps**: Para debugging en desarrollo
- ✅ **Externalización**: Todas las dependencias externalizadas (peer dependencies)
- ✅ **Sin minificar**: Mejor debugging en desarrollo del proyecto consumidor

## 📥 Instalación

### Opción 1: NPM Registry (GitHub Packages)

```bash
# Configurar .npmrc para usar GitHub Packages
echo "@lpc:registry=https://npm.pkg.github.com" >> .npmrc

# Instalar
npm install @lpc/form-engine
```

### Opción 2: Local (Para desarrollo)

```bash
# En el proyecto formEngine_lpc
npm run build:lib
npm pack

# En tu proyecto consumidor
npm install ../formEngine_lpc/lpc-form-engine-2.0.0.tgz
```

### Opción 3: Git Direct

```bash
npm install git+https://github.com/YOUR_USERNAME/formEngine_lpc.git
```

## 📋 Dependencias Requeridas (Peer Dependencies)

Tu proyecto **DEBE** tener instaladas estas dependencias:

```json
{
  "dependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "@tanstack/react-query": "^5.62.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.454.0"
  }
}
```

## 🎨 Configuración de Tailwind CSS

La librería requiere Tailwind CSS en el proyecto consumidor:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@lpc/form-engine/dist/**/*.{js,cjs}', // ⚠️ Importante
  ],
  theme: {
    extend: {
      // Copiar las CSS variables de formEngine_lpc/tailwind.config.js
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'zoom-in': {
          from: { transform: 'scale(0.95)' },
          to: { transform: 'scale(1)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
```

## 🎨 Estilos CSS

Importar los estilos en tu `index.css` o `App.css`:

```css
/* Importar estilos de la librería */
@import '@lpc/form-engine/styles.css';

/* O copiar las CSS variables directamente */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
```

## 🚀 Uso Básico

### 1. Formulario de Cotización

```tsx
import { InsuranceQuoteForm } from '@lpc/form-engine';
import type { InsuranceType, InsuranceQuoteData } from '@lpc/form-engine';

function QuotePage() {
  const handleSubmit = (data: InsuranceQuoteData) => {
    console.log('Cotización:', data);
    // Enviar a tu API
  };

  return (
    <div className="container mx-auto py-8">
      <InsuranceQuoteForm
        insuranceType="health" // 'health' | 'vehicle' | 'life' | 'life_savings'
        brandId="lpc"
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
      />
    </div>
  );
}
```

### 2. Formulario de Reclamos

```tsx
import { ClaimForm } from '@lpc/form-engine';
import type { ClaimFormData } from '@lpc/form-engine';

function ClaimPage() {
  const handleSubmit = (data: ClaimFormData) => {
    console.log('Reclamo:', data);
    // Enviar a tu API
  };

  return (
    <div className="container mx-auto py-8">
      <ClaimForm
        insuranceType="health" // 'health' | 'vehicle'
        brandId="lpc"
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
      />
    </div>
  );
}
```

## 📚 Importaciones Disponibles

```tsx
// Componentes principales
import { InsuranceQuoteForm, ClaimForm } from '@lpc/form-engine';

// Tipos TypeScript
import type {
  InsuranceType,
  InsuranceQuoteData,
  ClaimFormData,
  HealthQuoteData,
  VehicleQuoteData,
  BrandConfig,
} from '@lpc/form-engine';

// Hooks
import { useInsuranceForm, useClaimForm } from '@lpc/form-engine';

// Componentes UI (si necesitas usarlos directamente)
import { Button, Input, Select, Checkbox, Dialog, Sheet, Card } from '@lpc/form-engine';
```

## 🔧 Configuración Avanzada

### QueryClient Provider (Requerido)

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InsuranceQuoteForm } from '@lpc/form-engine';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InsuranceQuoteForm insuranceType="health" brandId="lpc" onSubmit={console.log} />
    </QueryClientProvider>
  );
}
```

### React Router (Si usas routing)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InsuranceQuoteForm, ClaimForm } from '@lpc/form-engine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/quote"
          element={
            <InsuranceQuoteForm insuranceType="health" brandId="lpc" onSubmit={console.log} />
          }
        />
        <Route
          path="/claim"
          element={<ClaimForm insuranceType="health" brandId="lpc" onSubmit={console.log} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
```

## 📊 Tree-shaking

La librería soporta tree-shaking automático. Solo se incluirá en tu bundle lo que importes:

```tsx
// ❌ Importar todo (no recomendado)
import * as FormEngine from '@lpc/form-engine';

// ✅ Importar solo lo necesario (recomendado)
import { InsuranceQuoteForm } from '@lpc/form-engine';
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@lpc/form-engine'"

Verifica que está instalado:

```bash
npm list @lpc/form-engine
```

### Error: Estilos no se aplican

Asegúrate de:

1. Importar `@lpc/form-engine/styles.css`
2. Configurar Tailwind CSS con el content path correcto
3. Copiar las CSS variables

### Error: "Module not found: Can't resolve 'react'"

Instala las peer dependencies:

```bash
npm install react react-dom react-hook-form zod @hookform/resolvers @tanstack/react-query
```

### Error: TypeScript no encuentra los tipos

Verifica que `dist/index.d.ts` existe:

```bash
ls node_modules/@lpc/form-engine/dist/
```

Si falta, reconstruye la librería:

```bash
cd formEngine_lpc
npm run build:lib
```

## 📦 Estructura del Paquete

```
@lpc/form-engine/
├── dist/
│   ├── index.js          # ESM (import)
│   ├── index.cjs         # CommonJS (require)
│   ├── index.d.ts        # TypeScript declarations
│   ├── index.js.map      # Sourcemap ESM
│   ├── index.cjs.map     # Sourcemap CJS
│   └── style.css         # Estilos (opcional)
├── package.json
└── README.md
```

## 🚀 Build Local para Testing

```bash
# 1. En formEngine_lpc
npm run build:lib
npm pack  # Genera lpc-form-engine-2.0.0.tgz

# 2. En tu proyecto
npm install ../path/to/lpc-form-engine-2.0.0.tgz

# 3. Importar y usar
import { InsuranceQuoteForm } from '@lpc/form-engine';
```

## 📝 Notas Importantes

1. **React 18+**: La librería requiere React 18 o superior
2. **Tailwind CSS**: Debe estar configurado en el proyecto consumidor
3. **CSS Variables**: Copiar las variables de tema para estilos correctos
4. **QueryClient**: Wrap tu app con `QueryClientProvider`
5. **No incluye CSS automático**: Debes importar manualmente `styles.css` o configurar Tailwind
6. **Versiones fijas**: Todas las dependencias usan versiones fijas (sin `^`)

## 🔗 Links Útiles

- **Documentación completa**: [docs/API.md](./API.md)
- **Migración v1→v2**: [docs/MIGRATION.md](./MIGRATION.md)
- **Refactor v2**: [docs/REFACTOR_V2.md](./REFACTOR_V2.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

## 📄 Licencia

MIT
