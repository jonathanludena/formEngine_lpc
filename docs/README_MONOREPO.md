# Insurance Forms Engine - Monorepo

Sistema completo de formularios de seguros con comunicación basada en CustomEvents, Next.js App Router, Prisma + SQLite, y autenticación JWT.

## 🏗️ Arquitectura

Este proyecto está organizado como un monorepo con pnpm workspaces:

```
formEngine_lpc/
├── packages/
│   └── forms/                    # Librería de formularios (publicable a GitHub Packages)
│       ├── src/
│       │   ├── forms/           # ClaimForm, InsuranceQuoteForm (con CustomEvents)
│       │   ├── events/          # Constantes y tipos de eventos
│       │   ├── components/      # UI components (atoms, molecules, ui)
│       │   ├── lib/             # Schemas y utilidades
│       │   └── theme/           # Design tokens CSS
│       ├── rollup.config.ts     # Configuración Rollup (ESM/CJS + tree-shaking)
│       └── package.json
│
└── apps/
    └── next-host-demo/          # Aplicación Next.js (App Router)
        ├── src/
        │   ├── app/             # Páginas y API Routes
        │   ├── components/      # Componentes del host (Atomic Design)
        │   ├── lib/             # Prisma client, auth (JWT, API key)
        │   └── middleware.ts    # Validación de tokens
        ├── prisma/
        │   ├── schema.prisma    # Modelos de datos (SQLite)
        │   └── seed.ts          # Datos de demo (Ecuador)
        └── package.json
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- pnpm >= 8

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/jonathanludena/formEngine_lpc.git
cd formEngine_lpc
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cd apps/next-host-demo
cp .env.example .env.local
```

Edita `.env.local` y ajusta las variables según sea necesario.

4. **Configurar base de datos**

```bash
cd apps/next-host-demo
pnpm prisma:generate
pnpm prisma:migrate
pnpm db:seed
```

5. **Construir el paquete de formularios**

```bash
cd ../../packages/forms
pnpm build
```

6. **Ejecutar la aplicación Next.js**

```bash
cd ../../apps/next-host-demo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Paquetes

### @jonathanludena/forms

Librería de formularios con comunicación exclusiva por CustomEvents.

**Características:**

- ✅ Formularios CSR-only (Client-Side Rendering)
- ✅ Comunicación por CustomEvents (no props)
- ✅ TypeScript + tipos completos
- ✅ Tree-shaking habilitado (Rollup)
- ✅ Compatible con Next.js App Router

**Build:**

```bash
cd packages/forms
pnpm build
```

**Publicar a GitHub Packages:**

```bash
cd packages/forms
pnpm publish
```

Ver [packages/forms/README.md](../packages/forms/README.md) para más detalles.

### next-host-demo

Aplicación de demostración en Next.js que consume la librería de formularios.

**Scripts:**

```bash
pnpm dev              # Desarrollo
pnpm build            # Build producción
pnpm start            # Servidor producción
pnpm prisma:migrate   # Ejecutar migraciones
pnpm db:seed          # Poblar base de datos
pnpm prisma:studio    # Abrir Prisma Studio
```

## 🎯 Funcionalidades

### Flujos Implementados

1. **Nuevos Clientes**
   - Cotizaciones de seguros (health, life, vehicle)
   - Registro de prospectos

2. **Clientes Existentes**
   - Registro de reclamos (health, vehicle)
   - Consulta de clientes
   - Consulta de asegurados

### API Routes

| Endpoint          | Método | Descripción               | Autenticado |
| ----------------- | ------ | ------------------------- | ----------- |
| `/api/auth/token` | POST   | Emisión de token JWT (1h) | No          |
| `/api/brokers`    | GET    | Lista de brokers          | No          |
| `/api/insurers`   | GET    | Lista de aseguradoras     | No          |
| `/api/plans`      | GET    | Lista de planes           | No          |
| `/api/quotes`     | POST   | Crear cotización          | Sí          |
| `/api/quotes`     | GET    | Consultar cotizaciones    | No          |
| `/api/claims`     | POST   | Crear reclamo             | Sí          |
| `/api/claims`     | GET    | Consultar reclamos        | No          |
| `/api/prospects`  | POST   | Crear prospecto           | Sí          |

### Datos Precargados (Ecuador)

- **Broker:** LPC Insurance Broker (demo)
- **Aseguradoras:** Liberty, MetLife, Equinoccial
- **Planes:** Salud, Vida, Vehículos
- **Vehículos:** 8 marcas, 10+ modelos
- **Ubicaciones:** 6 provincias, 10+ cantones
- **Metadata:** Ocupaciones, estados civiles, tipos de documento

## 🔐 Seguridad

### Autenticación JWT

- **Expiración:** Máximo 1 hora
- **Algoritmo:** HS256
- **Storage:** Cookie httpOnly + Secure (opcional: Authorization header)

**Ejemplo de uso:**

```typescript
// Obtener token
const response = await fetch('/api/auth/token', {
  method: 'POST',
  body: JSON.stringify({ userId: 'user123', email: 'user@example.com' }),
});

