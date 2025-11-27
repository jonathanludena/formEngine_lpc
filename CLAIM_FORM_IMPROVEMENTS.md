# Implementación de Mejoras en Formulario de Reclamos

## Cambios Realizados

### 1. **Base de Datos**

- ✅ Agregado modelo `MedicalCenter` con tipos: hospital, clinic, laboratory, pharmacy
- ✅ Tabla intermedia `PlanMedicalCenter` para red médica por plan
- ✅ Seeds con 8 centros médicos reales de Ecuador
- ✅ Vinculación de centros médicos a planes de salud

### 2. **Schemas de Validación**

- ✅ Campo `dependentId` para seleccionar dependiente/vehículo asegurado
- ✅ Campos de archivos compartidos: `insurerForm`
- ✅ Campos de archivos para salud:
  - `medicalPrescription` (receta médica)
  - `medicalDiagnosis` (diagnóstico del médico)
  - `medicalExams` (exámenes - múltiples archivos)
  - `medicineInvoice` (factura medicinas)
  - `medicalAppointmentInvoice` (factura cita médica)
- ✅ Campos de archivos para vehículos:
  - `insuredVehiclePhotos` (fotos vehículo asegurado - múltiples)
  - `thirdPartyPropertyPhotos` (fotos bien de terceros - múltiples)
  - `affectedPersonPhoto` (foto persona afectada)
  - `insuredLicensePhoto` (licencia asegurado)
  - `thirdPartyLicensePhoto` (licencia tercero)
  - `thirdPartyRegistrationPhoto` (matrícula tercero)
  - `thirdPartyIdPhoto` (identificación tercero)
- ✅ Campos para terceros afectados: `thirdPartyPlate`, `thirdPartyName`
- ✅ Cambio de `medicalCenter` (string) a `medicalCenterId` (selector)

### 3. **Componente FileUpload**

- ✅ Componente `FormFileUpload` con:
  - Validación de tamaño (configurable, default 5MB)
  - Preview de imágenes
  - Iconos para PDFs y otros documentos
  - Soporte para múltiples archivos
  - Arrastrar y soltar (drag & drop)
  - Botón para eliminar archivos
  - Validación de tipos de archivo

### 4. **Cambios Pendientes en ClaimForm**

El ClaimForm necesita ser actualizado con los siguientes cambios:

#### a) **Selector de Pólizas**

```typescript
// El campo policyNumber debe cambiar de FormField a FormSelect
// Debe cargar las pólizas del asegurado filtradas por tipo de seguro
<Controller
  name="policyNumber"
  control={control}
  render={({ field }) => (
    <FormSelect
      label="Número de Póliza"
      placeholder="Selecciona la póliza"
      options={availablePolicies} // Cargadas desde initialData
      value={field.value}
      onValueChange={field.onChange}
      error={getError('policyNumber')}
    />
  )}
/>
```

#### b) **Selector de Dependientes (Salud)**

```typescript
<Controller
  name="dependentId"
  control={control}
  render={({ field }) => (
    <FormSelect
      label="¿Para quién es el reclamo?"
      placeholder="Selecciona el beneficiario"
      options={[
        { value: 'titular', label: 'Titular (Yo)' },
        ...dependents.map(d => ({
          value: d.id,
          label: `${d.firstName} ${d.lastName} (${d.relationship})`
        }))
      ]}
      value={field.value}
      onValueChange={field.onChange}
    />
  )}
/>
```

#### c) **Campos de Contacto ReadOnly**

```typescript
<FormField
  label="Nombre"
  value={watch('personalInfo.firstName')}
  disabled={true}
  readOnly={true}
  className="bg-gray-50"
/>

<div className="mt-2">
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={handleRequestDataUpdate}
  >
    Solicitar actualización de datos
  </Button>
</div>
```

#### d) **Selector de Centro Médico**

```typescript
<Controller
  name="medicalCenterId"
  control={control}
  render={({ field }) => (
    <FormSelect
      label="Centro Médico"
      placeholder="Selecciona el centro médico"
      options={medicalCenters.map(mc => ({
        value: mc.id,
        label: `${mc.name} - ${mc.city}`
      }))}
      value={field.value}
      onValueChange={field.onChange}
      error={getError('medicalCenterId')}
    />
  )}
/>
```

#### e) **Campos de Archivos - Salud**

```typescript
<FormFileUpload
  label="Formulario de Aseguradora"
  accept=".pdf,image/*"
  onChange={(file) => setValue('insurerForm', file)}
/>

<FormFileUpload
  label="Receta Médica"
  accept=".pdf,image/*"
  onChange={(file) => setValue('medicalPrescription', file)}
/>

<FormFileUpload
  label="Diagnóstico del Médico"
  accept=".pdf,image/*"
  onChange={(file) => setValue('medicalDiagnosis', file)}
/>

<FormFileUpload
  label="Exámenes de Salud"
  accept=".pdf,image/*"
  multiple={true}
  onChange={(files) => setValue('medicalExams', files)}
/>

<FormFileUpload
  label="Factura de Medicinas"
  accept=".pdf,image/*"
  onChange={(file) => setValue('medicineInvoice', file)}
/>

<FormFileUpload
  label="Factura de Cita Médica"
  accept=".pdf,image/*"
  onChange={(file) => setValue('medicalAppointmentInvoice', file)}
/>
```

