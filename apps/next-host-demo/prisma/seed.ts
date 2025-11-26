import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.$transaction([
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
