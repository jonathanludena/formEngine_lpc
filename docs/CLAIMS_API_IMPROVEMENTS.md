# Mejoras al API de Reclamos

## 🎯 Resumen Ejecutivo

Se ha realizado una actualización completa del sistema de reclamos que incluye:

### ✅ Completado

1. **Endpoint `/api/claims` actualizado** - Actúa como proxy hacia webhook externo
2. **Flujo simplificado** - Reenvía FormData completo (datos + archivos) al webhook externo
3. **Schema de base de datos mejorado** - Nuevos campos consultables y modelo dedicado para documentos
4. **Migración aplicada** - Cambios implementados en base de datos Turso
5. **Validaciones completas** - Schemas Zod para health y vehicle claims
6. **API mejorada** - GET endpoint con filtros y detalle individual incluyendo documentos

### 🔄 Arquitectura del Flujo

```
[Frontend Form]
    ↓ (FormData con archivos binarios)
[/api/claims POST]
    ↓ (Reenvío completo)
[Webhook Externo]
    ↓ (Procesa archivos, sube a cloud, crea claim)
[Response]
    ↓
[Frontend]
```

**Responsabilidades:**

- **Esta aplicación**: Solo reenvía el FormData completo al webhook
- **Webhook externo**: Procesa archivos, sube a cloud storage, crea registros en BD

---

## Resumen de Cambios

Se ha actualizado el endpoint `/api/claims` para considerar **TODOS** los campos del formulario de reclamos, incluyendo los nuevos campos de archivos adjuntos (documentos e imágenes), y se ha mejorado el schema de Prisma con:

- **Campos específicos consultables** en el modelo `Claim`
- **Nuevo modelo `ClaimDocument`** para gestión de archivos adjuntos
- **Índices optimizados** para mejorar el rendimiento de consultas

## Campos Ahora Considerados

### Campos Comunes (Health & Vehicle)

- ✅ `policyNumber` - Número de póliza
- ✅ `dependentId` - ID del dependiente (si el reclamo es para un dependiente)
- ✅ `claimType` - Tipo de reclamo
- ✅ `insuranceType` - Tipo de seguro (health/vehicle)
- ✅ `incidentDate` - Fecha del incidente
- ✅ `description` - Descripción del reclamo
- ✅ `personalInfo` - Información de contacto (firstName, lastName, email, phone)
- ✅ `insurerForm` - Formulario de aseguradora (archivo)

### Campos Específicos de Salud (Health Claims)

- ✅ `medicalCenterId` - ID del centro médico
- ✅ `diagnosis` - Diagnóstico médico
- ✅ `totalAmount` - Monto total del reclamo
- ✅ `medicalPrescription` - Receta médica (archivo)
- ✅ `medicalDiagnosis` - Diagnóstico del médico (archivo)
- ✅ `medicalExams` - Exámenes de salud (múltiples archivos)
- ✅ `medicineInvoice` - Factura de medicinas (archivo)
- ✅ `medicalAppointmentInvoice` - Factura de cita médica (archivo)

### Campos Específicos de Vehículo (Vehicle Claims)

- ✅ `vehiclePlate` - Placa del vehículo asegurado
- ✅ `location` - Ubicación del incidente
- ✅ `policeReport` - ¿Existe reporte policial? (boolean)
- ✅ `policeReportNumber` - Número de reporte policial
- ✅ `estimatedDamage` - Daño estimado en USD
- ✅ `thirdPartyPlate` - Placa del vehículo del tercero
- ✅ `thirdPartyName` - Nombre del tercero afectado
- ✅ `insuredVehiclePhotos` - Fotos del vehículo asegurado (múltiples archivos)
- ✅ `thirdPartyPropertyPhotos` - Fotos del bien del tercero (múltiples archivos)
- ✅ `affectedPersonPhoto` - Foto de la persona afectada (archivo)
- ✅ `insuredLicensePhoto` - Foto de licencia del asegurado (archivo)
- ✅ `thirdPartyLicensePhoto` - Foto de licencia del tercero (archivo)
- ✅ `thirdPartyRegistrationPhoto` - Foto de matrícula del tercero (archivo)
- ✅ `thirdPartyIdPhoto` - Foto de identificación del tercero (archivo)

