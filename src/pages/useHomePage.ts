import { useMemo } from 'react';

type Item = {
  title: string;
  description: string;
  icon: string;
  prod: string;
  color: string;
  to: string;
  state: { prod: string };
};

export function useHomePage() {
  const features: Item[] = useMemo(
    () => [
      {
        title: 'Seguro de Salud',
        description: 'Protección médica completa para ti y tu familia',
        icon: '🏥',
        prod: 'health',
        color: 'bg-blue-50 dark:bg-blue-950',
        to: '/formEngine_lpc/cotizar',
        state: { prod: 'health' },
      },
      {
        title: 'Seguro Vehicular',
        description: 'Cobertura integral para tu vehículo',
        icon: '🚗',
        prod: 'vehicle',
        color: 'bg-green-50 dark:bg-green-950',
        to: '/formEngine_lpc/cotizar',
        state: { prod: 'vehicle' },
      },
      {
        title: 'Seguro de Vida',
        description: 'Tranquilidad para tu familia',
        icon: '💼',
        prod: 'life',
        color: 'bg-purple-50 dark:bg-purple-950',
        to: '/formEngine_lpc/cotizar',
        state: { prod: 'life' },
      },
      {
        title: 'Seguro de Vida y Ahorro',
        description: 'Protección y ahorro para tu futuro',
        icon: '💰',
        prod: 'life_savings',
        color: 'bg-green-50 dark:bg-green-950',
        to: '/formEngine_lpc/cotizar',
        state: { prod: 'life_savings' },
      },
    ],
    []
  );

  const claimOptions: Item[] = useMemo(
    () => [
      {
        title: 'Reclamo de Salud',
        description: 'Reporta un reclamo médico o de hospitalización',
        icon: '📋',
        prod: 'health',
        color: 'bg-red-50 dark:bg-red-950',
        to: '/formEngine_lpc/reclamos',
        state: { prod: 'health' },
      },
      {
        title: 'Reclamo Vehicular',
        description: 'Reporta un siniestro de tu vehículo',
        icon: '🚨',
        prod: 'vehicle',
        color: 'bg-orange-50 dark:bg-orange-950',
        to: '/formEngine_lpc/reclamos',
        state: { prod: 'vehicle' },
      },
    ],
    []
  );

  return { features, claimOptions };
}

export type { Item };
