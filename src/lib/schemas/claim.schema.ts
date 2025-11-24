import { z } from 'zod';

// Base Claim Schema
const baseClaimSchema = z.object({
  policyNumber: z.string().min(5, 'Número de póliza inválido'),
  personalInfo: z.object({
    firstName: z.string().min(2, 'El nombre es requerido'),
    lastName: z.string().min(2, 'El apellido es requerido'),
    email: z.string().email('Email inválido'),
    phone: z
      .string()
      .min(10, 'El teléfono debe tener al menos 10 dígitos')
      .regex(/^\+?[\d\s-()]+$/, 'Formato de teléfono inválido'),
  }),
  incidentDate: z
    .string()
    .refine((date) => new Date(date) <= new Date(), 'La fecha no puede ser futura'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres').max(500),
});

// Health Claim Schema
export const healthClaimSchema = baseClaimSchema
  .extend({
    insuranceType: z.literal('health'),
    claimType: z.enum(['consultation', 'hospitalization', 'surgery', 'medication']),
    medicalCenter: z.string().min(2, 'El centro médico es requerido'),
    diagnosis: z.string().optional(),
    totalAmount: z.number().min(1, 'El monto debe ser mayor a 0'),
  });

// Vehicle Claim Schema
const vehicleClaimBaseSchema = baseClaimSchema.extend({
  insuranceType: z.literal('vehicle'),
  claimType: z.enum(['accident', 'theft', 'damage', 'total_loss']),
  vehiclePlate: z.string().min(5, 'Placa inválida'),
  location: z.string().min(5, 'La ubicación es requerida'),
  policeReport: z.boolean(),
  policeReportNumber: z.string().optional(),
  estimatedDamage: z.number().min(0),
});

export const vehicleClaimSchema = vehicleClaimBaseSchema.refine(
  (data) => {
    if (data.policeReport && !data.policeReportNumber) {
      return false;
    }
    return true;
  },
  {
    message: 'Número de reporte policial requerido cuando existe reporte',
    path: ['policeReportNumber'],
  }
);

// Union Claim Schema
export const claimSchema = z.union([
  healthClaimSchema,
  vehicleClaimSchema,
]);

export type ClaimSchemaType = z.infer<typeof claimSchema>;