## Almacenamiento de Datos

### Base de Datos

#### Modelo `Claim` (Mejorado)

Los datos se almacenan en el modelo `Claim` con los siguientes campos principales:

- `customerId` - Referencia al cliente
- `dependentId` - ID del dependiente (si el reclamo es para un dependiente)
- `policyNumber` - Número de póliza
- `claimType` - Tipo de reclamo
- `insuranceType` - Tipo de seguro
- `incidentDate` - Fecha del incidente
- `description` - Descripción
- `claimData` - JSON string con campos adicionales del formulario
- `estimatedAmount` - Monto estimado (extraído de `totalAmount` para health o `estimatedDamage` para vehicle)
- **Campos específicos de Health** (para consultas optimizadas):
  - `medicalCenterId` - ID del centro médico
  - `diagnosis` - Diagnóstico médico
- **Campos específicos de Vehicle** (para consultas optimizadas):
  - `vehiclePlate` - Placa del vehículo asegurado
  - `location` - Ubicación del incidente
  - `policeReportNumber` - Número de reporte policial
  - `hasThirdParty` - Indica si hay terceros involucrados
  - `thirdPartyName` - Nombre del tercero afectado

#### Modelo `ClaimDocument` (Nuevo)

Tabla dedicada para almacenar los documentos adjuntos al reclamo:

- `id` - ID único del documento
- `claimId` - Referencia al reclamo (con DELETE CASCADE)
- `documentType` - Tipo de documento (insurerForm, medicalPrescription, insuredVehiclePhoto_1, etc.)
- `fileName` - Nombre del archivo
- `fileUrl` - URL o path donde está almacenado el archivo
- `fileSize` - Tamaño del archivo en bytes
- `mimeType` - Tipo MIME (image/jpeg, application/pdf, etc.)
- `uploadedAt` - Fecha de subida

**Ventajas del nuevo modelo:**

- ✅ Consultas más eficientes (índices en campos clave)
- ✅ Gestión separada de documentos adjuntos
- ✅ Fácil recuperación de archivos por tipo
- ✅ Eliminación en cascada de documentos al borrar un claim
- ✅ Posibilidad de agregar metadatos adicionales a los archivos

### Estructura de claimData (JSON)

Ahora solo contiene datos adicionales que no están en columnas específicas:

```json
{
  "personalInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "0987654321"
  },

  // Para Health Claims:
  "totalAmount": 1500.0,

  // Para Vehicle Claims:
  "policeReport": true,
  "estimatedDamage": 5000.0,
  "thirdPartyPlate": "XYZ-5678"
}
```

### Estructura de Documentos en ClaimDocument

Los archivos se almacenan en registros separados:

```json
[
  {
    "id": "doc-uuid-1",
    "claimId": "claim-uuid",
    "documentType": "insurerForm",
    "fileName": "formulario-aseguradora.pdf",
    "fileUrl": "https://storage.example.com/claims/claim-uuid/insurerForm.pdf",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "uploadedAt": "2025-12-10T10:30:00Z"
  },
  {
    "id": "doc-uuid-2",
    "claimId": "claim-uuid",
    "documentType": "medicalPrescription",
    "fileName": "receta-medica.jpg",
    "fileUrl": "https://storage.example.com/claims/claim-uuid/prescription.jpg",
    "fileSize": 256000,
    "mimeType": "image/jpeg",
    "uploadedAt": "2025-12-10T10:31:00Z"
  },
  {
    "id": "doc-uuid-3",
    "claimId": "claim-uuid",
    "documentType": "medicalExam_1",
    "fileName": "examen-sangre.pdf",
    "fileUrl": "https://storage.example.com/claims/claim-uuid/exam1.pdf",
    "fileSize": 1048576,
    "mimeType": "application/pdf",
    "uploadedAt": "2025-12-10T10:32:00Z"
  }
]
```

## ✅ Mejoras Implementadas al Schema de Prisma

### Cambios Aplicados en la Base de Datos

#### 1. Modelo `Claim` Mejorado

