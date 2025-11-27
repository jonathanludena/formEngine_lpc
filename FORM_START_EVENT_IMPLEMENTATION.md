# Implementación de Estructura de Datos para evento `form:start`

## Resumen

Se ha corregido la implementación para que cada formulario reciba la estructura de datos completa según lo especificado, incluyendo `initialData` con información del asegurado.

## Estructura de Datos del Evento `form:start`

Cada formulario ahora recibe la siguiente estructura:

```typescript
interface FormStartDetail<T = unknown> {
  brand: string; // ID del broker (ej: 'LPC001')
  feature: 'claim' | 'quote' | 'collection';
  insurance: 'vehicule' | 'health' | 'life' | 'life_savings';
  onSubmit?: (data: T) => void | Promise<void>; // Opcional para compatibilidad
  initialData?: Partial<T>; // Datos pre-poblados del asegurado
}
```

## Cambios Implementados

### 1. Schema de Base de Datos

**Archivo**: `apps/next-host-demo/prisma/schema.prisma`

- **Modelo `Insured` mejorado**:
  - Agregado `planId` para relación con el plan contratado
  - Agregado `premium` (prima mensual)
  - Campos específicos por tipo de seguro: `vehicleDetails`, `healthDetails`, `lifeDetails`
  - Relación con `Dependent[]`

- **Nuevo modelo `Dependent`**:
  - Gestiona dependientes (cónyuge, hijos, padres)
  - Campos: `relationship`, `firstName`, `lastName`, `birthDate`, `gender`, etc.
  - Relación con `Insured`

### 2. Seeds de Datos

**Archivo**: `apps/next-host-demo/prisma/seed.ts`

Se agregaron seeds realistas del contexto ecuatoriano:

#### Clientes (3 ejemplos)

- **Juan Pérez González** (Quito, Pichincha)
- **María Rodríguez Salazar** (Guayaquil, Guayas)
- **Carlos Morales Castro** (Cuenca, Azuay)

#### Asegurados (3 pólizas)

- **POL-HEALTH-001**: Seguro de salud familiar para Juan Pérez
  - Plan: Salud Familiar ($150/mes)
  - Cobertura: $50,000
  - 3 dependientes: cónyuge Ana y 2 hijos (Sofía y Diego)
- **POL-VEHICLE-001**: Seguro vehicular para María Rodríguez
  - Plan: Vehicular Premium ($450/mes)
  - Vehículo: Toyota Corolla 2020
  - Cobertura: Todo riesgo
- **POL-LIFE-001**: Seguro de vida para Carlos Morales
  - Plan: Vida Segura ($120/mes)
  - Cobertura: $100,000
  - 2 dependientes/beneficiarios

### 3. Helpers para Datos del Asegurado

**Archivo**: `apps/next-host-demo/src/lib/insured-data.ts`

Funciones auxiliares creadas:

```typescript
// Obtener datos completos del asegurado por número de póliza
async function getInsuredData(policyNumber: string);

// Obtener cliente por número de identificación
async function getCustomerByIdentification(identificationNumber: string);

// Formatear datos para formularios de claim
function formatInsuredDataForClaim(insured: any);

// Formatear datos para formularios de quote
function formatCustomerDataForQuote(customer: any);
```

### 4. API Endpoint

**Archivo**: `apps/next-host-demo/src/app/api/insured/[policyNumber]/route.ts`

Endpoint para obtener datos del asegurado:

```
GET /api/insured/{policyNumber}
```

Retorna:

- Datos del cliente
- Datos de la póliza y plan
- Detalles específicos del seguro (vehículo, salud, vida)
- Lista de dependientes activos

### 5. Páginas Actualizadas

Se actualizaron las páginas de ejemplo para demostrar el uso correcto:

#### `claim/health/page.tsx`