const { token } = await response.json();

// Usar token en requests protegidos
await fetch('/api/claims', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(claimData),
});
```

### API Key (Server-to-Server)

Para comunicación backend-to-backend (opcional):

```typescript
// En el servidor
fetch('https://external-api.com/endpoint', {
  headers: {
    'x-api-key': process.env.API_KEY,
  },
});
```

### Middleware

Protege automáticamente rutas POST de:

- `/api/claims`
- `/api/quotes`
- `/api/prospects`

## 🎨 CustomEvents

### Ciclo de Vida

1. **Host → Form:** `form:start`
   - Inicializa el formulario con configuración
2. **Form → Host:** `form:submit` (data)
   - El usuario envía el formulario
3. **Host → Form:** `form:submit` (isLoading: true)
   - El host activa el estado de carga
4. **Host → Form:** `form:submit` (isLoading: false)
   - El host desactiva el estado de carga
5. **Host → Form:** `form:result`
   - El host envía el resultado (success/error)

### Ejemplo de Integración

```tsx
'use client';

import { FormHostShell } from '@/components/organisms/FormHostShell';

export default function QuotePage() {
  const config = {
    brand: 'default',
    feature: 'quote',
    insurance: 'health',
  };

  const handleSubmit = async (data) => {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { ok: false, error: 'Error al procesar' };
    }

    return { ok: true, message: '¡Cotización enviada!' };
  };

  return <FormHostShell formType="quote" config={config} onSubmit={handleSubmit} />;
}
```

## 🗄️ Base de Datos

### Modelos Principales

- **Broker, Insurer, Plan:** Catálogos de negocio
- **Customer, Insured:** Gestión de clientes
- **Quote, Prospect:** Nuevos clientes
- **Claim:** Reclamos
- **Vehicle\*, Province, Canton:** Catálogos de Ecuador
- **Occupation, MaritalStatus, IdDocumentType:** Metadata

### Migraciones

```bash
cd apps/next-host-demo
pnpm prisma:migrate
```

### Resetear Base de Datos

```bash
cd apps/next-host-demo
rm prisma/dev.db
pnpm prisma:migrate
pnpm db:seed
```

## 🎨 Estilos

### Design Tokens

CSS Variables definidas en:

- `packages/forms/src/theme/tokens.css`
- `apps/next-host-demo/src/app/globals.css`

### Tailwind CSS

Configuración sincronizada entre paquetes:

- `packages/forms/tailwind.config.ts`
- `apps/next-host-demo/tailwind.config.ts`

## 🧪 Testing

```bash
# Formularios
cd packages/forms
pnpm test

# App Next.js (agregar tests según necesidad)
cd apps/next-host-demo
pnpm test
```

## 📝 Desarrollo

### Agregar un Nuevo Formulario

1. Crear componente en `packages/forms/src/forms/`
2. Implementar forwardRef y listeners de CustomEvents
3. Exportar desde `packages/forms/src/index.ts`
4. Rebuild: `pnpm build`

### Agregar un Nuevo API Route

1. Crear archivo en `apps/next-host-demo/src/app/api/[ruta]/route.ts`
2. Implementar handlers GET/POST
3. Agregar validación con Zod
4. Proteger con middleware si es necesario

### Agregar Datos al Seed

Editar `apps/next-host-demo/prisma/seed.ts` y ejecutar:

```bash
pnpm db:seed
```

## 📚 Documentación Adicional

- [QUICK_START.md](./QUICK_START.md) - Guía rápida de instalación
- [INSTALLATION.md](./INSTALLATION.md) - Instalación y uso de la librería
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue (Packages + Pages)
- [packages/forms/README.md](../packages/forms/README.md) - API de formularios

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit (conventional): `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

MIT

## 👥 Autor

LPC - Jonathan Ludeña

---

**Nota:** Este es un proyecto de demostración que ilustra las mejores prácticas de arquitectura, seguridad y comunicación entre componentes en aplicaciones Next.js modernas.
