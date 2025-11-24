import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .regex(/^\+?[\d\s-()]+$/, 'Formato de teléfono inválido'),
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 100;
  }, 'Debe ser mayor de 18 años'),
  identificationType: z.enum(['cedula', 'passport', 'ruc']),
  identificationNumber: z.string().min(5, 'Número de identificación inválido'),
});

// Base Quote Schema
const baseQuoteSchema = z.object({
  personalInfo: personalInfoSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debe aceptar los términos y condiciones',
  }),
});

// Health Quote Schema
export const healthQuoteSchema = baseQuoteSchema.extend({
  insuranceType: z.literal('health'),
  coverageType: z.enum(['individual', 'family', 'couple']),
  dependents: z.number().min(0).max(10).optional(),
  preExistingConditions: z.boolean(),
  preferredHospitals: z.array(z.string()).optional(),
  preExistingList: z.array(z.string()).optional(),
});

// Life Quote Schema
const beneficiarySchema = z.object({
  name: z.string().min(2, 'El nombre del beneficiario es requerido'),
  relationship: z.string().min(2, 'La relación es requerida'),
  percentage: z.number().min(1).max(100),
});

export const lifeQuoteSchema = baseQuoteSchema.extend({
  insuranceType: z.literal('life'),
  coverageAmount: z.number().min(5000).max(1000000),
  beneficiaries: z
    .array(beneficiarySchema)
    .min(1, 'Debe agregar al menos un beneficiario')
    .refine(
      (beneficiaries) => {
        const total = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
        return total === 100;
      },
      { message: 'La suma de porcentajes debe ser 100%' }
    ),
  occupation: z.string().min(2, 'La ocupación es requerida'),
  smoker: z.boolean(),
});

// Life Savings Quote Schema
export const lifeSavingsQuoteSchema = baseQuoteSchema.extend({
  insuranceType: z.literal('life_savings'),
  coverageAmount: z.number().min(5000).max(1000000),
  savingsGoal: z.number().min(1000).max(500000),
  termYears: z.number().min(5).max(30),
  beneficiaries: z
    .array(beneficiarySchema)
    .min(1, 'Debe agregar al menos un beneficiario')
    .refine(
      (beneficiaries) => {
        const total = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
        return total === 100;
      },
      { message: 'La suma de porcentajes debe ser 100%' }
    ),
});

// Vehicle Quote Schema
export const vehicleQuoteSchema = baseQuoteSchema.extend({
  insuranceType: z.literal('vehicle'),
  vehicleType: z.enum(['car', 'motorcycle', 'truck', 'suv']),
  vehicleBrand: z.string().min(2, 'La marca del vehículo es requerida'),
  vehicleModel: z.string().min(2, 'El modelo del vehículo es requerido'),
  vehicleYear: z
    .number()
    .min(1990, 'El año debe ser 1990 o posterior')
    .max(new Date().getFullYear() + 1, 'Año inválido'),
  vehicleValue: z.number().min(1000).max(500000),
  coverageType: z.enum(['basic', 'complete', 'premium']),
  hasFinancing: z.boolean(),
});

// Union Quote Schema
export const quoteSchema = z.discriminatedUnion('insuranceType', [
  healthQuoteSchema,
  lifeQuoteSchema,
  lifeSavingsQuoteSchema,
  vehicleQuoteSchema,
]);

export type QuoteSchemaType = z.infer<typeof quoteSchema>;
