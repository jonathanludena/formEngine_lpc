import { prisma } from './prisma';

/**
 * Get insured data with all related information
 */
export async function getInsuredData(policyNumber: string) {
  try {
    const insured = await prisma.insured.findUnique({
      where: { policyNumber },
      include: {
        customer: true,
        plan: {
          include: {
            insurer: true,
            medicalCenters: {
              include: {
                medicalCenter: true,
              },
            },
          },
        },
        dependents: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!insured) {
      return null;
    }

    // Parse JSON details based on insurance type
    let parsedDetails = null;
    if (insured.vehicleDetails) {
      parsedDetails = JSON.parse(insured.vehicleDetails);
    } else if (insured.healthDetails) {
      parsedDetails = JSON.parse(insured.healthDetails);
    } else if (insured.lifeDetails) {
      parsedDetails = JSON.parse(insured.lifeDetails);
    }

    // Extract medical centers from plan if health insurance
    const medicalCenters = insured.insuranceType === 'health' && insured.plan?.medicalCenters
      ? insured.plan.medicalCenters.map((pmc: any) => pmc.medicalCenter)
      : [];

    return {
      ...insured,
      parsedDetails,
      medicalCenters,
    };
  } catch (error) {
    console.error('Error fetching insured data:', error);
    return null;
  }
}

/**
 * Get customer data by identification number
 */
export async function getCustomerByIdentification(identificationNumber: string) {
  try {
    return await prisma.customer.findUnique({
      where: { identificationNumber },
      include: {
        insured: {
          where: { status: 'active' },
          include: {
            plan: {
              include: {
                insurer: true,
              },
            },
            dependents: {
              where: { isActive: true },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}

/**
 * Get customer policies by customer ID and optionally filter by insurance type
 */
export async function getCustomerPolicies(customerId: string, insuranceType?: string) {
  try {
    const policies = await prisma.insured.findMany({
      where: {
        customerId,
        status: 'active',
        ...(insuranceType && { insuranceType }),
      },
      include: {
        plan: {
          include: {
            insurer: true,
            medicalCenters: {
              include: {
                medicalCenter: true,
              },
            },
          },
        },
        dependents: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return policies.map(policy => {
      // Parse JSON details based on insurance type
      let parsedDetails = null;
      if (policy.vehicleDetails) {
        parsedDetails = JSON.parse(policy.vehicleDetails);
      } else if (policy.healthDetails) {
        parsedDetails = JSON.parse(policy.healthDetails);
      } else if (policy.lifeDetails) {
        parsedDetails = JSON.parse(policy.lifeDetails);
      }

      // Extract medical centers from plan if health insurance
      const medicalCenters = policy.insuranceType === 'health' && policy.plan?.medicalCenters
        ? policy.plan.medicalCenters.map((pmc: any) => pmc.medicalCenter)
        : [];

      return {
        ...policy,
        parsedDetails,
        medicalCenters,
      };
    });
  } catch (error) {
    console.error('Error fetching customer policies:', error);
    return [];
  }
}

/**
 * Format insured data for claim form initial data
 */
export function formatInsuredDataForClaim(insured: any) {
  if (!insured) return null;

  const baseData = {
    // Personal Information
    firstName: insured.customer.firstName,
    lastName: insured.customer.lastName,
    email: insured.customer.email,
    phone: insured.customer.phone,
    birthDate: insured.customer.birthDate,
    identificationType: insured.customer.identificationType,
    identificationNumber: insured.customer.identificationNumber,
    address: insured.customer.address,
    
    // Policy Information
    policyNumber: insured.policyNumber,
    insuranceType: insured.insuranceType,
    planName: insured.plan?.name,
    insurer: insured.plan?.insurer?.name,
  };

  // Add insurance-specific details
  if (insured.parsedDetails) {
    if (insured.insuranceType === 'vehicle') {
      return {
        ...baseData,
        vehicleDetails: insured.parsedDetails,
      };
    } else if (insured.insuranceType === 'health') {
      return {
        ...baseData,
        healthCoverage: insured.parsedDetails,
        dependents: insured.dependents?.map((d: any) => ({
          firstName: d.firstName,
          lastName: d.lastName,
          relationship: d.relationship,
          birthDate: d.birthDate,
          identificationType: d.identificationType,
          identificationNumber: d.identificationNumber,
        })),
      };
    }
  }

  return baseData;
}

/**
 * Format customer data for quote form initial data
 */
export function formatCustomerDataForQuote(customer: any) {
  if (!customer) return null;

  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    birthDate: customer.birthDate,
    identificationType: customer.identificationType,
    identificationNumber: customer.identificationNumber,
    address: customer.address,
    city: customer.city,
    province: customer.province,
  };
}
