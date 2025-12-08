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

export interface VehicleDetails {
  plate: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  [key: string]: any;
}

export interface Policy {
  policyNumber: string;
  plan: Plan;
  parsedDetails: VehicleDetails;
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
  parsedDetails?: VehicleDetails;
}

export interface SelectOption {
  value: string;
  label: string;
}
