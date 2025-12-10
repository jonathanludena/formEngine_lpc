# Flujo de Envío y Cierre de Formulario de Reclamos

## 📋 Resumen

Después de un envío exitoso del formulario de reclamos, el sistema:

1. **Incluye el token (`tk`)** en el payload para validación de sesión en el webhook
2. **Envía datos al webhook** que procesa el reclamo y maneja la comunicación con el usuario
3. **Al recibir 200 OK**: Elimina cookie del token y desmonta el formulario mostrando mensaje de éxito
4. **Al recibir otro código**: Muestra mensaje de servicio no disponible

## 🔄 Flujo de Eventos

```
┌─────────────────────┐
│  Usuario envía form │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│  form:submit (data)     │
│  + tk (token de sesión) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Host procesa submit              │
│ - Incluye tk en payload          │
│ - Envía a /api/claims            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ API reenvía al webhook externo  │
│ - Payload completo + tk          │
│ - Header: x-routara-key          │
└──────────┬──────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Webhook procesa reclamo:             │
│ - Valida sesión con tk               │
│ - Guarda archivos y datos            │
│ - Cierra sesión en Redis             │
│ - Envía mensaje al usuario vía chat  │
└──────────┬───────────────────────────┘
           │
           ▼
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐    ┌────────────────┐
│ 200 OK │    │ Otro código    │
└────┬───┘    └────┬───────────┘
     │             │
     ▼             ▼
┌─────────────────────────────┐  ┌──────────────────────────┐
│ - Elimina cookie tk         │  │ Muestra mensaje:         │
│ - Desmonta formulario       │  │ "Servicio no disponible" │
│ - Muestra mensaje de éxito  │  │ "Intenta más tarde"      │
│ - Bloquea nuevas acciones   │  └──────────────────────────┘
└─────────────────────────────┘
```

## 🎯 Implementación

### 1. Token en Query Params

El token (`tk`) se recibe como query parameter y se mantiene durante la sesión del formulario:

```typescript
// apps/next-host-demo/src/app/claim/health/page.tsx
function ClaimHealthContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('tk') || null;
  // ...
}
```

### 2. Inclusión del Token en el Payload

Al enviar el formulario, el token se incluye en el payload:

```typescript
// apps/next-host-demo/src/app/claim/health/page.tsx
async function handleSubmit(data: unknown) {
  try {
    // Incluir el token en el payload
    const payload = {
      ...data,
      tk: token,
    };

    const response = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // ... resto del código
  }
}
```

### 3. Manejo de Respuesta del Webhook

Según la respuesta, se toman diferentes acciones:

```typescript
// Respuesta 200 OK - Éxito
if (response.ok) {
  // Eliminar cookie del token para prevenir reuso
  if (token) {
    document.cookie = `claim_tk=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  // Marcar como enviado para desmontar el formulario
  setIsSubmitted(true);
  setSuccessMessage(result.message || '¡Reclamo registrado exitosamente!');

  return {
    ok: true,
    message: result.message,
    resultId: result.data?.id,
  };
}

// Respuesta diferente a 200 - Error
if (!response.ok) {
  setIsServiceUnavailable(true);
  return {
    ok: false,
    error: 'Servicio no disponible',
  };
}
```

### 4. Estados de UI

El componente maneja tres estados visuales:

```typescript
// Estado 1: Formulario activo (inicial)
if (!isSubmitted && !isServiceUnavailable) {
  return <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />;
}

// Estado 2: Éxito - Formulario desmontado, mensaje de confirmación
if (isSubmitted) {
  return <SuccessDisplay message={successMessage} />;
}

