# Actualizaciones del Flujo de Envío de Reclamos

**Fecha**: 10 de diciembre de 2025

## 📋 Resumen de Cambios

Se ajustó el flujo de envío de reclamos para que el **webhook externo** sea el responsable de toda la comunicación con el usuario y el manejo de sesiones. La aplicación `formEngine_lpc` ahora actúa como un formulario simple que:

1. Incluye el token (`tk`) en el payload de envío
2. Muestra estados de éxito/error según la respuesta del webhook
3. Elimina el token de cookies después de envío exitoso
4. **NO emite eventos al chatbot** (responsabilidad del webhook)

---

## 🔄 Cambios Implementados

### 1. Token en el Payload ✅

**Archivo**: `apps/next-host-demo/src/app/claim/health/page.tsx`

Se modificó el `handleSubmit` para incluir el token recibido por query params:

```typescript
async function handleSubmit(data: unknown) {
  // Incluir el token en el payload
  const payload = {
    ...data,
    tk: token, // ← Token de sesión
  };

  const response = await fetch('/api/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // ... resto del código
}
```

**Propósito**: El webhook usa este token para:

- Validar la sesión del usuario en Redis
- Obtener contexto de la conversación
- Cerrar la sesión después de procesar el reclamo

---

### 2. Eliminación de Eventos al Chatbot ✅

**Archivos Modificados**:

- `packages/forms/src/forms/ClaimForm.tsx`
- `apps/next-host-demo/src/components/organisms/useFormHostLogic.ts`
- `apps/next-host-demo/src/components/organisms/FormHostShell.tsx`
- `apps/next-host-demo/src/components/organisms/types.ts`

**Cambios**:

- ❌ Removido evento `form:complete`
- ❌ Removido `postMessage` al parent window
- ❌ Removido callback `onComplete`
- ❌ Removido estado `isCompleted`

**Razón**: El webhook es quien envía mensajes al usuario a través del sistema de chat después de procesar el reclamo.

---

### 3. Manejo de Estados en la UI ✅

**Archivos**:

- `apps/next-host-demo/src/app/claim/health/page.tsx`
- `apps/next-host-demo/src/app/claim/vehicle/page.tsx`

Se agregaron tres estados visuales:

#### Estado 1: Formulario Activo (Inicial)

```typescript
if (!isSubmitted && !isServiceUnavailable) {
  return <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />;
}
```

#### Estado 2: Éxito (200 OK del Webhook)

```typescript
if (isSubmitted) {
  return <SuccessDisplay message={successMessage} />;
}
```

- ✅ Formulario desmontado
- ✅ Mensaje de confirmación
- ✅ Sin acciones adicionales disponibles
- ✅ Cookie del token eliminada

#### Estado 3: Error (Respuesta ≠ 200)

```typescript
if (isServiceUnavailable) {
  return <ServiceUnavailableDisplay />;
}
```

- ⚠️ Mensaje de servicio no disponible
- 💡 Sugerencia de intentar más tarde

---

### 4. Eliminación de Cookie del Token ✅

**Implementación**:

```typescript
// Respuesta 200 OK - Eliminar cookie del token
if (token) {
  document.cookie = `claim_tk=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// Marcar como enviado exitosamente
setIsSubmitted(true);
setSuccessMessage(result.message || '¡Reclamo registrado exitosamente!');
```

**Propósito**:

- Prevenir que el usuario vuelva a acceder al formulario con el mismo token
- El token ya fue invalidado por el webhook en Redis
- Seguridad adicional en el cliente

---

## 🔁 Flujo Completo

```
1. Usuario abre formulario con ?tk=xxx
   ↓
2. Completa y envía formulario
   ↓
3. handleSubmit incluye tk en payload
   ↓
4. /api/claims reenvía al webhook con tk
   ↓
5. Webhook:
   - Valida sesión con tk
   - Procesa archivos y datos
   - Guarda reclamo
   - Cierra sesión (DEL tk de Redis)
   - Envía mensaje al usuario vía chat
   - Responde 200 OK con claimId
   ↓
6. Aplicación recibe respuesta:

   SI 200 OK:
   - Elimina cookie tk
   - Desmonta formulario
   - Muestra SuccessDisplay

   SI ≠ 200:
   - Muestra ServiceUnavailableDisplay
