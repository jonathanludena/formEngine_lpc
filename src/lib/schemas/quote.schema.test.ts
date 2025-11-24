import { describe, it, expect } from 'vitest';
import {
  healthQuoteSchema,
  lifeQuoteSchema,
  lifeSavingsQuoteSchema,
  vehicleQuoteSchema,
  personalInfoSchema,
} from './quote.schema';

describe('personalInfoSchema', () => {
  it('validates valid personal information', () => {
    const validData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+593987654321',
      birthDate: '1990-01-01',
      identificationType: 'cedula' as const,
      identificationNumber: '1234567890',
    };
    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });

  it('rejects person under 18 years old', () => {
    const youngPerson = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+593987654321',
      birthDate: '2010-01-01',
      identificationType: 'cedula' as const,
      identificationNumber: '1234567890',
    };
    expect(() => personalInfoSchema.parse(youngPerson)).toThrow();
  });

  it('rejects person over 100 years old', () => {
    const oldPerson = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+593987654321',
      birthDate: '1900-01-01',
      identificationType: 'cedula' as const,
      identificationNumber: '1234567890',
    };
    expect(() => personalInfoSchema.parse(oldPerson)).toThrow();
  });
});

describe('healthQuoteSchema', () => {
  const basePersonalInfo = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+593987654321',
    birthDate: '1990-01-01',
    identificationType: 'cedula' as const,
    identificationNumber: '1234567890',
  };

  it('validates valid health quote', () => {
    const validData = {
      insuranceType: 'health' as const,
      personalInfo: basePersonalInfo,
      coverageType: 'individual' as const,
      preExistingConditions: false,
      acceptTerms: true,
    };
    expect(() => healthQuoteSchema.parse(validData)).not.toThrow();
  });

  it('validates family coverage with dependents', () => {
    const familyData = {
      insuranceType: 'health' as const,
      personalInfo: basePersonalInfo,
      coverageType: 'family' as const,
      dependents: 3,
      preExistingConditions: false,
      preferredHospitals: ['Hospital A', 'Hospital B'],
      acceptTerms: true,
    };
    expect(() => healthQuoteSchema.parse(familyData)).not.toThrow();
  });
});

describe('lifeQuoteSchema', () => {
  const basePersonalInfo = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+593987654321',
    birthDate: '1990-01-01',
    identificationType: 'cedula' as const,
    identificationNumber: '1234567890',
  };

  it('validates valid life quote with one beneficiary', () => {
    const validData = {
      insuranceType: 'life' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 100,
        },
      ],
      occupation: 'Ingeniero',
      smoker: false,
      acceptTerms: true,
    };
    expect(() => lifeQuoteSchema.parse(validData)).not.toThrow();
  });

  it('validates life quote with multiple beneficiaries summing 100%', () => {
    const validData = {
      insuranceType: 'life' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 100000,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 60,
        },
        {
          name: 'Pedro Pérez',
          relationship: 'Hijo',
          percentage: 40,
        },
      ],
      occupation: 'Médico',
      smoker: true,
      acceptTerms: true,
    };
    expect(() => lifeQuoteSchema.parse(validData)).not.toThrow();
  });

  it('rejects life quote with beneficiaries not summing 100%', () => {
    const invalidData = {
      insuranceType: 'life' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 60,
        },
        {
          name: 'Pedro Pérez',
          relationship: 'Hijo',
          percentage: 30,
        },
      ],
      occupation: 'Ingeniero',
      smoker: false,
      acceptTerms: true,
    };
    expect(() => lifeQuoteSchema.parse(invalidData)).toThrow('La suma de porcentajes debe ser 100%');
  });

  it('rejects life quote without beneficiaries', () => {
    const invalidData = {
      insuranceType: 'life' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      beneficiaries: [],
      occupation: 'Ingeniero',
      smoker: false,
      acceptTerms: true,
    };
    expect(() => lifeQuoteSchema.parse(invalidData)).toThrow('Debe agregar al menos un beneficiario');
  });

  it('rejects life quote with coverage amount below minimum', () => {
    const invalidData = {
      insuranceType: 'life' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 4000,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 100,
        },
      ],
      occupation: 'Ingeniero',
      smoker: false,
      acceptTerms: true,
    };
    expect(() => lifeQuoteSchema.parse(invalidData)).toThrow();
  });
});