Se agregaron campos específicos para mejorar las consultas y el rendimiento:

- `dependentId` - Relacionar reclamos con dependientes
- `medicalCenterId` - Centro médico (health claims)
- `diagnosis` - Diagnóstico médico (health claims)
- `vehiclePlate` - Placa del vehículo (vehicle claims)
- `location` - Ubicación del incidente (vehicle claims)
- `policeReportNumber` - Número de reporte policial (vehicle claims)
- `hasThirdParty` - Indicador de terceros involucrados (vehicle claims)
- `thirdPartyName` - Nombre del tercero (vehicle claims)

**Índices agregados** para mejorar el rendimiento:

- `policyNumber`, `customerId`, `insurerId`, `status`, `claimType`, `incidentDate`

#### 2. Nuevo Modelo `ClaimDocument`

Tabla dedicada para gestionar archivos adjuntos:

- Relación 1:N con `Claim` (un claim puede tener múltiples documentos)
- DELETE CASCADE automático al eliminar un claim
- Índices en `claimId` y `documentType` para búsquedas rápidas
- Metadatos completos: fileName, fileUrl, fileSize, mimeType, uploadedAt

**Migración aplicada**: `20251210114950_add_claim_documents_and_fields`

### Beneficios de los Cambios

1. **Mejor Performance**: Campos importantes ahora son consultables directamente sin parsear JSON
2. **Gestión de Archivos**: Modelo separado facilita operaciones CRUD en documentos
3. **Escalabilidad**: Estructura preparada para manejar múltiples archivos por claim
4. **Integridad**: DELETE CASCADE garantiza limpieza automática de documentos huérfanos
5. **Auditoría**: Timestamp de subida para cada documento

## ⚠️ IMPORTANTE - Arquitectura de Manejo de Archivos

### Flujo Actual (Implementado)

Esta aplicación **NO procesa ni almacena archivos**, actúa como **proxy/intermediario**:

1. **Recibe** el FormData completo del frontend (datos + archivos binarios)
2. **Reenvía** todo tal cual al webhook externo configurado
3. **Devuelve** la respuesta del webhook al frontend

### Responsabilidad del Webhook Externo

El webhook externo (fuera del contexto de esta aplicación) debe:

1. **Recibir el FormData** enviado por esta aplicación
2. **Extraer y validar los archivos binarios**
   - Validar tipo de archivo (MIME type)
   - Validar tamaño máximo
   - Sanitizar nombres de archivo
3. **Subir archivos a cloud storage** (S3, Azure Blob, Google Cloud Storage, etc.)
4. **Crear registro del claim** en su propia base de datos con las URLs de los archivos
5. **Devolver respuesta** con el ID del claim creado

### Ejemplo de Implementación del Webhook Externo