```

---

## 📁 Archivos Modificados

### Paquete de Formularios (`packages/forms/`)

- ✏️ `src/forms/ClaimForm.tsx` - Removido evento `form:complete`
- ✏️ `src/events/types.ts` - `FormCompleteDetail` ya no se usa (puede removerse)
- ✏️ `src/events/constants.ts` - `FORM_EVENTS.COMPLETE` ya no se usa (puede removerse)

### Aplicación Host (`apps/next-host-demo/`)

- ✏️ `src/app/claim/health/page.tsx` - Manejo de estados y token
- ✏️ `src/app/claim/vehicle/page.tsx` - Manejo de estados y token
- ✏️ `src/components/organisms/useFormHostLogic.ts` - Removido listener de `form:complete`
- ✏️ `src/components/organisms/FormHostShell.tsx` - Removido prop `onComplete` y estado `isCompleted`
- ✏️ `src/components/organisms/types.ts` - Removido `onComplete` del interface

### Documentación (`docs/`)

- ✏️ `FORM_COMPLETION_FLOW.md` - Actualizado con nuevo flujo
- ✅ `CLAIMS_SUBMISSION_UPDATES.md` - Este archivo (nuevo)

---

## 🎯 Componentes de UI Agregados

### SuccessDisplay

Muestra mensaje de éxito después de envío:

```typescript
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
```

### ServiceUnavailableDisplay

Muestra mensaje cuando el servicio no está disponible:

```typescript
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

---

## 🔐 Seguridad Mejorada

### Antes

- ❌ Token permanecía en cookie después del envío
- ❌ Posible reuso del token
- ⚠️ Webhook cerraba sesión, pero cliente aún tenía token

### Ahora

- ✅ Token se elimina de cookie al recibir 200 OK
- ✅ Prevención de reuso del token en cliente
- ✅ Doble validación: Redis (webhook) + Cookie (cliente)
- ✅ Usuario no puede volver a acceder al formulario

---

## 📡 Responsabilidades Claras

### Aplicación formEngine_lpc

- ✅ Renderizar formulario
- ✅ Validar datos (Zod)
- ✅ Incluir token en payload
- ✅ Mostrar estados de UI (éxito/error)
- ✅ Eliminar cookie del token
- ❌ NO notifica al chatbot
- ❌ NO maneja sesiones
- ❌ NO procesa archivos

### Webhook Externo

- ✅ Validar sesión con token
- ✅ Procesar y guardar archivos
- ✅ Guardar reclamo en base de datos
- ✅ Cerrar sesión en Redis (DEL token)
- ✅ Enviar mensaje al usuario vía chat
- ✅ Responder con resultado del procesamiento

---

## ✅ Verificación

Para verificar que todo funciona correctamente:

1. **Compilación sin errores**:

   ```bash
   npm run build
   ```

   ✅ No errors found

2. **Token en payload**:
   - Verificar en DevTools → Network que el payload incluye `tk`

3. **Eliminación de cookie**:
   - Verificar en DevTools → Application → Cookies que `claim_tk` se elimina después de éxito

4. **Estados de UI**:
   - Probar respuesta 200 → Debe mostrar `SuccessDisplay`
   - Probar respuesta ≠ 200 → Debe mostrar `ServiceUnavailableDisplay`

5. **Webhook recibe token**:
   - Verificar logs del webhook que recibe `tk` en el body

---

## 🚀 Próximos Pasos

1. **Testing integración con webhook real**
2. **Validar flujo completo end-to-end**
3. **Considerar agregar analytics** para tracking de envíos exitosos/fallidos
4. **Revisar tiempos de timeout** en la llamada al webhook

---

## 📚 Documentación Relacionada

- `docs/FORM_COMPLETION_FLOW.md` - Flujo completo actualizado
- `docs/CLAIMS_ARCHITECTURE.md` - Arquitectura del sistema de reclamos
- `docs/CLAIMS_API_IMPROVEMENTS.md` - Mejoras en la API de reclamos

---

**Nota**: Este cambio simplifica significativamente la arquitectura del formulario y centraliza toda la lógica de negocio en el webhook externo, que es quien tiene el contexto completo de la conversación con el usuario.
