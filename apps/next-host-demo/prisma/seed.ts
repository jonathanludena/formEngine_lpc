import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.$transaction([
    prisma.planMedicalCenter.deleteMany(),
    prisma.medicalCenter.deleteMany(),
    prisma.dependent.deleteMany(),
    prisma.claim.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prospect.deleteMany(),
    prisma.insured.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.insurer.deleteMany(),
    prisma.broker.deleteMany(),
    prisma.canton.deleteMany(),
    prisma.province.deleteMany(),
    prisma.vehicleModel.deleteMany(),
    prisma.vehicleMake.deleteMany(),
    prisma.vehicleType.deleteMany(),
    prisma.occupation.deleteMany(),
    prisma.maritalStatus.deleteMany(),
    prisma.idDocumentType.deleteMany(),
  ]);

  // Create Broker
  const broker = await prisma.broker.create({
    data: {
      name: 'LPC Insurance Broker',
      code: 'LPC001',
      email: 'info@lpcbroker.com',
      phone: '+593-2-123-4567',
    },
  });

  console.log('✅ Broker created');

  // Create Insurers
  const insurers = await Promise.all([
    prisma.insurer.create({
      data: {
        name: 'Liberty Seguros Ecuador',
        code: 'LIBERTY',
        brokerId: broker.id,
      },
    }),
    prisma.insurer.create({
      data: {
        name: 'MetLife Ecuador',
        code: 'METLIFE',
        brokerId: broker.id,
      },
    }),
    prisma.insurer.create({
      data: {
        name: 'Seguros Equinoccial',
        code: 'EQUINOCCIAL',
        brokerId: broker.id,
      },
    }),
  ]);

  console.log('✅ Insurers created');

  // Create Plans
  const plans = await Promise.all([
    // Health Plans
    prisma.plan.create({
      data: {
        name: 'Plan Salud Básico',
        code: 'HEALTH-BASIC',
        insurerId: insurers[0].id,
        insuranceType: 'health',
        coverageType: 'basic',
        price: 85.00,
        description: 'Cobertura básica de salud para consultas y medicamentos',
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Plan Salud Familiar',
        code: 'HEALTH-FAMILY',
        insurerId: insurers[0].id,
        insuranceType: 'health',
        coverageType: 'family',
        price: 150.00,
        description: 'Cobertura familiar de salud con hospitalización',
      },
    }),
    // Vehicle Plans
    prisma.plan.create({
      data: {
        name: 'Plan Vehicular Básico',
        code: 'VEHICLE-BASIC',
        insurerId: insurers[1].id,
        insuranceType: 'vehicle',
        coverageType: 'basic',
        price: 280.00,
        description: 'Cobertura básica para vehículos',
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Plan Vehicular Premium',
        code: 'VEHICLE-PREMIUM',
        insurerId: insurers[1].id,
        insuranceType: 'vehicle',
        coverageType: 'premium',
        price: 450.00,
        description: 'Cobertura completa para vehículos',
      },
    }),
    // Life Plans
    prisma.plan.create({
      data: {
        name: 'Plan Vida Segura',
        code: 'LIFE-SECURE',
        insurerId: insurers[2].id,
        insuranceType: 'life',
        coverageType: 'complete',
        price: 120.00,
        description: 'Seguro de vida con cobertura completa',
      },
    }),
  ]);

  console.log('✅ Plans created');

  // Create Medical Centers
  const medicalCenters = await Promise.all([
    // Hospitals
    prisma.medicalCenter.create({
      data: {
        name: 'Hospital Metropolitano',
        code: 'HM-001',
        address: 'Av. Mariana de Jesús Oe7-47 y Occidental',
        city: 'Quito',
        province: 'Pichincha',
        phone: '+593-2-399-8000',
        email: 'info@hospitalmetropolitano.org',
        type: 'hospital',
      },
    }),
    prisma.medicalCenter.create({
      data: {
        name: 'Hospital de los Valles',
        code: 'HV-001',
        address: 'Av. Interoceánica Km. 12 1/2',
        city: 'Quito',
        province: 'Pichincha',
        phone: '+593-2-298-7000',
        email: 'contacto@hospitaldelosvalles.com',
        type: 'hospital',
      },
    }),
    prisma.medicalCenter.create({
      data: {
        name: 'Hospital Vozandes Quito',
        code: 'HVQ-001',
        address: 'Villalengua Oe2-37 y Av. 10 de Agosto',
        city: 'Quito',
        province: 'Pichincha',
        phone: '+593-2-226-2142',
        email: 'info@hospitalvozandes.org',
        type: 'hospital',
      },
    }),
    prisma.medicalCenter.create({
      data: {
        name: 'Hospital Luis Vernaza',
        code: 'HLV-001',
        address: 'Loja 700 y Av. del Periodista',
        city: 'Guayaquil',
        province: 'Guayas',
        phone: '+593-4-256-0300',
        email: 'info@hospitalvernaza.med.ec',
        type: 'hospital',
      },
    }),
    // Clinics
    prisma.medicalCenter.create({
      data: {
        name: 'Clínica Pasteur',
        code: 'CP-001',
        address: 'Av. Mariana de Jesús y Páez',
        city: 'Quito',
        province: 'Pichincha',
        phone: '+593-2-298-7000',
        email: 'contacto@clinicapasteur.com',
        type: 'clinic',
      },
    }),
    prisma.medicalCenter.create({
      data: {
        name: 'Clínica Kennedy',
        code: 'CK-001',
        address: 'Av. San Jorge y Av. 9 de Octubre',
        city: 'Guayaquil',
        province: 'Guayas',
        phone: '+593-4-228-9666',
        email: 'info@clinicakennedy.com',
        type: 'clinic',
      },
    }),
    // Laboratories
    prisma.medicalCenter.create({
      data: {
        name: 'Laboratorio Clínico AXXIS',
        code: 'LAB-001',
        address: 'Av. Amazonas N21-217 y Roca',
        city: 'Quito',
        province: 'Pichincha',
        phone: '+593-2-255-6690',
        email: 'contacto@axxis.com.ec',
        type: 'laboratory',
      },
    }),
    // Pharmacies
    prisma.medicalCenter.create({
      data: {
        name: 'Farmacia Cruz Azul',
        code: 'FA-001',
        address: 'Av. 6 de Diciembre y Wilson',
        city: 'Quito',
        province: 'Pichincha',
        phone: '+593-2-252-1000',
        email: 'info@cruzazul.com.ec',
        type: 'pharmacy',
      },
    }),
  ]);

  console.log('✅ Medical centers created');

  // Link Medical Centers to Health Plans
  await Promise.all([
    // Plan Salud Básico (plans[0]) - fewer centers
    prisma.planMedicalCenter.create({
      data: { planId: plans[0].id, medicalCenterId: medicalCenters[4].id }, // Clínica Pasteur
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[0].id, medicalCenterId: medicalCenters[6].id }, // Laboratorio
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[0].id, medicalCenterId: medicalCenters[7].id }, // Farmacia
    }),
    
    // Plan Salud Familiar (plans[1]) - all centers
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[0].id }, // Hospital Metropolitano
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[1].id }, // Hospital de los Valles
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[2].id }, // Hospital Vozandes
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[3].id }, // Hospital Luis Vernaza
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[4].id }, // Clínica Pasteur
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[5].id }, // Clínica Kennedy
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[6].id }, // Laboratorio
    }),
    prisma.planMedicalCenter.create({
      data: { planId: plans[1].id, medicalCenterId: medicalCenters[7].id }, // Farmacia
    }),
  ]);

  console.log('✅ Medical centers linked to plans');

  // Create Vehicle Makes (Ecuador market)
  const makes = await Promise.all([
    prisma.vehicleMake.create({ data: { name: 'Chevrolet', code: 'CHEVROLET' } }),
    prisma.vehicleMake.create({ data: { name: 'Toyota', code: 'TOYOTA' } }),
    prisma.vehicleMake.create({ data: { name: 'Nissan', code: 'NISSAN' } }),
    prisma.vehicleMake.create({ data: { name: 'Hyundai', code: 'HYUNDAI' } }),
    prisma.vehicleMake.create({ data: { name: 'Kia', code: 'KIA' } }),
    prisma.vehicleMake.create({ data: { name: 'Ford', code: 'FORD' } }),
    prisma.vehicleMake.create({ data: { name: 'Mazda', code: 'MAZDA' } }),
    prisma.vehicleMake.create({ data: { name: 'Suzuki', code: 'SUZUKI' } }),
  ]);

  console.log('✅ Vehicle makes created');

  // Create Vehicle Models
  await Promise.all([
    prisma.vehicleModel.create({ data: { name: 'Spark', code: 'SPARK', makeId: makes[0].id } }),
    prisma.vehicleModel.create({ data: { name: 'Sail', code: 'SAIL', makeId: makes[0].id } }),
    prisma.vehicleModel.create({ data: { name: 'Corolla', code: 'COROLLA', makeId: makes[1].id } }),
    prisma.vehicleModel.create({ data: { name: 'RAV4', code: 'RAV4', makeId: makes[1].id } }),
    prisma.vehicleModel.create({ data: { name: 'Sentra', code: 'SENTRA', makeId: makes[2].id } }),
    prisma.vehicleModel.create({ data: { name: 'X-Trail', code: 'XTRAIL', makeId: makes[2].id } }),
    prisma.vehicleModel.create({ data: { name: 'Accent', code: 'ACCENT', makeId: makes[3].id } }),
    prisma.vehicleModel.create({ data: { name: 'Tucson', code: 'TUCSON', makeId: makes[3].id } }),
    prisma.vehicleModel.create({ data: { name: 'Rio', code: 'RIO', makeId: makes[4].id } }),
    prisma.vehicleModel.create({ data: { name: 'Sportage', code: 'SPORTAGE', makeId: makes[4].id } }),
  ]);

  console.log('✅ Vehicle models created');

  // Create Vehicle Types
  await Promise.all([
    prisma.vehicleType.create({ data: { name: 'Sedán', code: 'SEDAN' } }),
    prisma.vehicleType.create({ data: { name: 'SUV', code: 'SUV' } }),
    prisma.vehicleType.create({ data: { name: 'Camioneta', code: 'TRUCK' } }),
    prisma.vehicleType.create({ data: { name: 'Hatchback', code: 'HATCHBACK' } }),
    prisma.vehicleType.create({ data: { name: 'Motocicleta', code: 'MOTORCYCLE' } }),
  ]);

  console.log('✅ Vehicle types created');

  // Create Provinces (Ecuador)
  const provinces = await Promise.all([
    prisma.province.create({ data: { name: 'Pichincha', code: 'PICHINCHA' } }),
    prisma.province.create({ data: { name: 'Guayas', code: 'GUAYAS' } }),
    prisma.province.create({ data: { name: 'Azuay', code: 'AZUAY' } }),
    prisma.province.create({ data: { name: 'Manabí', code: 'MANABI' } }),
    prisma.province.create({ data: { name: 'Tungurahua', code: 'TUNGURAHUA' } }),
    prisma.province.create({ data: { name: 'El Oro', code: 'ELORO' } }),
  ]);

  console.log('✅ Provinces created');

  // Create Cantons
  await Promise.all([
    // Pichincha
    prisma.canton.create({ data: { name: 'Quito', code: 'QUITO', provinceId: provinces[0].id } }),
    prisma.canton.create({ data: { name: 'Cayambe', code: 'CAYAMBE', provinceId: provinces[0].id } }),
    prisma.canton.create({ data: { name: 'Rumiñahui', code: 'RUMINAHUI', provinceId: provinces[0].id } }),
    // Guayas
    prisma.canton.create({ data: { name: 'Guayaquil', code: 'GUAYAQUIL', provinceId: provinces[1].id } }),
    prisma.canton.create({ data: { name: 'Durán', code: 'DURAN', provinceId: provinces[1].id } }),
    prisma.canton.create({ data: { name: 'Samborondón', code: 'SAMBORONDON', provinceId: provinces[1].id } }),
    // Azuay
    prisma.canton.create({ data: { name: 'Cuenca', code: 'CUENCA', provinceId: provinces[2].id } }),
    prisma.canton.create({ data: { name: 'Gualaceo', code: 'GUALACEO', provinceId: provinces[2].id } }),
    // Manabí
    prisma.canton.create({ data: { name: 'Manta', code: 'MANTA', provinceId: provinces[3].id } }),
    prisma.canton.create({ data: { name: 'Portoviejo', code: 'PORTOVIEJO', provinceId: provinces[3].id } }),
  ]);

  console.log('✅ Cantons created');

  // Create Occupations
  await Promise.all([
    prisma.occupation.create({ data: { name: 'Ingeniero/a', code: 'ENGINEER' } }),
    prisma.occupation.create({ data: { name: 'Médico/a', code: 'DOCTOR' } }),
    prisma.occupation.create({ data: { name: 'Abogado/a', code: 'LAWYER' } }),
    prisma.occupation.create({ data: { name: 'Contador/a', code: 'ACCOUNTANT' } }),
    prisma.occupation.create({ data: { name: 'Profesor/a', code: 'TEACHER' } }),
    prisma.occupation.create({ data: { name: 'Comerciante', code: 'MERCHANT' } }),
    prisma.occupation.create({ data: { name: 'Estudiante', code: 'STUDENT' } }),
    prisma.occupation.create({ data: { name: 'Empleado/a Privado', code: 'PRIVATE_EMPLOYEE' } }),
    prisma.occupation.create({ data: { name: 'Empleado/a Público', code: 'PUBLIC_EMPLOYEE' } }),
    prisma.occupation.create({ data: { name: 'Independiente', code: 'SELF_EMPLOYED' } }),
  ]);

  console.log('✅ Occupations created');

  // Create Marital Status
  await Promise.all([
    prisma.maritalStatus.create({ data: { name: 'Soltero/a', code: 'SINGLE' } }),
    prisma.maritalStatus.create({ data: { name: 'Casado/a', code: 'MARRIED' } }),
    prisma.maritalStatus.create({ data: { name: 'Divorciado/a', code: 'DIVORCED' } }),
    prisma.maritalStatus.create({ data: { name: 'Viudo/a', code: 'WIDOWED' } }),
    prisma.maritalStatus.create({ data: { name: 'Unión Libre', code: 'COMMON_LAW' } }),
  ]);

  console.log('✅ Marital statuses created');

  // Create ID Document Types
  await Promise.all([
    prisma.idDocumentType.create({ data: { name: 'Cédula', code: 'CEDULA' } }),
    prisma.idDocumentType.create({ data: { name: 'Pasaporte', code: 'PASSPORT' } }),
    prisma.idDocumentType.create({ data: { name: 'RUC', code: 'RUC' } }),
  ]);

  console.log('✅ ID document types created');

  // Create Customers (Clientes)
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'Juan',
        lastName: 'Pérez González',
        email: 'juan.perez@example.com',
        phone: '+593-99-123-4567',
        birthDate: new Date('1985-03-15'),
        identificationType: 'CEDULA',
        identificationNumber: '1712345678',
        address: 'Av. 6 de Diciembre N34-150 y Whymper',
        city: 'Quito',
        province: 'Pichincha',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'María',
        lastName: 'Rodríguez Salazar',
        email: 'maria.rodriguez@example.com',
        phone: '+593-98-765-4321',
        birthDate: new Date('1990-07-22'),
        identificationType: 'CEDULA',
        identificationNumber: '0912345678',
        address: 'Av. Francisco de Orellana, Mz. 111',
        city: 'Guayaquil',
        province: 'Guayas',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Carlos',
        lastName: 'Morales Castro',
        email: 'carlos.morales@example.com',
        phone: '+593-97-888-9999',
        birthDate: new Date('1978-11-05'),
        identificationType: 'CEDULA',
        identificationNumber: '0103456789',
        address: 'Av. Solano 1-58 y Av. 12 de Abril',
        city: 'Cuenca',
        province: 'Azuay',
      },
    }),
  ]);

  console.log('✅ Customers created');

  // Create Insured (Asegurados)
  const insured = await Promise.all([
    // Health Insurance for Juan Pérez - Póliza 1 (Plan Familiar)
    prisma.insured.create({
      data: {
        customerId: customers[0].id,
        policyNumber: 'POL-HEALTH-001',
        insuranceType: 'health',
        planId: plans[1].id, // Plan Salud Familiar
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'active',
        premium: 150.00,
        healthDetails: JSON.stringify({
          coverageAmount: 50000,
          deductible: 500,
          hospitalCoverage: true,
          emergencyCoverage: true,
          maternityIncluded: true,
          dentalIncluded: false,
          visionIncluded: false,
        }),
      },
    }),
    // Health Insurance for Juan Pérez - Póliza 2 (Plan Básico)
    prisma.insured.create({
      data: {
        customerId: customers[0].id,
        policyNumber: 'POL-HEALTH-002',
        insuranceType: 'health',
        planId: plans[0].id, // Plan Salud Básico
        startDate: new Date('2023-06-01'),
        endDate: new Date('2025-05-31'),
        status: 'active',
        premium: 80.00,
        healthDetails: JSON.stringify({
          coverageAmount: 25000,
          deductible: 1000,
          hospitalCoverage: true,
          emergencyCoverage: true,
          maternityIncluded: false,
          dentalIncluded: false,
          visionIncluded: false,
        }),
      },
    }),
    // Vehicle Insurance for María Rodríguez - Póliza 1 (Toyota Corolla)
    prisma.insured.create({
      data: {
        customerId: customers[1].id,
        policyNumber: 'POL-VEHICLE-001',
        insuranceType: 'vehicle',
        planId: plans[3].id, // Plan Vehicular Premium
        startDate: new Date('2024-06-15'),
        endDate: new Date('2025-06-14'),
        status: 'active',
        premium: 450.00,
        vehicleDetails: JSON.stringify({
          plate: 'GYE-1234',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'Plateado',
          chassis: 'JT2AE91A8M0123456',
          motor: '2NR-FE-1234567',
          insuredValue: 25000,
          useType: 'particular',
          coverageType: 'todo_riesgo',
        }),
      },
    }),
    // Vehicle Insurance for María Rodríguez - Póliza 2 (Chevrolet Spark)
    prisma.insured.create({
      data: {
        customerId: customers[1].id,
        policyNumber: 'POL-VEHICLE-002',
        insuranceType: 'vehicle',
        planId: plans[2].id, // Plan Vehicular Estándar
        startDate: new Date('2024-03-10'),
        endDate: new Date('2025-03-09'),
        status: 'active',
        premium: 280.00,
        vehicleDetails: JSON.stringify({
          plate: 'GYE-5678',
          make: 'Chevrolet',
          model: 'Spark',
          year: 2019,
          color: 'Rojo',
          chassis: 'KL1CM6L09FC123456',
          motor: 'LL0-8901234',
          insuredValue: 12000,
          useType: 'particular',
          coverageType: 'contra_terceros',
        }),
      },
    }),
    // Life Insurance for Carlos Morales
    prisma.insured.create({
      data: {
        customerId: customers[2].id,
        policyNumber: 'POL-LIFE-001',
        insuranceType: 'life',
        planId: plans[4].id, // Plan Vida Segura
        startDate: new Date('2023-03-01'),
        endDate: new Date('2033-02-28'),
        status: 'active',
        premium: 120.00,
        lifeDetails: JSON.stringify({
          coverageAmount: 100000,
          accidentalDeath: 200000,
          permanentDisability: 100000,
          beneficiaries: [
            { name: 'Ana Morales López', relationship: 'spouse', percentage: 60 },
            { name: 'Pedro Morales López', relationship: 'child', percentage: 40 },
          ],
        }),
      },
    }),
  ]);

  console.log('✅ Insured created');

  // Create Dependents
  await Promise.all([
    // Dependents for Juan Pérez (Health Insurance)
    prisma.dependent.create({
      data: {
        insuredId: insured[0].id,
        relationship: 'spouse',
        firstName: 'Ana',
        lastName: 'Martínez López',
        birthDate: new Date('1987-05-20'),
        gender: 'F',
        identificationType: 'CEDULA',
        identificationNumber: '1723456789',
        isActive: true,
      },
    }),
    prisma.dependent.create({
      data: {
        insuredId: insured[0].id,
        relationship: 'child',
        firstName: 'Sofía',
        lastName: 'Pérez Martínez',
        birthDate: new Date('2015-09-10'),
        gender: 'F',
        identificationType: 'CEDULA',
        identificationNumber: '1734567890',
        isActive: true,
      },
    }),
    prisma.dependent.create({
      data: {
        insuredId: insured[0].id,
        relationship: 'child',
        firstName: 'Diego',
        lastName: 'Pérez Martínez',
        birthDate: new Date('2018-02-25'),
        gender: 'M',
        identificationType: 'CEDULA',
        identificationNumber: '1745678901',
        isActive: true,
      },
    }),
    // Dependent for Carlos Morales (Life Insurance)
    prisma.dependent.create({
      data: {
        insuredId: insured[2].id,
        relationship: 'spouse',
        firstName: 'Ana',
        lastName: 'Morales López',
        birthDate: new Date('1980-08-15'),
        gender: 'F',
        identificationType: 'CEDULA',
        identificationNumber: '0104567890',
        isActive: true,
      },
    }),
    prisma.dependent.create({
      data: {
        insuredId: insured[2].id,
        relationship: 'child',
        firstName: 'Pedro',
        lastName: 'Morales López',
        birthDate: new Date('2010-04-30'),
        gender: 'M',
        identificationType: 'CEDULA',
        identificationNumber: '0105678901',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Dependents created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