```typescript
// webhook-service/api/claim-submit/route.ts
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 1. Extraer datos
    const policyNumber = formData.get('policyNumber') as string;
    const personalInfo = JSON.parse(formData.get('personalInfo') as string);

    // 2. Extraer archivos
    const insurerForm = formData.get('insurerForm') as File;
    const medicalPrescription = formData.get('medicalPrescription') as File;
    const medicalExams = formData.getAll('medicalExams') as File[];

    // 3. Validar archivos
    validateFile(insurerForm, { maxSize: 10_000_000, types: ['application/pdf'] });

    // 4. Subir a cloud storage
    const insurerFormUrl = await uploadToS3(insurerForm, 'claims/insurer-forms');
    const prescriptionUrl = await uploadToS3(medicalPrescription, 'claims/prescriptions');
    const examUrls = await Promise.all(
      medicalExams.map((exam) => uploadToS3(exam, 'claims/exams'))
    );

    // 5. Crear claim en base de datos
    const claim = await db.claim.create({
      data: {
        policyNumber,
        personalInfo,
        documents: {
          insurerForm: insurerFormUrl,
          medicalPrescription: prescriptionUrl,
          medicalExams: examUrls,
        },
      },
    });

    // 6. Devolver respuesta
    return Response.json({
      success: true,
      claimId: claim.id,
      message: 'Claim created successfully',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Middleware de Validación de Archivos (Webhook Externo)

- Validar tipo de archivo (MIME type)
- Validar tamaño máximo
- Sanitizar nombres de archivo
- Escanear por virus (opcional pero recomendado)

## Validaciones Implementadas

### Zod Schemas

Se han implementado schemas separados para:

- `healthClaimSchema` - Validación de reclamos de salud
- `vehicleClaimSchema` - Validación de reclamos de vehículo
- `claimSchema` - Union discriminada que valida según `insuranceType`

### Validaciones por Tipo

- **Health**: Requiere `medicalCenterId`, valida `totalAmount` > 0
- **Vehicle**: Valida que si `policeReport` es true, debe existir `policeReportNumber`

## Estado de Implementación

### ✅ Completado en esta Aplicación

1. **Endpoint POST /api/claims** - Proxy que reenvía FormData al webhook externo
2. **Endpoint GET /api/claims** - Consulta de claims con filtros y detalles
3. **Schema de validación** - Zod schemas para health y vehicle claims
4. **Modelo de base de datos** - Claim y ClaimDocument con campos optimizados
5. **Migración aplicada** - Schema actualizado en base de datos Turso

### 🔄 Responsabilidad del Webhook Externo

1. **Procesamiento de FormData** - Extraer archivos y datos del form
2. **Validación de archivos** - Tipo, tamaño, seguridad
3. **Subida a cloud storage** - S3, Azure Blob, Google Cloud Storage, etc.
4. **Creación de claim** - Almacenar en su propia base de datos
5. **Manejo de errores** - Validaciones y rollback si es necesario

### ⏳ Pendiente (Opcional para esta Aplicación)

1. **Servicio de notificación** - Cuando `contactDataModified` es true
2. **Endpoint PATCH /api/claims/:id** - Actualizar estado del reclamo
3. **Webhook para sincronización** - Si el webhook externo notifica cambios de estado

## API Endpoints

### POST /api/claims

Envía el reclamo completo (datos + archivos) al webhook externo para procesamiento.

**Importante**: Este endpoint actúa como **proxy/intermediario**. No procesa ni almacena los datos directamente, solo reenvía el request completo al webhook configurado en `WEBHOOK_CLAIM_SUBMIT_URL`.

**Content-Type Soportados:**

1. `multipart/form-data` - Para enviar archivos binarios
2. `application/json` - Para enviar solo datos (sin archivos o con URLs pre-procesadas)

**Request Body (FormData):**

```javascript
// Ejemplo con FormData (frontend)
const formData = new FormData();

// Datos del claim
formData.append('policyNumber', 'POL-12345');
formData.append('dependentId', 'dep-uuid-123');
formData.append('claimType', 'consultation');
formData.append('insuranceType', 'health');
formData.append('incidentDate', '2025-12-01');
formData.append('description', 'Consulta médica por dolor de espalda');
formData.append(
  'personalInfo',
  JSON.stringify({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '0987654321',
  })
);
formData.append('medicalCenterId', 'center-uuid-456');
formData.append('diagnosis', 'Lumbalgia');
formData.append('totalAmount', '150.00');

