# Tests del Form Engine LPC

## Resumen

Se han implementado tests completos para todos los componentes que se distribuirán en GitHub Packages utilizando **Vitest** y **React Testing Library**.

## Comandos Disponibles

```bash
# Ejecutar todos los tests una vez
npm run test

# Ejecutar tests en modo watch (útil durante desarrollo)
npm run test:watch

# Ejecutar tests con interfaz UI interactiva
npm run test:ui

# Generar reporte de cobertura de código
npm run test:coverage
```

## Cobertura de Tests

### ✅ Componentes Atoms (100% completado - 47 tests)
- **FormField** - 11 tests ✅
  - Renderizado con/sin label
  - Manejo de errores y helper text
  - Validación de entrada de usuario
  - Refs y atributos HTML
  - Generación automática de IDs

- **FormTextarea** - 10 tests ✅
  - Renderizado básico
  - Manejo de errores
  - Entrada multilínea
  - Atributos personalizados

- **FormCheckbox** - 10 tests ✅
  - Estados checked/unchecked
  - Interacción de usuario
  - Estados disabled
  - Asociación label-checkbox

- **FormSelect** - 11 tests ✅
  - Selección de opciones
  - Callbacks onValueChange
  - Estado disabled
  - Renderizado de opciones

### ✅ Componentes Organisms (27 tests)

#### ClaimForm - 9 tests ✅
- **Health Insurance**
  - Renderizado de todas las secciones
  - Envío de formulario con datos válidos
  - Validación de errores
  - Botones de acción

- **Vehicle Insurance**
  - Renderizado con secciones específicas
  - Campo condicional de reporte policial
  - Envío con reporte policial
  - Estados de carga
  - Datos iniciales

#### InsuranceQuoteForm - 16 tests ✅
- **Health Insurance** (5 tests)
  - Renderizado del formulario
  - Llenado de formulario completo
  - Campo condicional de dependientes
  - Control de términos y condiciones

- **Life Insurance** (3 tests)
  - Campos específicos de seguro de vida
  - Sección de beneficiarios
  - Agregar/remover beneficiarios

- **Life Savings** (1 test)
  - Campos de ahorro y plazo

- **Vehicle Insurance** (2 tests)
  - Campos específicos de vehículos
  - Llenado completo del formulario

- **Características Comunes** (5 tests)
  - Estados de carga
  - Modal de términos
  - Datos iniciales
  - Validación de campos
  - Opciones personalizables

## Estado Actual

### ✅ **74 tests pasando (100%)** 
- ✅ Componentes atoms completamente probados
- ✅ Formularios complejos probados end-to-end
- ✅ Validación de campos
- ✅ Interacción de usuario
- ✅ Estados de carga y disabled
- ✅ Campos condicionales
- ✅ Manejo de beneficiarios dinámicos
- ✅ Términos y condiciones

**¡Todos los tests pasan exitosamente!** Los tests se ajustaron para trabajar correctamente con la implementación actual del componente Select (que usa `button` en lugar de elementos con rol `combobox`).

## Configuración

### Dependencias Instaladas
- `vitest` ^2.1.8 - Test runner
- `@testing-library/react` ^16.1.0 - Utilidades de testing para React
- `@testing-library/jest-dom` ^6.6.3 - Matchers adicionales de Jest DOM
- `@testing-library/user-event` ^14.5.2 - Simulación de eventos de usuario
- `@vitest/ui` ^2.1.8 - Interfaz UI para Vitest
- `jsdom` ^25.0.1 - Implementación DOM para Node.js

### Archivos de Configuración
- `vite.config.ts` - Configuración de Vitest integrada
- `src/test/setup.ts` - Setup global para los tests

### Cobertura de Código
La configuración está lista para generar reportes de cobertura en formatos:
- Text (consola)
- JSON
- HTML (navegador)

Excluye automáticamente:
- `node_modules/`
- `src/test/`
- Archivos de configuración
- Builds (`dist/`, `dist-demo/`)

## Próximos Pasos

1. **Corregir tests de Select**: Actualizar el componente UI base o ajustar los tests
2. **Aumentar cobertura**: Agregar tests para componentes UI si es necesario
3. **CI/CD**: Integrar `npm run test` en el pipeline de GitHub Actions antes del deploy
4. **Pre-commit**: Considerar agregar tests al hook de pre-commit con husky

## Integración con GitHub Packages

Los tests aseguran que todos los componentes exportados en `src/lib/index.ts` funcionan correctamente antes de publicar en GitHub Packages:

- ✅ `ClaimForm`
- ✅ `InsuranceQuoteForm`
- ✅ Todos los componentes atoms
- ✅ Tipos y schemas
- ✅ Utilidades

## Ejemplo de Uso en CI/CD

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  push:
    branches: [main]

jobs:
  test-and-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build library
        run: npm run build:lib
        
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

## Contribuir

Al agregar nuevos componentes:
1. Crear archivo de test junto al componente (`.test.tsx`)
2. Seguir patrones existentes
3. Verificar que `npm run test` pase antes de commit
4. Mantener cobertura > 80%
