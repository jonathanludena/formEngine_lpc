import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brokers = await prisma.broker.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json({ success: true, data: brokers });
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brokers' },
      { status: 500 }
    );
  }
}