// Archivos binarios
formData.append('insurerForm', fileInput.files[0]);
formData.append('medicalPrescription', prescriptionFile);
formData.append('medicalExams', examFile1);
formData.append('medicalExams', examFile2);
```

**Request Body (JSON - alternativo):**

```json
{
  "policyNumber": "POL-12345",
  "dependentId": "dep-uuid-123",
  "claimType": "consultation",
  "insuranceType": "health",
  "incidentDate": "2025-12-01",
  "description": "Consulta médica por dolor de espalda",
  "personalInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "0987654321"
  },
  "medicalCenterId": "center-uuid-456",
  "diagnosis": "Lumbalgia",
  "totalAmount": 150.0,
  "insurerForm": "https://pre-uploaded-url.com/file.pdf",
  "medicalPrescription": "https://pre-uploaded-url.com/prescription.pdf"
}
```

**Response (del webhook externo):**

```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "data": {
    "id": "claim-uuid-789"
  }
}
```

**Variables de Entorno Requeridas:**

```env
WEBHOOK_CLAIM_SUBMIT_URL="https://external-service.com/api/claim-submit"
ROUTARA_API_KEY="your-routara-api-key"
```

### GET /api/claims

Obtener lista de reclamos con filtros opcionales.

**Query Parameters:**

- `customerId` - Filtrar por ID de cliente
- `policyNumber` - Filtrar por número de póliza
- `id` - Obtener un claim específico con todos sus detalles

**Ejemplos:**

1. **Listar todos los claims de un cliente:**

```bash
GET /api/claims?customerId=customer-uuid-123
```

2. **Obtener un claim específico con documentos:**

```bash
GET /api/claims?id=claim-uuid-789
```

**Response (lista):**

```json
{
  "success": true,
  "data": [
    {
      "id": "claim-uuid-789",
      "customerId": "customer-uuid-123",
      "policyNumber": "POL-12345",
      "claimType": "consultation",
      "insuranceType": "health",
      "incidentDate": "2025-12-01T00:00:00Z",
      "description": "Consulta médica por dolor de espalda",
      "status": "submitted",
      "estimatedAmount": 150.0,
      "medicalCenterId": "center-uuid-456",
      "diagnosis": "Lumbalgia",
      "customer": {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com"
      },
      "documents": [
        {
          "id": "doc-uuid-1",
          "documentType": "insurerForm",
          "fileName": "formulario.pdf",
          "fileUrl": "https://storage.example.com/insurer-form.pdf",
          "fileSize": 524288,
          "mimeType": "application/pdf",
          "uploadedAt": "2025-12-10T10:30:00Z"
        }
      ],
      "createdAt": "2025-12-10T10:30:00Z",
      "updatedAt": "2025-12-10T10:30:00Z"
    }
  ]
}
```

**Response (detalle individual):**
Incluye además:

- `customer.phone` - Teléfono del cliente
- `insurer.name` y `insurer.code` - Información de la aseguradora
- Todos los documentos ordenados por fecha de subida

## Testing

### Crear un Reclamo de Salud

```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-12345",
    "dependentId": "dep-uuid-123",
    "claimType": "consultation",
    "insuranceType": "health",
    "incidentDate": "2025-12-01",
    "description": "Consulta médica por dolor de espalda",
    "personalInfo": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "phone": "0987654321"
    },
    "medicalCenterId": "center-uuid-456",
    "diagnosis": "Lumbalgia",
    "totalAmount": 150.00,
    "insurerForm": "https://storage.example.com/insurer-form.pdf",
    "medicalPrescription": "https://storage.example.com/prescription.pdf"
  }'
```

### Crear un Reclamo de Vehículo

```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-67890",
    "claimType": "accident",
    "insuranceType": "vehicle",
    "incidentDate": "2025-12-09",
    "description": "Colisión en intersección",
    "personalInfo": {
      "firstName": "María",
      "lastName": "González",
      "email": "maria@example.com",
      "phone": "0987654321"
    },
    "vehiclePlate": "ABC-1234",
    "location": "Av. Principal y Calle 10",
    "policeReport": true,
    "policeReportNumber": "REP-123456",
    "estimatedDamage": 5000.00,
    "hasThirdParty": true,
    "thirdPartyName": "Carlos Ramírez",
    "thirdPartyPlate": "XYZ-5678",
    "insurerForm": "https://storage.example.com/insurer-form.pdf",
    "insuredVehiclePhotos": [
      "https://storage.example.com/vehicle-photo-1.jpg",
      "https://storage.example.com/vehicle-photo-2.jpg"
    ]
  }'
```

### Obtener Claim Específico

```bash
curl http://localhost:3000/api/claims?id=claim-uuid-789
```

### Listar Claims por Cliente

```bash
curl http://localhost:3000/api/claims?customerId=customer-uuid-123
```

## Referencias

- Formulario: `packages/forms/src/forms/ClaimForm.tsx`
- Schema de validación: `packages/forms/src/lib/schemas/claim.schema.ts`
- Endpoint API: `apps/next-host-demo/src/app/api/claims/route.ts`
- Modelo de datos: `apps/next-host-demo/prisma/schema.prisma`
