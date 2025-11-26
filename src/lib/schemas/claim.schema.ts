import { z } from 'zod';

// Base Claim Schema
const baseClaimSchema = z.object({
  policyNumber: z.string().min(5, 'Número de póliza inválido'),
  personalInfo: z.object({
    firstName: z
      .string()
      .min(2, 'El nombre es requerido')
      .max(50)
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\u00C0-\u024F\s'-]+$/, 'El nombre contiene caracteres inválidos'),
    lastName: z
      .string()
      .min(2, 'El apellido es requerido')
      .max(50)
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\u00C0-\u024F\s'-]+$/, 'El apellido contiene caracteres inválidos'),
    email: z.string().email('Email inválido'),
    phone: z
      .string()
      .regex(/^\d{10,}$/, 'Teléfono inválido. Debe contener al menos 10 dígitos numéricos'),
  }),
  incidentDate: z
    .string()
    .refine((date) => new Date(date) <= new Date(), 'La fecha no puede ser futura'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.\-'"]+$/, 'La descripción contiene caracteres inválidos'),
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
