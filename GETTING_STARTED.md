# 🚀 Inicio Rápido - Form Engine LPC

## 📦 Instalación

```powershell
# Instalar dependencias
npm install
```

## 🛠️ Comandos Disponibles

### Desarrollo

```powershell
# Iniciar servidor de desarrollo (Landing Page Demo)
npm run dev
```

Abre http://localhost:5173 en tu navegador

### Build

```powershell
# Compilar la librería para distribución
npm run build:lib

# Compilar la landing page demo
npm run build

# Preview del build
npm run preview
```

### Linting

```powershell
npm run lint
```

## 📁 Estructura del Proyecto

```
formEngine_lpc/
├── src/
│   ├── components/
│   │   ├── atoms/           # Componentes básicos (inputs, selects)
│   │   ├── molecules/       # Componentes compuestos (modals)
│   │   ├── organisms/       # Formularios completos
│   │   └── ui/             # shadcn/ui components
│   ├── lib/
│   │   ├── schemas/        # Validaciones Zod
│   │   ├── types/          # TypeScript types
│   │   ├── utils.ts        # Utilidades
│   │   └── index.ts        # Entry point de la librería
│   ├── data/
│   │   ├── copies/         # Textos por marca
│   │   └── mock/           # Datos de prueba
│   ├── pages/              # Páginas de la landing
│   ├── styles/             # Estilos globales
│   ├── App.tsx             # Aplicación principal
│   └── main.tsx            # Entry point
├── docs/                   # Documentación
├── dist/                   # Build de la librería
└── dist-demo/             # Build de la landing page
```

## 🎨 Uso de la Librería

### En tu proyecto

1. **Instalar** (una vez publicado en GitHub Packages):

```powershell
npm install @YOUR_USERNAME/form-engine
```

2. **Importar y usar**:

```tsx
import { HealthQuoteForm, VehicleQuoteForm } from '@YOUR_USERNAME/form-engine';
import '@YOUR_USERNAME/form-engine/styles.css';

function App() {
  const handleSubmit = async (data) => {
    console.log('Form data:', data);
    // Enviar a tu API
  };

  return (
    <div className="container">
      <HealthQuoteForm brand="brand_A" onSubmit={handleSubmit} />
    </div>
  );
}
```

### Opciones disponibles

#### HealthQuoteForm Props

```typescript
{
  brand?: 'brand_A' | 'brand_B' | 'default';  // Marca para copys
  onSubmit: (data: HealthQuoteData) => void;   // Callback al enviar
  initialData?: Partial<HealthQuoteData>;      // Datos iniciales
  isLoading?: boolean;                          // Estado de carga
  coverageOptions?: SelectOption[];             // Opciones de cobertura
}
```

#### VehicleQuoteForm Props

```typescript
{
  brand?: 'brand_A' | 'brand_B' | 'default';
  onSubmit: (data: VehicleQuoteData) => void;
  initialData?: Partial<VehicleQuoteData>;
  isLoading?: boolean;
  vehicleTypes?: SelectOption[];
  coverageTypes?: SelectOption[];
}
```

## 🎨 Personalización de Temas

Los formularios se adaptan al tema de tu aplicación. Define las variables CSS:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... más variables */
}
```

## 📝 Agregar Nuevos Formularios

1. **Crear schema Zod** en `src/lib/schemas/`
2. **Crear tipos TypeScript** en `src/lib/types/`
3. **Crear componente** en `src/components/organisms/`
4. **Agregar copys** en `src/data/copies/brand-copies.ts`
5. **Exportar** desde `src/lib/index.ts`

Ejemplo:

```typescript
// src/lib/schemas/life.schema.ts
export const lifeQuoteSchema = z.object({
  insuranceType: z.literal('life'),
  // ... más campos
});

// src/components/organisms/LifeQuoteForm.tsx
export const LifeQuoteForm = ({ brand, onSubmit }) => {
  // Implementación
};

// src/lib/index.ts
export { LifeQuoteForm } from '@/components/organisms/LifeQuoteForm';
```

## 🌐 Copys por Marca

Administra textos en `src/data/copies/brand-copies.ts`:

```typescript
export const brandCopies = {
  brand_A: {
    quoteForm: {
      title: 'Cotiza tu Seguro',
      fields: {
        firstName: {
          label: 'Nombre',
          placeholder: 'Ingresa tu nombre',
          error: 'El nombre es requerido',
        },
      },
    },
  },
};
```

## 🧪 Testing (Próximamente)

```powershell
# Agregar dependencias de testing
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test
```

## 📚 Documentación Completa

- [Despliegue en GitHub Packages](./docs/DEPLOY_GITHUB_PACKAGES.md)
- [Despliegue en GitHub Pages](./docs/DEPLOY_GITHUB_PAGES.md)

## 🐛 Solución de Problemas

### Error: Cannot find module 'react'

```powershell
npm install
```

### Estilos no se aplican

Asegúrate de importar el CSS:

```tsx
import '@YOUR_USERNAME/form-engine/styles.css';
```

### TypeScript errors

```powershell
# Regenerar tipos
npm run build:lib
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

MIT © LPC

## 🆘 Soporte

Para preguntas o problemas:

- Abre un Issue en GitHub
- Revisa la documentación en `/docs`
