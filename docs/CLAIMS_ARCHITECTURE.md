# Arquitectura del Sistema de Reclamos

## 📐 Visión General

Este documento describe la arquitectura del flujo de reclamos, donde **esta aplicación actúa como intermediario** entre el frontend y un webhook externo que procesa los datos y archivos.

## 🔄 Flujo de Datos

```
┌─────────────────┐
│   Frontend      │
│   (Form + Files)│
└────────┬────────┘
         │ POST FormData
         │ (datos + archivos binarios)
         ▼
┌─────────────────────────┐
│  /api/claims (Proxy)    │
│  - Valida URL webhook   │
│  - Reenvía FormData     │
│  - Agrega headers auth  │
└────────┬────────────────┘
         │ Forward Request
         │ x-routara-key: xxx
         │ X-Source: formEngine
         ▼
┌─────────────────────────────────┐
│  Webhook Externo                │
│  (Fuera del contexto de #file:next-host-demo)
│  - Extrae archivos              │
│  - Valida y sube a cloud        │
│  - Crea claim en su DB          │
│  - Envía notificaciones         │
└────────┬────────────────────────┘
         │ Response
         │ { claimId, message }
         ▼
┌─────────────────┐
│  /api/claims    │
│  Retorna result │
└────────┬────────┘
         │ JSON Response
         ▼
┌─────────────────┐
│   Frontend      │
│   Muestra éxito │
└─────────────────┘
```

## 🎯 Responsabilidades

### Esta Aplicación (formEngine)

**Endpoint: POST /api/claims**

- ✅ Recibe FormData del frontend
- ✅ Valida configuración del webhook (`WEBHOOK_CLAIM_SUBMIT_URL`)
- ✅ Reenvía request completo al webhook externo
- ✅ Agrega headers de autenticación
- ✅ Procesa y retorna respuesta del webhook
- ❌ **NO** procesa archivos
- ❌ **NO** sube archivos a cloud
- ❌ **NO** crea registros de claims

**Endpoint: GET /api/claims**

- ✅ Consulta claims almacenados localmente (si aplica)
- ✅ Filtros por customerId, policyNumber, id
- ✅ Incluye documentos asociados

### Webhook Externo

**Endpoint: Configurable via `WEBHOOK_CLAIM_SUBMIT_URL`**

- ✅ Recibe FormData completo
- ✅ Extrae y valida archivos binarios
- ✅ Sube archivos a cloud storage (S3, Azure Blob, etc.)
- ✅ Crea registro del claim en su base de datos
- ✅ Almacena URLs de archivos
- ✅ Envía notificaciones (email, SMS, etc.)
- ✅ Retorna confirmación con claimId

## 🔐 Seguridad

### Headers de Autenticación

```typescript
x-routara-key: ${ROUTARA_API_KEY}
X-Source: formEngine
```

### Variables de Entorno Requeridas

```env
# URL del webhook externo para submit de claims
WEBHOOK_CLAIM_SUBMIT_URL="https://external-service.com/api/claim-submit"

# API Key para autenticación con el webhook (header: x-routara-key)
ROUTARA_API_KEY="your-routara-api-key"
```

## 📝 Formato de Request

### Opción 1: FormData (Recomendado para archivos)

```javascript
const formData = new FormData();

// Datos textuales
formData.append('policyNumber', 'POL-12345');
formData.append('claimType', 'consultation');
formData.append('insuranceType', 'health');
formData.append(
  'personalInfo',
  JSON.stringify({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '0987654321',
  })
);

// Archivos binarios
formData.append('insurerForm', file1); // File object
formData.append('medicalPrescription', file2);
formData.append('medicalExams', file3); // Múltiples con mismo nombre
formData.append('medicalExams', file4);

// Enviar
fetch('/api/claims', {
  method: 'POST',
  body: formData, // No incluir Content-Type header
});
```

### Opción 2: JSON (Para URLs pre-procesadas)

```javascript
fetch('/api/claims', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    policyNumber: 'POL-12345',
    claimType: 'consultation',
    insuranceType: 'health',
    personalInfo: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '0987654321',
    },
    insurerForm: 'https://pre-uploaded.com/file.pdf',
    medicalPrescription: 'https://pre-uploaded.com/rx.pdf',
  }),
});
```

## 📊 Formato de Response Esperado del Webhook

### Éxito

```json
{
  "success": true,
  "claimId": "claim-uuid-789",
  "message": "Claim submitted successfully",
  "data": {
    "trackingNumber": "CLM-2025-12345",
    "estimatedProcessingTime": "3-5 business days"
  }
}
```

