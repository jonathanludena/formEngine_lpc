import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const insurerId = searchParams.get('insurerId');
    const insuranceType = searchParams.get('insuranceType');

    const where: Record<string, unknown> = {};
    if (insurerId) where.insurerId = insurerId;
    if (insuranceType) where.insuranceType = insuranceType;

    const plans = await prisma.plan.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        insuranceType: true,
        coverageType: true,
        price: true,
        description: true,
        insurer: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
