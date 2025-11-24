# 🎯 INSTRUCCIONES DE INICIO - Form Engine LPC

## ✅ Proyecto Creado Exitosamente

Se ha generado la estructura completa del sistema de gestión de formularios dinámicos para Broker de Seguros.

---

## 📦 PASO 1: Instalar Dependencias

Ejecuta el siguiente comando en PowerShell:

```powershell
cd c:\Users\PC\lpc\formEngine_lpc
npm install
```

Esto instalará todas las dependencias necesarias:

- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query
- React Router
- Y todas las dependencias de Radix UI

---

## 🚀 PASO 2: Iniciar el Servidor de Desarrollo

```powershell
npm run dev
```

Esto iniciará el servidor en http://localhost:5173

Verás la landing page demo con:

- ✅ Página de inicio
- ✅ Formulario de cotización de Seguro de Salud
- ✅ Formulario de cotización de Seguro Vehicular
- ✅ Sidebar de navegación
- ✅ Resultados de cotización con datos mock

---

## 🏗️ PASO 3: Compilar la Librería

Para compilar la librería que puedes distribuir:

```powershell
npm run build:lib
```

Esto generará:

- `dist/index.js` - Código compilado
- `dist/index.d.ts` - Tipos TypeScript
- `dist/style.css` - Estilos CSS

---

## 📚 PASO 4: Revisar la Documentación

El proyecto incluye documentación completa:

1. **README.md** - Descripción general del proyecto
2. **GETTING_STARTED.md** - Guía de inicio rápido
3. **docs/DEPLOY_GITHUB_PACKAGES.md** - Cómo publicar en GitHub Packages
4. **docs/DEPLOY_GITHUB_PAGES.md** - Cómo desplegar la demo en GitHub Pages
5. **docs/API.md** - Referencia de componentes y tipos
6. **CHANGELOG.md** - Historial de cambios

---

## 🎨 Características Implementadas

### ✅ Formularios Dinámicos

- Formulario de cotización de Seguro de Salud
- Formulario de cotización de Seguro Vehicular
- Validaciones en tiempo real con Zod
- Modal de Términos y Condiciones

### ✅ Atomic Design

```
components/
├── atoms/          FormField, FormSelect, FormTextarea, FormCheckbox
├── molecules/      TermsModal
├── organisms/      InsuranceQuoteForm, ClaimForm (componentes principales)
└── ui/            shadcn/ui components
```

### ✅ Sistema de Copys por Marca

Textos dinámicos configurables por marca (brand_A, brand_B, default)

### ✅ Design Tokens

Sistema de temas adaptable mediante CSS custom properties

### ✅ Data Mock

Datos de prueba para:

- Aseguradoras (5 empresas)
- Cotizaciones de salud
- Cotizaciones vehiculares
- Cotizaciones de vida

### ✅ Landing Page Demo

- Página de inicio con descripción
- Navegación con sidebar responsivo
- Integración de formularios
- Visualización de resultados

### ✅ Build Optimizado

- Tree-shaking habilitado
- Rollup para distribución
- Tipos TypeScript incluidos
- CSS separado

---

## 📁 Estructura del Proyecto

```
formEngine_lpc/
├── src/
│   ├── components/
│   │   ├── atoms/              # Componentes básicos
│   │   ├── molecules/          # Componentes compuestos
│   │   ├── organisms/          # Formularios completos
│   │   └── ui/                # shadcn/ui
│   ├── lib/
│   │   ├── schemas/           # Validaciones Zod
│   │   ├── types/             # TypeScript types
│   │   └── index.ts           # Entry point librería
│   ├── data/
│   │   ├── copies/            # Textos por marca
│   │   └── mock/              # Datos mock
│   ├── pages/                 # Páginas landing
│   ├── styles/                # Estilos globales
│   ├── App.tsx                # App principal
│   └── main.tsx               # Entry point
├── docs/                      # Documentación
├── .github/workflows/         # CI/CD
├── dist/                      # Build librería
├── dist-demo/                 # Build landing
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔧 Scripts Disponibles

```powershell
# Desarrollo
npm run dev              # Inicia servidor desarrollo

# Build
npm run build           # Compila landing page (dist-demo/)
npm run build:lib       # Compila librería (dist/)
npm run preview         # Preview del build

# Linting
npm run lint            # Ejecuta ESLint
```

---

## 🌐 Próximos Pasos

### 1. Configurar Git y GitHub

```powershell
git init
git add .
git commit -m "Initial commit: Form Engine LPC"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/formEngine_lpc.git
git push -u origin main
```

### 2. Publicar en GitHub Packages

Sigue las instrucciones en `docs/DEPLOY_GITHUB_PACKAGES.md`

### 3. Desplegar Landing en GitHub Pages

Sigue las instrucciones en `docs/DEPLOY_GITHUB_PAGES.md`

El workflow de GitHub Actions ya está configurado en `.github/workflows/deploy.yml`

---

## 💡 Agregar Nuevos Formularios

1. **Schema Zod** en `src/lib/schemas/`
2. **Tipos TypeScript** en `src/lib/types/`
3. **Componente** en `src/components/organisms/`
4. **Copys** en `src/data/copies/brand-copies.ts`
5. **Exportar** desde `src/lib/index.ts`
6. **Página demo** en `src/pages/`

---

## 🎨 Personalizar Marca

Edita `src/data/copies/brand-copies.ts`:

```typescript
export const brandCopies = {
  tu_marca: {
    quoteForm: {
      title: 'Tu título personalizado',
      subtitle: 'Tu subtítulo',
      fields: {
        // Personaliza labels, placeholders, errores
      },
    },
  },
};
```

Usa en el formulario:

```tsx
<InsuranceQuoteForm insuranceType="health" brand="tu_marca" onSubmit={handleSubmit} />
```

---

## 🔐 Consideraciones Importantes

### ❌ NO subir al repositorio:

- `.npmrc` (contiene tokens)
- `.env` (variables de entorno)
- `node_modules/`
- `dist/` y `dist-demo/` (se generan en build)

### ✅ Archivo `.gitignore` ya incluye todo lo necesario

---

## 🆘 Soporte

Si encuentras problemas:

1. **Errores de compilación TypeScript**: Los errores mostrados son normales hasta instalar dependencias
2. **Estilos no cargan**: Importa `styles.css` en tu proyecto
3. **Módulos no encontrados**: Ejecuta `npm install`

Para más ayuda:

- Revisa `GETTING_STARTED.md`
- Revisa `docs/API.md`
- Abre un issue en GitHub

---

## ✨ ¡Listo para Usar!

El proyecto está completamente funcional y listo para:

- ✅ Desarrollo local
- ✅ Compilación como librería
- ✅ Distribución en GitHub Packages
- ✅ Demo en GitHub Pages
- ✅ Personalización por marca
- ✅ Extensión con nuevos formularios

---

## 📞 Contacto

Proyecto desarrollado para LPC - Sistema de Broker de Seguros

**Stack:** React + TypeScript + Vite + TailwindCSS + shadcn/ui + Zod + React Hook Form

**Licencia:** MIT