// Estado 3: Error - Servicio no disponible
if (isServiceUnavailable) {
  return <ServiceUnavailableDisplay />;
}
```

## 🗨️ Responsabilidad del Webhook

### El Webhook Maneja la Comunicación con el Usuario

**Importante**: La aplicación `formEngine_lpc` NO es responsable de notificar al chatbot. El webhook externo maneja:

1. **Validación de sesión** usando el token (`tk`)
2. **Procesamiento y guardado** de archivos y datos del reclamo
3. **Cierre de sesión** en Redis eliminando el token
4. **Envío de mensaje al usuario** a través del sistema de chat

### Flujo en el Webhook (Externo)

```javascript
// Pseudocódigo del webhook externo
async function handleClaimSubmit(req, res) {
  const { tk, ...claimData } = req.body;

  // 1. Validar sesión con token
  const session = await redis.get(`claim:session:${tk}`);
  if (!session) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }

  // 2. Procesar y guardar archivos
  const savedFiles = await saveClaimDocuments(claimData.files);

  // 3. Guardar reclamo en base de datos
  const claim = await db.claims.create({
    ...claimData,
    documents: savedFiles,
  });

  // 4. Cerrar sesión eliminando token de Redis
  await redis.del(`claim:session:${tk}`);

  // 5. Enviar mensaje al usuario vía chat
  await chatService.sendMessage({
    userId: session.userId,
    conversationId: session.conversationId,
    message:
      `✅ ¡Reclamo registrado exitosamente!\n\n` +
      `📋 Número de reclamo: ${claim.id}\n` +
      `📧 Te enviaremos actualizaciones por email.\n\n` +
      `⏱️ Tiempo estimado: 3-5 días hábiles\n\n` +
      `¿Necesitas algo más?`,
  });

  // 6. Responder 200 OK
  return res.status(200).json({
    success: true,
    message: 'Reclamo registrado exitosamente',
    claimId: claim.id,
  });
}
```

### Payload que Recibe el Webhook

```typescript
{
  // Token de sesión (crítico para validación)
  "tk": "abc123xyz...",

  // Datos del reclamo
  "insuranceType": "health",
  "policyNumber": "POL-HEALTH-001",
  "claimType": "consultation",
  "incidentDate": "2025-12-10",
  "description": "Consulta médica de emergencia",

  // Información personal
  "personalInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "+1234567890"
  },

  // Archivos (como URLs o FormData si es multipart)
  "insurerForm": "https://...",
  "medicalPrescription": "https://...",
  // ... otros documentos
}
```

## 📱 Uso en Páginas Next.js

### Página de Reclamo con Manejo de Estados

```typescript
// apps/next-host-demo/src/app/claim/health/page.tsx
'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormHostShell } from '@/components/organisms/FormHostShell';

function ClaimHealthContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('tk') || null;
  const { config, isLoading, error } = useClaimHealthConfig(POLICY_ID_TO_LOAD);

  // Estados para controlar la UI
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(data: unknown) {
    try {
      // Incluir token en payload
      const payload = { ...data, tk: token };

      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Manejar respuesta no exitosa
      if (!response.ok) {
        setIsServiceUnavailable(true);
        return { ok: false, error: 'Servicio no disponible' };
      }

      // Éxito: Eliminar cookie y marcar como enviado
      if (token) {
        document.cookie = `claim_tk=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }

      setIsSubmitted(true);
      setSuccessMessage(result.message || '¡Reclamo registrado exitosamente!');

      return {
        ok: true,
        message: result.message,
        resultId: result.data?.id,
      };
    } catch (error) {
      setIsServiceUnavailable(true);
      return { ok: false, error: 'Error de conexión' };
    }
  }

  // Mostrar mensaje de éxito (formulario desmontado)
  if (isSubmitted) {
    return <SuccessDisplay message={successMessage} />;
  }

  // Mostrar mensaje de error
  if (isServiceUnavailable) {
    return <ServiceUnavailableDisplay />;
  }

  // Mostrar formulario
  if (isLoading) return <ClaimHealthLoading />;
  if (error || !config) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />
    </div>
  );
}

export default function ClaimHealthPage() {
  return (
    <Suspense fallback={<ClaimHealthLoading />}>
      <ClaimHealthContent />
    </Suspense>
  );
}
```

### Componentes de Mensajes

```typescript
// Mensaje de éxito después de envío
function SuccessDisplay({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          ¡Reclamo enviado exitosamente!
        </h2>
        <p className="text-green-700">{message}</p>
        <p className="text-sm text-gray-600 mt-4">
          Recibirás actualizaciones sobre tu reclamo por los canales de contacto registrados.
        </p>
      </div>
    </div>
  );
}

// Mensaje de servicio no disponible
function ServiceUnavailableDisplay() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">
          Servicio no disponible
        </h2>
        <p className="text-yellow-700 mb-4">
          Lo sentimos, el servicio de reclamos no está disponible en este momento.
        </p>
        <p className="text-sm text-gray-600">
          Por favor, intenta nuevamente más tarde o contáctanos directamente.
        </p>
      </div>
    </div>
  );
}
```

## 📊 Diagrama de Secuencia Completo

```
Usuario       Formulario       Host          API           Webhook        Redis        Chat
  |               |              |             |              |             |            |
  |--Abre URL---->|              |             |              |             |            |
  | con ?tk=xxx   |              |             |              |             |            |
  |               |              |             |              |             |            |
  |<--Renderiza---|              |             |              |             |            |
  |  formulario   |              |             |              |             |            |
  |               |              |             |              |             |            |
  |--Completa---->|              |             |              |             |            |
  |  campos       |              |             |              |             |            |
  |               |              |             |              |             |            |
  |--Click submit>|              |             |              |             |            |
  |               |              |             |              |             |            |
  |               |--form:submit->              |              |             |            |
  |               |   (data)     |             |              |             |            |
  |               |              |             |              |             |            |
  |               |              |--POST------>|              |             |            |
  |               |              | {data, tk}  |              |             |            |
  |               |              |             |              |             |            |
  |               |              |             |--POST------->|             |            |
  |               |              |             | (proxy req)  |             |            |
  |               |              |             | + tk en body |             |            |
  |               |              |             |              |             |            |
  |               |              |             |              |--Valida---->|            |
  |               |              |             |              |  sesión tk  |            |
  |               |              |             |              |             |            |
  |               |              |             |              |<--Session---|            |
  |               |              |             |              |   data OK   |            |
  |               |              |             |              |             |            |
  |               |              |             |              |--Guarda-----|            |
  |               |              |             |              | archivos y  |            |
  |               |              |             |              | datos claim |            |
  |               |              |             |              |             |            |
  |               |              |             |              |--DEL tk---->|            |
  |               |              |             |              | (cierra     |            |
  |               |              |             |              | sesión)     |            |
  |               |              |             |              |             |            |
  |               |              |             |              |--Envía mensaje---------->|
  |               |              |             |              | confirmación            |
  |               |              |             |              |             |            |
  |               |              |             |              |             |            |
  |               |              |             |<--200 OK-----|             |            |
  |               |              |             | {claimId}    |             |            |
  |               |              |             |              |             |            |
  |               |              |<--200 OK----|              |             |            |
  |               |              | {claimId}   |              |             |            |
  |               |              |             |              |             |            |
  |               |<-form:result-|             |              |             |            |
  |               |  (ok: true)  |             |              |             |            |
  |               |              |             |              |             |            |
  |               |--Elimina---->|             |              |             |            |
  |               | cookie tk    |             |              |             |            |
  |               |              |             |              |             |            |
  |               | [DESMONTA]   |             |              |             |            |
  |               |              |             |              |             |            |
  |<--Muestra mensaje de éxito---|             |              |             |            |
  | (sin más acciones)           |             |              |             |            |
  |                              |             |              |             |            |
  |<------Usuario recibe confirmación por chat------------------------------|            |
  |                              |             |              |             |            |
```

## 🔐 Seguridad con Token

### Prevención de Reuso del Token

El token se elimina de las cookies después de un envío exitoso:

```typescript
// Eliminar cookie después de 200 OK
if (token) {
  document.cookie = `claim_tk=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
```

### Validación en el Webhook

El webhook debe:

1. **Validar que el token existe** en Redis
2. **Verificar que no haya expirado**
3. **Eliminar el token después de procesarlo** (una sola vez de uso)
4. **Rechazar requests sin token o con token inválido**

```javascript
// En el webhook
const session = await redis.get(`claim:session:${tk}`);
if (!session) {
  return res.status(401).json({ error: 'Sesión inválida o expirada' });
}

// ... procesar reclamo ...

// Eliminar token (invalidar sesión)
await redis.del(`claim:session:${tk}`);
```

## 🎯 Mejores Prácticas

1. **Siempre incluye el token (`tk`)** en el payload del submit para validación de sesión

2. **El webhook maneja toda la comunicación** con el usuario, no el formulario

3. **Elimina el token de cookies** después de envío exitoso para prevenir reuso

4. **Muestra estados claros**:
   - ✅ Éxito: Mensaje de confirmación sin acciones adicionales
   - ⚠️ Error: Mensaje de servicio no disponible con opción de reintentar

5. **Testing**: Verifica que:
   - El token se incluye correctamente en el payload
   - La cookie se elimina después de éxito
   - Los estados de UI se manejan correctamente
   - El webhook recibe todos los datos necesarios