### Error

```json
{
  "success": false,
  "error": "Invalid file type",
  "details": {
    "field": "insurerForm",
    "message": "Only PDF files are allowed"
  }
}
```

## 🔧 Configuración del Webhook Externo

El webhook externo debe implementar:

### 1. Endpoint POST que acepta FormData

```typescript
export async function POST(request: Request) {
  const formData = await request.formData();
  // Procesar...
}
```

### 2. Validación de Autenticación

```typescript
const apiKey = request.headers.get('x-routara-key');
if (apiKey !== process.env.EXPECTED_ROUTARA_API_KEY) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 3. Extracción de Archivos

```typescript
const insurerForm = formData.get('insurerForm') as File;
const medicalExams = formData.getAll('medicalExams') as File[];
```

### 4. Validación de Archivos

```typescript
// Validar tipo MIME
if (!['application/pdf'].includes(insurerForm.type)) {
  throw new Error('Invalid file type');
}

// Validar tamaño
if (insurerForm.size > 10_000_000) {
  // 10MB
  throw new Error('File too large');
}
```

### 5. Subida a Cloud Storage

```typescript
const fileUrl = await uploadToS3(insurerForm, {
  bucket: 'claims-documents',
  key: `claims/${claimId}/insurer-form.pdf`,
  contentType: insurerForm.type,
});
```

### 6. Creación del Claim

```typescript
const claim = await db.claim.create({
  data: {
    policyNumber,
    personalInfo,
    documents: {
      create: [
        {
          type: 'insurerForm',
          url: fileUrl,
          fileName: insurerForm.name,
          fileSize: insurerForm.size,
          mimeType: insurerForm.type,
        },
      ],
    },
  },
});
```

### 7. Response Exitosa

```typescript
return Response.json({
  success: true,
  claimId: claim.id,
  message: 'Claim created successfully',
});
```

## 🧪 Testing del Flujo Completo

### 1. Configurar Variables de Entorno

```bash
# .env
WEBHOOK_CLAIM_SUBMIT_URL="https://webhook-service.com/api/claim-submit"
ROUTARA_API_KEY="test-api-key-123"
```

### 2. Test con curl (JSON)

```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-12345",
    "claimType": "consultation",
    "insuranceType": "health",
    "incidentDate": "2025-12-01",
    "description": "Test claim",
    "personalInfo": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@test.com",
      "phone": "0987654321"
    }
  }'
```

### 3. Test con curl (FormData)

```bash
curl -X POST http://localhost:3000/api/claims \
  -F "policyNumber=POL-12345" \
  -F "claimType=consultation" \
  -F "insuranceType=health" \
  -F "incidentDate=2025-12-01" \
  -F "description=Test claim" \
  -F 'personalInfo={"firstName":"Juan","lastName":"Pérez","email":"juan@test.com","phone":"0987654321"}' \
  -F "insurerForm=@/path/to/file.pdf"
```

## 📈 Monitoreo y Logs

### Logs en esta Aplicación

```typescript
// En caso de error del webhook
console.error('Webhook error:', {
  url: webhookUrl,
  status: webhookResponse.status,
  error: errorData,
});
```

### Métricas Recomendadas

- Tiempo de respuesta del webhook
- Tasa de éxito/error
- Tamaño promedio de archivos
- Tipos de claims más comunes

## 🚨 Manejo de Errores

### Errores Comunes

1. **Webhook no configurado**

   ```json
   { "error": "Webhook URL not configured" }
   ```

2. **Webhook no responde**

   ```json
   {
     "error": "Failed to submit claim to external service",
     "details": { "message": "Connection timeout" }
   }
   ```

3. **Webhook rechaza el request**
   ```json
   {
     "error": "Failed to submit claim to external service",
     "details": { "message": "Invalid file type" }
   }
   ```

### Retry Logic (Opcional)

Se puede implementar retry con exponential backoff:

```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status < 500) throw new Error('Client error');
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

## 📚 Referencias

- **Endpoint Proxy**: `apps/next-host-demo/src/app/api/claims/route.ts`
- **Schemas de Validación**: `packages/forms/src/lib/schemas/claim.schema.ts`
- **Formulario Frontend**: `packages/forms/src/forms/ClaimForm.tsx`
- **Documentación**: `docs/CLAIMS_API_IMPROVEMENTS.md`
- **Ejemplos de Uso**: `docs/CLAIMS_API_USAGE_EXAMPLES.md`
