# Ejemplos de Uso - API de Reclamos

## Consultas Avanzadas con Prisma

### 1. Obtener Claims con Documentos Específicos

```typescript
// Obtener claims que tienen receta médica
const claimsWithPrescription = await prisma.claim.findMany({
  where: {
    insuranceType: 'health',
    documents: {
      some: {
        documentType: 'medicalPrescription',
      },
    },
  },
  include: {
    documents: true,
    customer: true,
  },
});
```

### 2. Buscar Claims por Fecha de Incidente

```typescript
// Claims de los últimos 30 días
const recentClaims = await prisma.claim.findMany({
  where: {
    incidentDate: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  },
  include: {
    documents: true,
  },
  orderBy: {
    incidentDate: 'desc',
  },
});
```

### 3. Obtener Claims por Centro Médico

```typescript
// Claims atendidos en un centro médico específico
const claimsByMedicalCenter = await prisma.claim.findMany({
  where: {
    medicalCenterId: 'center-uuid-123',
  },
  include: {
    customer: true,
    documents: {
      where: {
        documentType: {
          in: ['medicalPrescription', 'medicalDiagnosis'],
        },
      },
    },
  },
});
```

### 4. Claims de Vehículo con Terceros Involucrados

```typescript
// Claims vehiculares donde hay terceros afectados
const claimsWithThirdParty = await prisma.claim.findMany({
  where: {
    insuranceType: 'vehicle',
    hasThirdParty: true,
  },
  select: {
    id: true,
    policyNumber: true,
    vehiclePlate: true,
    thirdPartyName: true,
    location: true,
    policeReportNumber: true,
    estimatedAmount: true,
    documents: {
      where: {
        documentType: {
          startsWith: 'thirdParty',
        },
      },
    },
  },
});
```

### 5. Estadísticas de Claims por Tipo

```typescript
// Agrupar claims por tipo y contar
const claimStats = await prisma.claim.groupBy({
  by: ['claimType', 'insuranceType'],
  _count: {
    id: true,
  },
  _sum: {
    estimatedAmount: true,
    approvedAmount: true,
  },
  orderBy: {
    _count: {
      id: 'desc',
    },
  },
});
```

### 6. Obtener Documentos de un Claim Específico

```typescript
// Listar todos los documentos de un claim con metadatos
const claimDocuments = await prisma.claimDocument.findMany({
  where: {
    claimId: 'claim-uuid-123',
  },
  orderBy: {
    uploadedAt: 'asc',
  },
});

// Agrupar documentos por tipo
const groupedDocuments = claimDocuments.reduce(
  (acc, doc) => {
    if (!acc[doc.documentType]) {
      acc[doc.documentType] = [];
    }
    acc[doc.documentType].push(doc);
    return acc;
  },
  {} as Record<string, typeof claimDocuments>
);
```

### 7. Actualizar Estado de un Claim

```typescript
// Actualizar claim a "under_review"
const updatedClaim = await prisma.claim.update({
  where: {
    id: 'claim-uuid-123',
  },
  data: {
    status: 'under_review',
    updatedAt: new Date(),
  },
  include: {
    customer: true,
    documents: true,
  },
});
```

### 8. Agregar Documentos Adicionales a un Claim Existente

```typescript
// Agregar más documentos después de crear el claim
const newDocuments = await prisma.claimDocument.createMany({
  data: [
    {
      claimId: 'claim-uuid-123',
      documentType: 'medicalExam_3',
      fileName: 'additional-exam.pdf',
      fileUrl: 'https://storage.example.com/exam3.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
    },
  ],
});
```

### 9. Eliminar un Claim con sus Documentos

```typescript
// El CASCADE delete automáticamente eliminará los documentos
const deletedClaim = await prisma.claim.delete({
  where: {
    id: 'claim-uuid-123',
  },
});
// Los ClaimDocuments asociados se eliminan automáticamente
```

### 10. Buscar Claims por Póliza con Información Completa

```typescript
const claimsByPolicy = await prisma.claim.findMany({
  where: {
    policyNumber: 'POL-12345',
  },
  include: {
    customer: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    },
    insurer: {
      select: {
        name: true,
        code: true,
      },
    },
    documents: {
      orderBy: {
        uploadedAt: 'asc',
      },
    },
  },
  orderBy: {
    incidentDate: 'desc',
  },
});
```

## Middleware de Validación de Archivos (Ejemplo)

```typescript
// lib/validateFile.ts
import { z } from 'zod';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_DOC_TYPES = ['application/pdf'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Tipo de imagen no permitido. Solo JPG, JPEG, PNG');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Imagen muy grande. Máximo 5MB');
  }
  return true;
}

export function validateDocumentFile(file: File) {
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    throw new Error('Tipo de documento no permitido. Solo PDF');
  }
  if (file.size > MAX_DOC_SIZE) {
    throw new Error('Documento muy grande. Máximo 10MB');
  }
  return true;
}
```

## Service de Subida de Archivos (Ejemplo con AWS S3)

