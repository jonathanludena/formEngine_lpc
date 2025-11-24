// Insurance Types
export type InsuranceType = 'health' | 'life' | 'life_savings' | 'vehicle';

// Brand Types
export type BrandId = 'brand_A' | 'brand_B' | 'default';

// Personal Information
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  identificationType: 'cedula' | 'passport' | 'ruc';
  identificationNumber: string;
}

// Insurance Quote Types
export interface BaseQuoteData {
  insuranceType: InsuranceType;
  personalInfo: PersonalInfo;
  acceptTerms: boolean;
}

export interface HealthQuoteData extends BaseQuoteData {
  insuranceType: 'health';
  coverageType: 'individual' | 'family' | 'couple';
  dependents?: number;
  preExistingConditions: boolean;
  preferredHospitals?: string[];
  // List of selected preexisting condition keys
  preExistingList?: string[];
}

export interface LifeQuoteData extends BaseQuoteData {
  insuranceType: 'life';
  coverageAmount: number;
  beneficiaries: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
  occupation: string;
  smoker: boolean;
}

export interface LifeSavingsQuoteData extends BaseQuoteData {
  insuranceType: 'life_savings';
  coverageAmount: number;
  savingsGoal: number;
  termYears: number;
  beneficiaries: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
}

export interface VehicleQuoteData extends BaseQuoteData {
  insuranceType: 'vehicle';
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'suv';
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleValue: number;
  coverageType: 'basic' | 'complete' | 'premium';
  hasFinancing: boolean;
}

export type QuoteFormData =
  | HealthQuoteData
  | LifeQuoteData
  | LifeSavingsQuoteData
  | VehicleQuoteData;

// Claim Types
export interface BaseClaimData {
  insuranceType: InsuranceType;
  policyNumber: string;
  personalInfo: Pick<PersonalInfo, 'firstName' | 'lastName' | 'email' | 'phone'>;
  incidentDate: string;
  description: string;
  attachments?: File[];
}

export interface HealthClaimData extends BaseClaimData {
  insuranceType: 'health';
  claimType: 'consultation' | 'hospitalization' | 'surgery' | 'medication';
  medicalCenter: string;
  diagnosis?: string;
  totalAmount: number;
}

export interface VehicleClaimData extends BaseClaimData {
  insuranceType: 'vehicle';
  claimType: 'accident' | 'theft' | 'damage' | 'total_loss';
  vehiclePlate: string;
  location: string;
  policeReport: boolean;
  policeReportNumber?: string;
  estimatedDamage: number;
}

export type ClaimFormData = HealthClaimData | VehicleClaimData;

// Insurance Company Data
export interface InsuranceCompany {
  id: string;
  name: string;
  logo: string;
}

// Quote Result
export interface QuoteResult {
  company: InsuranceCompany;
  monthlyPremium: number;
  annualPremium: number;
  deductible: number;
  coverage: {
    [key: string]: string | number | boolean;
  };
  benefits: string[];
  exclusions: string[];
}

// Form Props
export interface BaseFormProps<T> {
  brand?: BrandId;
  onSubmit: (data: T) => void | Promise<void>;
  initialData?: Partial<T>;
  isLoading?: boolean;
}