```typescript
// Carga datos de POL-HEALTH-001
const config: FormStartDetail = {
  brand: 'LPC001',
  feature: 'claim',
  insurance: 'health',
  initialData: {
    // Datos del titular
    firstName: 'Juan',
    lastName: 'Pérez González',
    email: 'juan.perez@example.com',
    phone: '+593-99-123-4567',

    // Datos de la póliza
    policyNumber: 'POL-HEALTH-001',
    planName: 'Plan Salud Familiar',
    insurer: 'Liberty Seguros Ecuador',

    // Cobertura
    healthCoverage: {
      coverageAmount: 50000,
      deductible: 500,
      // ...
    },

    // Dependientes
    dependents: [
      { firstName: 'Ana', lastName: 'Martínez López', relationship: 'spouse' },
      { firstName: 'Sofía', lastName: 'Pérez Martínez', relationship: 'child' },
      { firstName: 'Diego', lastName: 'Pérez Martínez', relationship: 'child' },
    ],
  },
};
```

#### `claim/vehicle/page.tsx`

```typescript
// Carga datos de POL-VEHICLE-001
const config: FormStartDetail = {
  brand: 'LPC001',
  feature: 'claim',
  insurance: 'vehicule',
  initialData: {
    // Datos del titular
    firstName: 'María',
    lastName: 'Rodríguez Salazar',

    // Datos de la póliza
    policyNumber: 'POL-VEHICLE-001',

    // Datos del vehículo
    vehicleDetails: {
      plate: 'GYE-1234',
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      insuredValue: 25000,
      // ...
    },
  },
};
```

## Flujo de Datos Completo

### Para Claims (Reclamos)

1. **Usuario autenticado** → Sistema identifica su `policyNumber`
2. **Página carga** → Llama a `/api/insured/{policyNumber}`
3. **API retorna** → Datos del asegurado + póliza + dependientes
4. **Config se construye** → Con `initialData` pre-poblada
5. **FormHostShell recibe** → Config completo
6. **Evento `form:start`** → Se dispara con toda la estructura
7. **Formulario** → Se pre-llena con los datos del asegurado

### Para Quotes (Cotizaciones)

1. **Usuario nuevo/existente** → Puede o no tener datos previos
2. **Si existe cliente** → Se cargan datos básicos (nombre, email, etc.)
3. **initialData** → Puede estar vacía o con datos básicos
4. **Usuario completa** → Información adicional requerida para cotizar

## Ejemplo de Uso Real

```typescript
'use client';

import { useState, useEffect } from 'react';
import { FormHostShell } from '@/components/organisms/FormHostShell';
import type { FormStartDetail } from '@jonathanludena/forms';

export default function ClaimPage() {
  const [config, setConfig] = useState<FormStartDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      // Obtener policyNumber del usuario autenticado
      const userPolicy = await getCurrentUserPolicy();

      // Cargar datos del asegurado
      const response = await fetch(`/api/insured/${userPolicy}`);
      const { data } = await response.json();

      // Construir configuración con initialData
      setConfig({
        brand: 'LPC001',
        feature: 'claim',
        insurance: data.insuranceType,
        initialData: {
          // Datos pre-poblados del asegurado
          ...formatInsuredData(data),
        },
      });
    }

    loadData();
  }, []);

  // ... resto del componente
}
```

## Beneficios

1. ✅ **Estructura correcta**: Cumple con la especificación del evento `form:start`
2. ✅ **Pre-llenado inteligente**: Formularios se cargan con datos del asegurado
3. ✅ **Mejor UX**: Usuario no tiene que re-ingresar información conocida
4. ✅ **Datos relacionados**: Incluye dependientes, coberturas, y detalles del plan
5. ✅ **Flexible**: `initialData` es opcional, funciona con usuarios nuevos
6. ✅ **Type-safe**: TypeScript garantiza estructura correcta

## Próximos Pasos Sugeridos

1. Implementar autenticación real para obtener `policyNumber` del usuario
2. Actualizar componentes de formulario para utilizar `initialData`
3. Agregar validación de que los datos pre-poblados no se puedan modificar (campos readonly)
4. Implementar lógica similar para formularios de Quote
5. Agregar más tipos de seguros (life, life_savings)
