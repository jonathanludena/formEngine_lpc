import { NextRequest, NextResponse } from 'next/server';
import { getCustomerPolicies } from '@/lib/insured-data';

/**
 * GET /api/customers/[customerId]/policies?insuranceType=health
 * Get all policies for a customer, optionally filtered by insurance type
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { searchParams } = new URL(request.url);
    const insuranceType = searchParams.get('insuranceType') || undefined;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const policies = await getCustomerPolicies(customerId, insuranceType);

    return NextResponse.json({
      success: true,
      data: policies,
    });
  } catch (error) {
    console.error('Error fetching customer policies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
