import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getClaimStartConfigByToken } from '@/lib/redisClaimStart';

const claimSchema = z.object({
  customerId: z.string().optional(),
  policyNumber: z.string(),
  claimType: z.string(),
  insuranceType: z.enum(['health', 'vehicle']),
  incidentDate: z.string(),
  description: z.string(),
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  claimData: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = claimSchema.parse(body);

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.personalInfo.email },
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          firstName: validatedData.personalInfo.firstName,
          lastName: validatedData.personalInfo.lastName,
          email: validatedData.personalInfo.email,
          phone: validatedData.personalInfo.phone,
          birthDate: new Date(), // Should be from form data
          identificationType: 'cedula', // Should be from form data
          identificationNumber: 'temp-' + Date.now(), // Should be from form data
        },
      });
    }

    // Create claim
    const claim = await prisma.claim.create({
      data: {
        customerId: customer.id,
        policyNumber: validatedData.policyNumber,
        claimType: validatedData.claimType,
        insuranceType: validatedData.insuranceType,
        incidentDate: new Date(validatedData.incidentDate),
        description: validatedData.description,
        claimData: JSON.stringify(validatedData.claimData || {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Claim submitted successfully',
      data: { id: claim.id },
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
