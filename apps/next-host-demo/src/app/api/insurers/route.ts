import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');

    const where = brokerId ? { brokerId } : {};

    const insurers = await prisma.insurer.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        broker: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: insurers });
  } catch (error) {
    console.error('Error fetching insurers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insurers' },
      { status: 500 }
    );
  }
}
