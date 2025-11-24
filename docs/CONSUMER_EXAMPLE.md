# Ejemplo de Proyecto Consumidor

Este es un ejemplo completo de cómo usar `@lpc/form-engine` en tu proyecto.

## 📁 Estructura del Proyecto

```
my-insurance-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── pages/
        ├── QuotePage.tsx
        └── ClaimPage.tsx
```

## 📦 package.json

\`\`\`json
{
  "name": "my-insurance-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.28.0",
    "react-hook-form": "7.53.2",
    "zod": "3.23.8",
    "@hookform/resolvers": "3.9.1",
    "@tanstack/react-query": "5.62.8",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.5",
    "lucide-react": "0.454.0",
    "@lpc/form-engine": "2.0.0"
  },
  "devDependencies": {
    "@types/react": "18.3.12",
    "@types/react-dom": "18.3.1",
    "@vitejs/plugin-react": "4.3.4",
    "typescript": "5.7.2",
    "vite": "6.4.1",
    "tailwindcss": "3.4.15",
    "autoprefixer": "10.4.20",
    "postcss": "8.4.49"
  }
}
\`\`\`

## ⚙️ vite.config.ts

\`\`\`typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
\`\`\`

## 🎨 tailwind.config.js

\`\`\`javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@lpc/form-engine/dist/**/*.{js,cjs}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "zoom-in": {
          from: { transform: "scale(0.95)" },
          to: { transform: "scale(1)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
\`\`\`

## 🎨 src/index.css

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
\`\`\`

## 🚀 src/main.tsx

\`\`\`tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
\`\`\`

## 📱 src/App.tsx

\`\`\`tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import QuotePage from './pages/QuotePage';
import ClaimPage from './pages/ClaimPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4">
              <Link to="/" className="text-primary hover:underline">
                Inicio
              </Link>
              <Link to="/quote" className="text-primary hover:underline">
                Cotización
              </Link>
              <Link to="/claim" className="text-primary hover:underline">
                Reclamo
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/claim" element={<ClaimPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Mi App de Seguros</h1>
      <p className="text-muted-foreground">
        Usando @lpc/form-engine v2.0
      </p>
    </div>
  );
}

export default App;
\`\`\`

## 📄 src/pages/QuotePage.tsx

\`\`\`tsx
import { useState } from 'react';
import { InsuranceQuoteForm } from '@lpc/form-engine';
import type { InsuranceQuoteData, InsuranceType } from '@lpc/form-engine';

export default function QuotePage() {
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('health');

  const handleSubmit = async (data: InsuranceQuoteData) => {
    console.log('Cotización enviada:', data);
    
    // Simular llamada a API
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('Cotización enviada con éxito');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar cotización');
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Solicitar Cotización</h1>
        
        {/* Selector de tipo de seguro */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setInsuranceType('health')}
            className={\`px-4 py-2 rounded-md \${
              insuranceType === 'health'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }\`}
          >
            Salud
          </button>
          <button
            onClick={() => setInsuranceType('vehicle')}
            className={\`px-4 py-2 rounded-md \${
              insuranceType === 'vehicle'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }\`}
          >
            Vehículo
          </button>
          <button
            onClick={() => setInsuranceType('life')}
            className={\`px-4 py-2 rounded-md \${
              insuranceType === 'life'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }\`}
          >
            Vida
          </button>
          <button
            onClick={() => setInsuranceType('life_savings')}
            className={\`px-4 py-2 rounded-md \${
              insuranceType === 'life_savings'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }\`}
          >
            Vida y Ahorro
          </button>
        </div>
      </div>

      {/* Formulario dinámico */}
      <InsuranceQuoteForm
        insuranceType={insuranceType}
        brandId="lpc"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
\`\`\`

## 📄 src/pages/ClaimPage.tsx

\`\`\`tsx
import { useState } from 'react';
import { ClaimForm } from '@lpc/form-engine';
import type { ClaimFormData } from '@lpc/form-engine';

export default function ClaimPage() {
  const [insuranceType, setInsuranceType] = useState<'health' | 'vehicle'>('health');

  const handleSubmit = async (data: ClaimFormData) => {
    console.log('Reclamo enviado:', data);
    
    // Simular llamada a API
    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('Reclamo enviado con éxito');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar reclamo');
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Presentar Reclamo</h1>
        
        {/* Selector de tipo de seguro */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setInsuranceType('health')}
            className={\`px-4 py-2 rounded-md \${
              insuranceType === 'health'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }\`}
          >
            Reclamo Salud
          </button>
          <button
            onClick={() => setInsuranceType('vehicle')}
            className={\`px-4 py-2 rounded-md \${
              insuranceType === 'vehicle'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }\`}
          >
            Reclamo Vehículo
          </button>
        </div>
      </div>

      {/* Formulario de reclamo */}
      <ClaimForm
        insuranceType={insuranceType}
        brandId="lpc"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
\`\`\`

## 🚀 Instalación y Ejecución

\`\`\`bash
# 1. Crear proyecto
npm create vite@latest my-insurance-app -- --template react-ts
cd my-insurance-app

# 2. Instalar dependencias
npm install react react-dom react-router-dom react-hook-form zod @hookform/resolvers @tanstack/react-query clsx tailwind-merge lucide-react

# 3. Instalar @lpc/form-engine
npm install ../formEngine_lpc/lpc-form-engine-2.0.0.tgz

# 4. Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. Copiar archivos de configuración (ver arriba)

# 6. Ejecutar
npm run dev
\`\`\`

## 📊 Bundle Size Esperado

Con tree-shaking optimizado:

- **InsuranceQuoteForm solo**: ~45 kB (gzip: ~12 kB)
- **ClaimForm solo**: ~38 kB (gzip: ~10 kB)
- **Ambos formularios**: ~86 kB (gzip: ~25 kB)

## ✅ Verificación

Visita:
- http://localhost:5173/ → Página de inicio
- http://localhost:5173/quote → Formulario de cotización
- http://localhost:5173/claim → Formulario de reclamo