#### f) **Campos de Archivos - Vehículos**

```typescript
<FormFileUpload
  label="Fotos del Vehículo Asegurado (daños)"
  description="Fotos donde se muestre el daño del vehículo"
  accept="image/*"
  multiple={true}
  onChange={(files) => setValue('insuredVehiclePhotos', files)}
/>

<FormFileUpload
  label="Foto de Licencia del Asegurado"
  accept="image/*"
  onChange={(file) => setValue('insuredLicensePhoto', file)}
/>

// Campos condicionales si hay tercero afectado
{hasThirdParty && (
  <>
    <FormFileUpload
      label="Fotos del Bien de Terceros Afectado"
      accept="image/*"
      multiple={true}
      onChange={(files) => setValue('thirdPartyPropertyPhotos', files)}
    />

    <FormFileUpload
      label="Foto de Licencia del Tercero"
      accept="image/*"
      onChange={(file) => setValue('thirdPartyLicensePhoto', file)}
    />

    <FormFileUpload
      label="Foto de Matrícula del Vehículo del Tercero"
      accept="image/*"
      onChange={(file) => setValue('thirdPartyRegistrationPhoto', file)}
    />

    <FormFileUpload
      label="Foto de Identificación del Tercero"
      accept="image/*"
      onChange={(file) => setValue('thirdPartyIdPhoto', file)}
    />
  </>
)}
```

#### g) **Campos de Terceros Afectados**

```typescript
<FormCheckbox
  label="¿Hubo terceros afectados?"
  checked={hasThirdParty}
  onCheckedChange={setHasThirdParty}
/>

{hasThirdParty && (
  <div className="space-y-4 border-l-4 border-yellow-400 pl-4">
    <h4 className="font-medium text-gray-900">Información del Tercero</h4>

    <FormField
      label="Placa del Vehículo del Tercero"
      placeholder="ABC-1234"
      {...register('thirdPartyPlate')}
    />

    <FormField
      label="Nombre del Tercero Afectado"
      placeholder="Nombre completo"
      {...register('thirdPartyName')}
    />
  </div>
)}
```

#### h) **Placa Pre-cargada desde initialData**

```typescript
// En vehiclePlate
<FormField
  label="Placa del Vehículo Asegurado"
  value={watch('vehiclePlate')}
  disabled={true}
  readOnly={true}
  className="bg-gray-50"
/>
```

### 5. **API para Cargar Centros Médicos**

Crear endpoint: `/api/medical-centers/[planId]`

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  const { planId } = await params;

  const medicalCenters = await prisma.medicalCenter.findMany({
    where: {
      plans: {
        some: {
          planId: planId,
        },
      },
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return NextResponse.json({ data: medicalCenters });
}
```

### 6. **Actualización de initialData**

El helper `formatInsuredDataForClaim` debe incluir:

- Lista de pólizas activas del cliente (filtradas por tipo de seguro)
- Lista de dependientes activos
- Lista de vehículos asegurados (para seguros vehiculares)
- Lista de centros médicos de la red (para seguros de salud)

### 7. **Lógica de Solicitud de Actualización de Datos**

```typescript
const handleRequestDataUpdate = async () => {
  // TODO: Implementar servicio para notificar al admin
  alert(
    'Se ha enviado una solicitud de actualización de datos al administrador. Te contactaremos pronto.'
  );

  // Enviar notificación
  await fetch('/api/notifications/data-update-request', {
    method: 'POST',
    body: JSON.stringify({
      customerId: customerData.id,
      requestedFields: ['email', 'phone', 'address'],
    }),
  });
};
```

## Resumen de Archivos Modificados

1. ✅ `prisma/schema.prisma` - Modelos de centros médicos
2. ✅ `prisma/seed.ts` - Seeds de centros médicos
3. ✅ `packages/forms/src/lib/schemas/claim.schema.ts` - Validación actualizada
4. ✅ `packages/forms/src/components/atoms/FormFileUpload.tsx` - Componente nuevo
5. ✅ `packages/forms/src/components/atoms/index.ts` - Export FormFileUpload
6. ⏳ `packages/forms/src/forms/ClaimForm.tsx` - **PENDIENTE** (cambios extensos)
7. ⏳ `apps/next-host-demo/src/lib/insured-data.ts` - **PENDIENTE** (formatters actualizados)
8. ⏳ `apps/next-host-demo/src/app/api/medical-centers/[planId]/route.ts` - **PENDIENTE** (nuevo endpoint)

## Próximos Pasos

1. Actualizar completamente `ClaimForm.tsx` con todos los campos
2. Crear endpoint para centros médicos
3. Actualizar helpers de formateo de datos
4. Implementar servicio de notificaciones para actualización de datos
5. Testing completo del flujo de reclamos

## Notas Importantes

- Los archivos se manejan como `File` objects del lado del cliente
- Al enviar al backend, necesitarás convertirlos a base64 o usar multipart/form-data
- Los campos readonly mantienen su validación pero no permiten edición
- El selector de dependientes incluye opción "Titular (Yo)" por defecto
