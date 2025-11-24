# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [2.2.0] - 2024-11-24

### 🗑️ BREAKING CHANGES

- **Eliminados componentes legacy**: `HealthQuoteForm` y `VehicleQuoteForm`
  - Estos componentes ya no se usan en el proyecto
  - Usar `InsuranceQuoteForm` con la prop `insuranceType` en su lugar
  - Ejemplo: `<InsuranceQuoteForm insuranceType="health" ... />`

### 🧪 Testing

- **74 tests pasando (100%)** - Sistema de tests completo implementado
- Tests para todos los componentes atoms (FormField, FormSelect, FormTextarea, FormCheckbox)
- Tests E2E para ClaimForm e InsuranceQuoteForm
- Comandos disponibles: `npm test`, `npm run test:watch`, `npm run test:coverage`

### 📚 Documentación

- Actualizada documentación para remover referencias a componentes legacy
- Actualizado TEST_README.md con estado final de tests

---

## [2.1.0] - 2024-11-24

### ✨ Nuevas Características

- **Accordion Collapsable**: Todas las secciones de formularios ahora usan Accordions
  - Solo una sección abierta a la vez (comportamiento exclusivo)
  - Transiciones suaves con animaciones CSS
  - Mejor UX: menos scroll, más enfoque en sección activa
- **Componente Accordion exportado**: Disponible para uso en proyectos consumidores
- **Nuevo componente UI**: Accordion con Context API y animaciones

### 🔧 Mejoras

- **Build minificado**: Código minificado con esbuild para GitHub Packages
- **Sourcemaps desactivados**: Reducción de 57% en tamaño total del paquete
- **Bundle size optimizado**:
  - ESM: 82.37 KB (14.26 KB gzip)
  - CJS: 49.73 KB (11.79 KB gzip) - **45% más pequeño**
- **Mejor experiencia de navegación** en formularios largos
- **Transiciones animadas** en Accordion (300ms ease-in-out)

### 🗑️ Limpieza

- **Eliminadas páginas legacy de la landing**: `/cotizar/salud` y `/cotizar/vehiculo`
- Los componentes `HealthQuoteForm` y `VehicleQuoteForm` se mantienen exportados para retrocompatibilidad
- Landing simplificada con solo 3 rutas: Inicio, Cotizar, Reclamos

### 📚 Documentación

- Agregado `docs/CHANGES_V2.1.md` con detalles completos
- Actualizado README con info de Accordions
- Ejemplos de uso del componente Accordion

### 🎨 Componentes

**InsuranceQuoteForm con Accordions:**

- Información Personal
- Detalles del Seguro
- Beneficiarios (vida)
- Información del Vehículo

**ClaimForm con Accordions:**

- Información de la Póliza
- Datos de Contacto
- Detalles del Incidente
- Información Médica/Vehículo

### 🔄 Compatibilidad

- ✅ **100% retrocompatible** con v2.0
- ✅ No requiere cambios en código consumidor
- ✅ API pública sin cambios

## [2.0.0] - 2024-11-24

### 🚀 Cambios Importantes (Breaking Changes)

- **Eliminadas todas las dependencias de shadcn/ui y Radix UI**
  - Removidos 7 paquetes de @radix-ui
  - Removido class-variance-authority
  - Removido tailwindcss-animate
- **Todos los componentes UI reescritos con Tailwind CSS + CSS vanilla**
- **Versiones fijas en package.json** (eliminado operador `^`)
- **React 18.3.1** (versión estable mantenida)

### ✨ Nuevas Características

- **Componentes UI 100% personalizados**: Button, Input, Textarea, Label, Card, Checkbox, Select, Dialog, ScrollArea, Sheet
- **Animaciones CSS nativas**: fade-in, zoom-in, slide-in-from-\*
- **0 vulnerabilidades**: Todas las dependencias actualizadas a versiones seguras
- **Control total sobre componentes**: Sin overhead de librerías externas

### 🔧 Mejoras

- Reducción de dependencias de 33 a 24 paquetes totales
- Bundle size reducido: 264.27 kB (gzip: 53.66 kB)
- Mejor tree-shaking sin dependencias externas
- Build más rápido sin procesar código de Radix UI
- Vite actualizado a 6.4.1 (sin vulnerabilidades)

### 🐛 Correcciones