```typescript
// lib/uploadClaimFiles.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadClaimFile(
  file: File,
  claimId: string,
  documentType: string
): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${documentType}-${uuidv4()}.${fileExtension}`;
  const key = `claims/${claimId}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        documentType: documentType,
        claimId: claimId,
      },
    })
  );

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    fileUrl,
    fileName: file.name,
    fileSize: file.size,
  };
}

// Función para subir múltiples archivos
export async function uploadMultipleClaimFiles(
  files: File[],
  claimId: string,
  baseDocumentType: string
): Promise<Array<{ fileUrl: string; fileName: string; fileSize: number }>> {
  const uploadPromises = files.map((file, index) =>
    uploadClaimFile(file, claimId, `${baseDocumentType}_${index + 1}`)
  );

  return Promise.all(uploadPromises);
}
```

## Endpoint con Procesamiento de FormData (Ejemplo)

```typescript
// app/api/claims/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadClaimFile, uploadMultipleClaimFiles } from '@/lib/uploadClaimFiles';
import { validateImageFile, validateDocumentFile } from '@/lib/validateFile';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const claimId = formData.get('claimId') as string;

    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 });
    }

    const uploadedDocuments: Array<{
      documentType: string;
      fileUrl: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
    }> = [];

    // Procesar archivo único
    const insurerForm = formData.get('insurerForm') as File | null;
    if (insurerForm) {
      validateDocumentFile(insurerForm);
      const result = await uploadClaimFile(insurerForm, claimId, 'insurerForm');
      uploadedDocuments.push({
        documentType: 'insurerForm',
        ...result,
        mimeType: insurerForm.type,
      });
    }

    // Procesar múltiples archivos
    const vehiclePhotos = formData.getAll('insuredVehiclePhotos') as File[];
    if (vehiclePhotos.length > 0) {
      vehiclePhotos.forEach((photo) => validateImageFile(photo));
      const results = await uploadMultipleClaimFiles(vehiclePhotos, claimId, 'insuredVehiclePhoto');
      results.forEach((result, index) => {
        uploadedDocuments.push({
          documentType: `insuredVehiclePhoto_${index + 1}`,
          ...result,
          mimeType: vehiclePhotos[index].type,
        });
      });
    }

    // Guardar en base de datos
    await prisma.claimDocument.createMany({
      data: uploadedDocuments,
    });

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedDocuments,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
```

## Hook de React para Submit de Claims (Frontend)

```typescript
// hooks/useClaimSubmit.ts
import { useState } from 'react';

export function useClaimSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitClaim = async (claimData: any, files: Record<string, File | File[]>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Crear FormData con todos los datos y archivos
      const formData = new FormData();

      // Agregar datos del claim
      for (const [key, value] of Object.entries(claimData)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Serializar objetos como JSON
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      // Agregar archivos
      for (const [key, value] of Object.entries(files)) {
        if (Array.isArray(value)) {
          // Múltiples archivos con el mismo nombre
          value.forEach((file) => {
            formData.append(key, file, file.name);
          });
        } else if (value) {
          // Archivo único
          formData.append(key, value, value.name);
        }
      }

      // Enviar todo junto al endpoint
      const response = await fetch('/api/claims', {
        method: 'POST',
        body: formData, // No establecer Content-Type, el browser lo hace automáticamente
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit claim');
      }

      const result = await response.json();
      setSuccess(true);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitClaim, isLoading, error, success };
}
```

## Ejemplo de Uso en Componente

```typescript
// components/ClaimSubmitForm.tsx
import { useClaimSubmit } from '@/hooks/useClaimSubmit';
import { useState } from 'react';

export function ClaimSubmitForm() {
  const { submitClaim, isLoading, error, success } = useClaimSubmit();
  const [files, setFiles] = useState<Record<string, File | File[]>>({});

  const handleFileChange = (fieldName: string, file: File | FileList) => {
    if (file instanceof FileList) {
      setFiles(prev => ({ ...prev, [fieldName]: Array.from(file) }));
    } else {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const claimData = {
      policyNumber: 'POL-12345',
      claimType: 'consultation',
      insuranceType: 'health',
      incidentDate: '2025-12-01',
      description: 'Consulta médica',
      personalInfo: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '0987654321'
      },
      medicalCenterId: 'center-123',
      totalAmount: 150
    };

    try {
      const result = await submitClaim(claimData, files);
      console.log('Claim created:', result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => e.target.files?.[0] && handleFileChange('insurerForm', e.target.files[0])}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileChange('medicalPrescription', e.target.files[0])}
      />

      <input
        type="file"
        accept=".pdf,image/*"
        multiple
        onChange={(e) => e.target.files && handleFileChange('medicalExams', e.target.files)}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar Reclamo'}
      </button>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">¡Reclamo enviado exitosamente!</div>}
    </form>
  );
}
```

## Dashboard - Obtener Claims con Filtros

```typescript
// app/admin/claims/page.tsx
import { prisma } from '@/lib/prisma';

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string; from?: string };
}) {
  const where: any = {};

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.type) {
    where.insuranceType = searchParams.type;
  }

  if (searchParams.from) {
    where.incidentDate = {
      gte: new Date(searchParams.from),
    };
  }

  const claims = await prisma.claim.findMany({
    where,
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      documents: {
        select: {
          documentType: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  return (
    <div>
      <h1>Claims Dashboard</h1>
      {/* Render claims */}
    </div>
  );
}
```
