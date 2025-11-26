import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const quoteSchema = z.object({
  brokerId: z.string(),
  planId: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  insuranceType: z.enum(['health', 'life', 'life_savings', 'vehicle']),
  quoteData: z.record(z.unknown()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        ...validatedData,
        quoteData: JSON.stringify(validatedData.quoteData),
      },
    });

    // Optionally create prospect
    await prisma.prospect.create({
      data: {
        brokerId: validatedData.brokerId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        insuranceType: validatedData.insuranceType,
        status: 'new',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Quote created successfully',
      data: { id: quote.id },
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');
    const email = searchParams.get('email');

    const where: Record<string, unknown> = {};
    if (brokerId) where.brokerId = brokerId;
    if (email) where.email = email;

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        broker: {
          select: {
            name: true,
          },
        },
        plan: {
          select: {
            name: true,
            insurer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
