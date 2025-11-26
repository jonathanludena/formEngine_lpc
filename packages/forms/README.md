# @jonathanludena/forms

Librería de formularios de seguros con comunicación basada en CustomEvents para Next.js y React.

## Características

- ✅ Formularios CSR (Client-Side Rendering only)
- ✅ Comunicación exclusiva por CustomEvents (no props)
- ✅ Tree-shaking habilitado
- ✅ TypeScript + tipos completos
- ✅ Tailwind CSS + Design Tokens
- ✅ Compatible con Next.js App Router

## Instalación

```bash
# Configura el scope de GitHub Packages en .npmrc
echo "@jonathanludena:registry=https://npm.pkg.github.com" >> .npmrc

# Instala el paquete
pnpm add @jonathanludena/forms
# o
npm install @jonathanludena/forms
```

## Uso

### 1. Importar estilos

```tsx
// En tu archivo CSS global o layout
import '@jonathanludena/forms/styles.css';
```

### 2. Dynamic Import (Next.js)

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';

const ClaimForm = dynamic(
  () => import('@jonathanludena/forms').then((mod) => ({ default: mod.ClaimForm })),
  { ssr: false }
);

export function ClaimFormWrapper() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      // Inicializar el formulario
      formRef.current.dispatchEvent(
        new CustomEvent('form:start', {
          detail: {
            brand: 'default',
            feature: 'claim',
            insurance: 'health',
            initialData: {},
          },
        })
      );

      // Escuchar el envío del formulario
      const handleSubmit = async (e: Event) => {
        const customEvent = e as CustomEvent<{ data: any }>;

        // Activar loading
        formRef.current?.dispatchEvent(
          new CustomEvent('form:submit', {
            detail: { isLoading: true },
          })
        );

        try {
          // Llamar a tu API
          const response = await fetch('/api/claims', {
            method: 'POST',
            body: JSON.stringify(customEvent.detail.data),
          });

          // Desactivar loading
          formRef.current?.dispatchEvent(
            new CustomEvent('form:submit', {
              detail: { isLoading: false },
            })
          );

          // Enviar resultado
          if (response.ok) {
            formRef.current?.dispatchEvent(
              new CustomEvent('form:result', {
                detail: {
                  ok: true,
                  message: '¡Reclamo registrado exitosamente!',
                  resultId: (await response.json()).id,
                },
              })
            );
          } else {
            throw new Error('Error en la respuesta');
          }
        } catch (error) {
          formRef.current?.dispatchEvent(
            new CustomEvent('form:result', {
              detail: {
                ok: false,
                error: 'Ocurrió un error al procesar el reclamo',
              },
            })
          );
        }
      };

      formRef.current.addEventListener('form:submit', handleSubmit);

      return () => {
        formRef.current?.removeEventListener('form:submit', handleSubmit);
      };
    }
  }, []);

  return <ClaimForm ref={formRef} />;
}
```

## Eventos CustomEvent

### form:start (Host → Form)

Inicializa el formulario con configuración.

```typescript
interface FormStartDetail<T> {
  brand: string; // 'default' | 'liberty' | 'metlife' | 'panamerican'
  feature: 'claim' | 'quote' | 'collection';
  insurance: 'vehicule' | 'health' | 'life' | 'life_savings';
  onSubmit?: (data: T) => void | Promise<void>; // Opcional
  initialData?: Partial<T>;
}
```

### form:submit (Bidireccional)

**Form → Host:** Envía datos del formulario

```typescript
interface FormSubmitDataDetail<T> {
  data: T;
}
```

**Host → Form:** Controla estado de loading

```typescript
interface FormSubmitLoadingDetail {
  isLoading: boolean;
}
```

### form:result (Host → Form)

Envía feedback del resultado.

```typescript
interface FormResultDetail {
  ok: boolean;
  message?: string;
  error?: string;
  resultId?: string;
}
```

## Formularios Disponibles

- `ClaimForm`: Registro de reclamos (health, vehicle)
- `InsuranceQuoteForm`: Cotizaciones de seguros (health, life, life_savings, vehicle)

## Tipos

```typescript
import type {
  BrandId,
  InsuranceType,
  QuoteFormData,
  HealthClaimData,
  VehicleClaimData,
  FormStartDetail,
  FormSubmitDataDetail,
  FormResultDetail,
} from '@jonathanludena/forms';
```

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Tests
pnpm test
```

## Releases

Este paquete usa [release-it](https://github.com/release-it/release-it) con [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) para versionado automático.

### Crear un Release

```bash
# Patch release (3.0.0 → 3.0.1)
pnpm release:patch

# Minor release (3.0.0 → 3.1.0)
pnpm release:minor

# Major release (3.0.0 → 4.0.0)
pnpm release:major

# O interactivo
pnpm release
```

### Formato de Commits

Sigue [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat(forms): add new field to ClaimForm"

# Bug fixes
git commit -m "fix(quote): correct validation error"

# Breaking changes
git commit -m "feat(events)!: change event detail structure"

# Con scope obligatorio
git commit -m "refactor(components): extract reusable button"
```

**Scopes disponibles:** `forms`, `claim`, `quote`, `events`, `components`, `atoms`, `molecules`, `ui`, `schemas`, `types`, `theme`, `build`, `deps`, `release`

### Proceso de Release

1. Asegúrate de estar en `main` o tu rama principal
2. Todos los cambios commiteados
3. Ejecuta `pnpm release` (o variant específica)
4. release-it:
   - Ejecuta `pnpm build` (hook before:init)
   - Genera el CHANGELOG.md automáticamente
   - Actualiza version en package.json
   - Crea git tag (`forms-v3.0.1`)
   - Hace commit y push

### Publicación a GitHub Packages

Después del release, publica manualmente:

```bash
# Login (una vez)
npm login --registry=https://npm.pkg.github.com

# Publicar
pnpm publish
```

## Licencia

MIT
