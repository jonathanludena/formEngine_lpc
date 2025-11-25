import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\u00C0-\u024F\s'-]+$/, "El nombre contiene caracteres inválidos"),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\u00C0-\u024F\s'-]+$/, "El apellido contiene caracteres inválidos"),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .regex(/^\+593\d{9}$/, 'Teléfono inválido. Debe usar formato +593XXXXXXXXX'),
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return (
      birthDate <= today &&
      age >= 18 &&
      age <= 100
    );
  }, 'Fecha de nacimiento inválida'),
  identificationType: z.enum(['cedula', 'passport', 'ruc']),
  identificationNumber: z.string().min(1, 'Número de identificación inválido'),
}).refine((data) => {
  // refine identificationNumber according to identificationType
  const idType = data.identificationType;
  const idNum = data.identificationNumber;
  if (idType === 'cedula') {
    return /^\d{10}$/.test(idNum);
  }
  if (idType === 'ruc') {
    return /^\d{13}$/.test(idNum);
  }
  // passport: allow alphanumeric between 5 and 12
  if (idType === 'passport') {
    return /^[A-Za-z0-9]{5,12}$/.test(idNum);
  }
  return true;
}, {
  message: 'Número de identificación inválido para el tipo seleccionado',
  path: ['identificationNumber'],
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
  relationship: z
    .string()
    .min(2, 'La relación del beneficiario es requerida')
    .refine((val) => {
      const allowed = ['hijo', 'conyuge', 'padre', 'madre', 'hermano', 'pareja', 'esposa'];
      return allowed.includes(String(val).toLowerCase());
    }, 'Relación de beneficiario inválida'),
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
