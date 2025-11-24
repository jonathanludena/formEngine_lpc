import { InsuranceCompany, QuoteResult } from '@/lib/types';

export const mockInsuranceCompanies: InsuranceCompany[] = [
  {
    id: 'seguros-del-pichincha',
    name: 'Seguros del Pichincha',
    logo: 'https://via.placeholder.com/150x50?text=Pichincha',
  },
  {
    id: 'equinoccial',
    name: 'Equinoccial Seguros',
    logo: 'https://via.placeholder.com/150x50?text=Equinoccial',
  },
  {
    id: 'liberty',
    name: 'Liberty Seguros',
    logo: 'https://via.placeholder.com/150x50?text=Liberty',
  },
  {
    id: 'seguros-sucre',
    name: 'Seguros Sucre',
    logo: 'https://via.placeholder.com/150x50?text=Sucre',
  },
  {
    id: 'confianza',
    name: 'Seguros Confianza',
    logo: 'https://via.placeholder.com/150x50?text=Confianza',
  },
];

export const generateMockHealthQuote = (): QuoteResult[] => {
  return [
    {
      company: mockInsuranceCompanies[0],
      monthlyPremium: 85.5,
      annualPremium: 1026,
      deductible: 150,
      coverage: {
        consultations: 'Ilimitadas',
        hospitalization: '$50,000',
        surgery: '$30,000',
        emergencies: '24/7',
        medications: '80% cobertura',
      },
      benefits: [
        'Red de clínicas premium',
        'Telemedicina incluida',
        'Chequeo anual sin costo',
        'Cobertura internacional',
      ],
      exclusions: [
        'Enfermedades preexistentes no declaradas',
        'Cirugías estéticas',
        'Tratamientos experimentales',
      ],
    },
    {
      company: mockInsuranceCompanies[1],
      monthlyPremium: 72.0,
      annualPremium: 864,
      deductible: 200,
      coverage: {
        consultations: 'Ilimitadas',
        hospitalization: '$40,000',
        surgery: '$25,000',
        emergencies: '24/7',
        medications: '70% cobertura',
      },
      benefits: [
        'Red amplia de clínicas',
        'Telemedicina',
        'Descuentos en farmacias',
      ],
      exclusions: [
        'Enfermedades preexistentes',
        'Cirugías estéticas',
      ],
    },
    {
      company: mockInsuranceCompanies[2],
      monthlyPremium: 95.0,
      annualPremium: 1140,
      deductible: 100,
      coverage: {
        consultations: 'Ilimitadas',
        hospitalization: '$60,000',
        surgery: '$40,000',
        emergencies: '24/7',
        medications: '90% cobertura',
      },
      benefits: [
        'Red premium internacional',
        'Telemedicina 24/7',
        'Chequeos preventivos',
        'Cobertura dental básica',
        'Asistencia en viajes',
      ],
      exclusions: [
        'Enfermedades preexistentes no declaradas',
        'Tratamientos estéticos',
      ],
    },
  ];
};

export const generateMockVehicleQuote = (): QuoteResult[] => {
  return [
    {
      company: mockInsuranceCompanies[0],
      monthlyPremium: 45.0,
      annualPremium: 540,
      deductible: 250,
      coverage: {
        liability: 'Hasta $50,000',
        theft: 'Valor comercial',
        collision: 'Valor comercial',
        natural_disasters: 'Incluido',
      },
      benefits: [
        'Asistencia vial 24/7',
        'Vehículo de reemplazo',
        'Gastos médicos pasajeros',
        'Asesoría legal',
      ],
      exclusions: [
        'Conductor sin licencia',
        'Bajo efectos de alcohol',
        'Competencias deportivas',
      ],
    },
    {
      company: mockInsuranceCompanies[3],
      monthlyPremium: 38.5,
      annualPremium: 462,
      deductible: 300,
      coverage: {
        liability: 'Hasta $40,000',
        theft: 'Valor comercial',
        collision: 'Valor comercial',
        natural_disasters: 'Incluido',
      },
      benefits: [
        'Asistencia vial',
        'Grúa incluida',
        'Gastos médicos',
      ],
      exclusions: [
        'Conductor sin licencia',
        'Intoxicación',
      ],
    },
  ];
};

export const generateMockLifeQuote = (): QuoteResult[] => {
  return [
    {
      company: mockInsuranceCompanies[1],
      monthlyPremium: 35.0,
      annualPremium: 420,
      deductible: 0,
      coverage: {
        death: '$100,000',
        accidental_death: '$200,000',
        disability: '$50,000',
      },
      benefits: [
        'Cobertura mundial',
        'Sin examen médico requerido',
        'Pago inmediato a beneficiarios',
      ],
      exclusions: [
        'Suicidio en primer año',
        'Actividades de alto riesgo',
        'Enfermedades preexistentes graves',
      ],
    },
    {
      company: mockInsuranceCompanies[4],
      monthlyPremium: 42.0,
      annualPremium: 504,
      deductible: 0,
      coverage: {
        death: '$150,000',
        accidental_death: '$300,000',
        disability: '$75,000',
        critical_illness: '$30,000',
      },
      benefits: [
        'Cobertura internacional',
        'Adelanto por enfermedad terminal',
        'Beneficios adicionales por accidente',
        'Asesoría financiera a beneficiarios',
      ],
      exclusions: [
        'Suicidio primer año',
        'Deportes extremos',
      ],
    },
  ];
};