describe('lifeSavingsQuoteSchema', () => {
  const basePersonalInfo = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+593987654321',
    birthDate: '1990-01-01',
    identificationType: 'cedula' as const,
    identificationNumber: '1234567890',
  };

  it('validates valid life savings quote', () => {
    const validData = {
      insuranceType: 'life_savings' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      savingsGoal: 20000,
      termYears: 10,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 100,
        },
      ],
      acceptTerms: true,
    };
    expect(() => lifeSavingsQuoteSchema.parse(validData)).not.toThrow();
  });

  it('validates life savings with multiple beneficiaries', () => {
    const validData = {
      insuranceType: 'life_savings' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 100000,
      savingsGoal: 50000,
      termYears: 20,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 50,
        },
        {
          name: 'Pedro Pérez',
          relationship: 'Hijo',
          percentage: 50,
        },
      ],
      acceptTerms: true,
    };
    expect(() => lifeSavingsQuoteSchema.parse(validData)).not.toThrow();
  });

  it('rejects life savings with beneficiaries not summing 100%', () => {
    const invalidData = {
      insuranceType: 'life_savings' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      savingsGoal: 20000,
      termYears: 10,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 75,
        },
      ],
      acceptTerms: true,
    };
    expect(() => lifeSavingsQuoteSchema.parse(invalidData)).toThrow('La suma de porcentajes debe ser 100%');
  });

  it('rejects life savings with term years below minimum', () => {
    const invalidData = {
      insuranceType: 'life_savings' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      savingsGoal: 20000,
      termYears: 3,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 100,
        },
      ],
      acceptTerms: true,
    };
    expect(() => lifeSavingsQuoteSchema.parse(invalidData)).toThrow();
  });

  it('rejects life savings with term years above maximum', () => {
    const invalidData = {
      insuranceType: 'life_savings' as const,
      personalInfo: basePersonalInfo,
      coverageAmount: 50000,
      savingsGoal: 20000,
      termYears: 35,
      beneficiaries: [
        {
          name: 'María Pérez',
          relationship: 'Esposa',
          percentage: 100,
        },
      ],
      acceptTerms: true,
    };
    expect(() => lifeSavingsQuoteSchema.parse(invalidData)).toThrow();
  });
});

describe('vehicleQuoteSchema', () => {
  const basePersonalInfo = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+593987654321',
    birthDate: '1990-01-01',
    identificationType: 'cedula' as const,
    identificationNumber: '1234567890',
  };

  it('validates valid vehicle quote', () => {
    const validData = {
      insuranceType: 'vehicle' as const,
      personalInfo: basePersonalInfo,
      vehicleType: 'car' as const,
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: 2020,
      vehicleValue: 25000,
      coverageType: 'complete' as const,
      hasFinancing: false,
      acceptTerms: true,
    };
    expect(() => vehicleQuoteSchema.parse(validData)).not.toThrow();
  });

  it('validates vehicle with financing', () => {
    const validData = {
      insuranceType: 'vehicle' as const,
      personalInfo: basePersonalInfo,
      vehicleType: 'suv' as const,
      vehicleBrand: 'Honda',
      vehicleModel: 'CR-V',
      vehicleYear: 2023,
      vehicleValue: 35000,
      coverageType: 'premium' as const,
      hasFinancing: true,
      acceptTerms: true,
    };
    expect(() => vehicleQuoteSchema.parse(validData)).not.toThrow();
  });

  it('rejects vehicle with year below 1990', () => {
    const invalidData = {
      insuranceType: 'vehicle' as const,
      personalInfo: basePersonalInfo,
      vehicleType: 'car' as const,
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: 1985,
      vehicleValue: 5000,
      coverageType: 'basic' as const,
      hasFinancing: false,
      acceptTerms: true,
    };
    expect(() => vehicleQuoteSchema.parse(invalidData)).toThrow();
  });

  it('rejects vehicle with future year', () => {
    const futureYear = new Date().getFullYear() + 2;
    const invalidData = {
      insuranceType: 'vehicle' as const,
      personalInfo: basePersonalInfo,
      vehicleType: 'car' as const,
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: futureYear,
      vehicleValue: 30000,
      coverageType: 'complete' as const,
      hasFinancing: false,
      acceptTerms: true,
    };
    expect(() => vehicleQuoteSchema.parse(invalidData)).toThrow();
  });
});