- Corregido error de TypeScript en discriminatedUnion de claim.schema
- Removida prop `asChild` no soportada en Sheet/Dialog custom
- Actualizado ref type de FormCheckbox de HTMLButtonElement a HTMLInputElement

### 📚 Documentación

- Agregado `docs/REFACTOR_V2.md` con detalles completos de cambios
- Actualizado README con nuevas dependencias
- Documentación de componentes UI personalizados

### 🔄 Migración desde v1.x

**No se requieren cambios en código de usuario**. La API pública se mantiene idéntica:

- Todos los componentes exportados funcionan igual
- Props y eventos sin cambios
- Comportamiento visual idéntico

Para actualizar:

```bash
rm -rf node_modules package-lock.json
npm install
```

## [1.0.0] - 2024-11-23

### ✨ Agregado

#### Formularios

- Formulario de cotización para Seguros de Salud
- Formulario de cotización para Seguros Vehiculares
- Validaciones en tiempo real con Zod
- Modal de Términos y Condiciones con scroll obligatorio
- Sistema de copys dinámicos por marca (brand_A, brand_B, default)

#### Componentes (Atomic Design)

- **Atoms**: FormField, FormSelect, FormTextarea, FormCheckbox
- **Molecules**: TermsModal
- **Organisms**: HealthQuoteForm, VehicleQuoteForm
- **UI Components**: Button, Input, Select, Card, Dialog, Checkbox, Label, ScrollArea, Sheet

#### Características

- Design tokens adaptables al tema del host
- Soporte multi-marca con textos personalizados
- Data mock para demostración
- Generación de cotizaciones comparativas
- Integración con TanStack Query
- Tree-shaking optimizado para bundle pequeño

#### Landing Page Demo

- Página de inicio con descripción del sistema
- Navegación con sidebar responsivo
- Integración de formularios funcionales
- Visualización de resultados de cotización
- Comparación de seguros entre aseguradoras

#### Infraestructura

- Configuración de Vite para desarrollo y producción
- Build optimizado con Rollup
- TypeScript configurado con paths aliases
- TailwindCSS con shadcn/ui
- ESLint configurado

#### Documentación

- README principal con descripción del proyecto
- GETTING_STARTED con guía de inicio rápido
- Documentación de despliegue en GitHub Packages
- Documentación de despliegue en GitHub Pages
- GitHub Actions workflow para CI/CD

#### Tipos TypeScript

- Tipos para todos los seguros (Salud, Vida, Vehículos)
- Schemas Zod con validaciones complejas
- Interfaces para formularios y datos
- Props tipados para todos los componentes

### 🔧 Configuración

- Node.js 18+
- React 18
- TypeScript 5
- Vite 5
- TailwindCSS 3
- React Hook Form 7
- Zod 3

### 📦 Distribución

- Librería compilada con tipos TypeScript
- CSS separado para importación opcional
- Formato ESM para mejor tree-shaking
- Peer dependencies correctamente configuradas

### 🎨 Diseño

- Sistema de design tokens CSS custom properties
- Tema claro y oscuro soportado
- Responsive design mobile-first
- Animaciones y transiciones suaves

---

## [Unreleased]

### 🚀 Próximas Características

- Formulario de cotización para Seguros de Vida
- Formulario de cotización para Seguros de Vida y Ahorro
- Formularios de reclamos por tipo de seguro
- Exportación de cotizaciones a PDF
- Integración con APIs reales de aseguradoras
- Tests unitarios con Vitest
- Tests e2e con Playwright
- Storybook para documentación de componentes
- Modo offline con PWA
- Soporte i18n para múltiples idiomas

### 🐛 Correcciones Planificadas

- Mejorar accesibilidad (ARIA labels)
- Optimizar performance de formularios grandes
- Agregar validación de RUC/Cédula ecuatoriana

---

## Guía de Versiones

- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH**: Corrección de bugs compatible con versiones anteriores

### Ejemplos

- `1.0.0` → `2.0.0`: Breaking changes (ej: cambio en props de componentes)
- `1.0.0` → `1.1.0`: Nuevo formulario o feature
- `1.0.0` → `1.0.1`: Bug fixes

---

[1.0.0]: https://github.com/YOUR_USERNAME/formEngine_lpc/releases/tag/v1.0.0
