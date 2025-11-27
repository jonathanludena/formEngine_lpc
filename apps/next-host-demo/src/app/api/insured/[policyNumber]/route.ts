import { NextRequest, NextResponse } from 'next/server';
import { getInsuredData } from '@/lib/insured-data';

/**
 * GET /api/insured/[policyNumber]
 * Get insured data by policy number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policyNumber: string }> }
) {
  try {
    const { policyNumber } = await params;

    if (!policyNumber) {
      return NextResponse.json(
        { error: 'Policy number is required' },
        { status: 400 }
      );
    }

    const insuredData = await getInsuredData(policyNumber);

    if (!insuredData) {
      return NextResponse.json(
        { error: 'Insured not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: insuredData,
    });
  } catch (error) {
    console.error('Error fetching insured:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
