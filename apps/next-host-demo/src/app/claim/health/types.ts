export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Insurer {
  name: string;
}

export interface Plan {
  name: string;
  insurer: Insurer;
}

export interface Dependent {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  birthDate: string;
  identificationType: string;
  identificationNumber: string;
}

export interface MedicalCenter {
  id: string;
  name: string;
  type: string;
  city: string;
}

export interface Policy {
  policyNumber: string;
  plan: Plan;
  parsedDetails: any; // O un tipo más específico si se conoce la estructura
  dependents: Dependent[];
  medicalCenters: MedicalCenter[];
  customer: Customer;
  customerId: string;
}

export interface PolicyListItem {
  policyNumber: string;
  plan?: {
    name: string;
    insurer?: {
      name: string;
    };
  };
}

export interface SelectOption {
  value: string;
  label: string;
}
