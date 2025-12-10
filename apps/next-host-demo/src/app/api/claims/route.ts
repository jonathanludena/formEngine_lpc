import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getClaimStartConfigByToken } from '@/lib/redisClaimStart';

// Base schema for personal info
const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

// Base claim schema
const baseClaimSchema = z.object({
  customerId: z.string().optional(),
  policyNumber: z.string(),
  dependentId: z.string().optional(),
  claimType: z.string(),
  insuranceType: z.enum(['health', 'vehicle']),
  incidentDate: z.string(),
  description: z.string(),
  personalInfo: personalInfoSchema,
  // Common file uploads (stored as URLs or file paths after upload)
  insurerForm: z.string().optional(),
});

// Health-specific claim schema
const healthClaimSchema = baseClaimSchema.extend({
  insuranceType: z.literal('health'),
  medicalCenterId: z.string().optional(),
  diagnosis: z.string().optional(),
  totalAmount: z.number().optional(),
  // Health-specific file uploads
  medicalPrescription: z.string().optional(),
  medicalDiagnosis: z.string().optional(),
  medicalExams: z.array(z.string()).optional(),
  medicineInvoice: z.string().optional(),
  medicalAppointmentInvoice: z.string().optional(),
});

// Vehicle-specific claim schema
const vehicleClaimSchema = baseClaimSchema.extend({
  insuranceType: z.literal('vehicle'),
  vehiclePlate: z.string().optional(),
  location: z.string().optional(),
  policeReport: z.boolean().optional(),
  policeReportNumber: z.string().optional(),
  estimatedDamage: z.number().optional(),
  // Third party information
  thirdPartyPlate: z.string().optional(),
  thirdPartyName: z.string().optional(),
  // Vehicle-specific file uploads
  insuredVehiclePhotos: z.array(z.string()).optional(),
  thirdPartyPropertyPhotos: z.array(z.string()).optional(),
  affectedPersonPhoto: z.string().optional(),
  insuredLicensePhoto: z.string().optional(),
  thirdPartyLicensePhoto: z.string().optional(),
  thirdPartyRegistrationPhoto: z.string().optional(),
  thirdPartyIdPhoto: z.string().optional(),
});

// Union of both schemas
const claimSchema = z.discriminatedUnion('insuranceType', [
  healthClaimSchema,
  vehicleClaimSchema,
]);

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    const webhookUrl = process.env.WEBHOOK_CLAIM_SUBMIT_URL;
    const apiKey = process.env.ROUTARA_API_KEY;
    
    if (!webhookUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Webhook configuration missing. Set WEBHOOK_CLAIM_SUBMIT_URL and ROUTARA_API_KEY.' },
        { status: 500 }
      );
    }

    // Reenviar el request completo (FormData o JSON) al webhook externo
    let webhookResponse: Response;
    
    if (contentType?.includes('multipart/form-data')) {
      // Caso 1: FormData con archivos binarios - reenviar tal cual
      const formData = await request.formData();
      
      webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'x-routara-key': apiKey,
          'X-Source': 'formEngine',
        },
        body: formData, // Reenviar FormData completo
      });
    } else {
      // Caso 2: JSON - reenviar tal cual
      const body = await request.json();
      
      webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-routara-key': apiKey,
          'X-Source': 'formEngine',
        },
        body: JSON.stringify(body),
      });
    }

    // Procesar respuesta del webhook
    if (!webhookResponse.ok) {
      const errorData = await webhookResponse.json().catch(() => ({}));
      console.error('Webhook error:', errorData);
      return NextResponse.json(
        { 
          error: 'Failed to submit claim to external service',
          details: errorData 
        },
        { status: webhookResponse.status }
      );
    }

    const webhookResult = await webhookResponse.json();

    // El webhook debe devolver información del claim creado
    // Formato esperado: { success: true, claimId: "xxx", message: "..." }
    return NextResponse.json({
      success: true,
      message: webhookResult.message || 'Claim submitted successfully',
      data: { 
        id: webhookResult.claimId || webhookResult.id,
        ...webhookResult.data 
      },
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('tk');
    const insuranceTypeParam = searchParams.get('insuranceType');
    const customerId = searchParams.get('customerId');
    const policyNumber = searchParams.get('policyNumber');
    const claimId = searchParams.get('id');

    if (token) {
      try {
        const insuranceType = insuranceTypeParam === 'vehicle' || insuranceTypeParam === 'vehicule'
          ? 'vehicule'
          : 'health';
        const config = await getClaimStartConfigByToken(token, insuranceType);

        if (!config) {
          return NextResponse.json({ error: 'No claim start data for token' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: config });
      } catch (error) {
        console.error('Error fetching claim start data from Redis:', error);
        return NextResponse.json({ error: 'Failed to load claim start data' }, { status: 500 });
      }
    }

    // Get single claim by ID with all details
    if (claimId) {
      const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        include: {
          customer: {
            select: {
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
            select: {
              id: true,
              documentType: true,
              fileName: true,
              fileUrl: true,
              fileSize: true,
              mimeType: true,
              uploadedAt: true,
            },
            orderBy: {
              uploadedAt: 'asc',
            },
          },
        },
      });

      if (!claim) {
        return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: claim });
    }

    // Get list of claims with filters
    const where: Record<string, unknown> = {};
    if (customerId) where.customerId = customerId;
    if (policyNumber) where.policyNumber = policyNumber;

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
            id: true,
            documentType: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}
