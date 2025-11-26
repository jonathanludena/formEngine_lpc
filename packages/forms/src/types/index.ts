// Re-export all types from the main src/lib/types
export type BrandId = 'default' | 'liberty' | 'metlife' | 'panamerican';

export type InsuranceType = 'health' | 'life' | 'life_savings' | 'vehicle';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  identificationType: 'cedula' | 'passport' | 'ruc';
  identificationNumber: string;
}

export interface BaseFormData {
  insuranceType: InsuranceType;
}

export interface HealthQuoteData extends BaseFormData {
  insuranceType: 'health';
  personalInfo: PersonalInfo;
  coverageType: 'individual' | 'family' | 'couple';
  dependents?: number;
  preExistingConditions?: boolean;
  preExistingList?: string[];
  acceptTerms: boolean;
}

export interface LifeQuoteData extends BaseFormData {
  insuranceType: 'life';
  personalInfo: PersonalInfo;
  coverageAmount: number;
  occupation: string;
  smoker?: boolean;
  beneficiaries?: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
  acceptTerms: boolean;
}

export interface LifeSavingsQuoteData extends BaseFormData {
  insuranceType: 'life_savings';
  personalInfo: PersonalInfo;
  coverageAmount: number;
  savingsGoal: number;
  termYears: number;
  beneficiaries?: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
  acceptTerms: boolean;
}

export interface VehicleQuoteData extends BaseFormData {
  insuranceType: 'vehicle';
  personalInfo: PersonalInfo;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleValue: number;
  coverageType: string;
  hasFinancing?: boolean;
  acceptTerms: boolean;
}

export type QuoteFormData =
  | HealthQuoteData
  | LifeQuoteData
  | LifeSavingsQuoteData
  | VehicleQuoteData;

// Claim types
export interface BaseClaimData {
  insuranceType: 'health' | 'vehicle';
  policyNumber: string;
  claimType: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  incidentDate: string;
  description: string;
}

export interface HealthClaimData extends BaseClaimData {
  insuranceType: 'health';
  medicalCenter?: string;
  diagnosis?: string;
  totalAmount?: number;
}

export interface VehicleClaimData extends BaseClaimData {
  insuranceType: 'vehicle';
  vehiclePlate?: string;
  location?: string;
  policeReport?: boolean;
  policeReportNumber?: string;
  estimatedDamage?: number;
}
