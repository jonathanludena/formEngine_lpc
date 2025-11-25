import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMockHealthQuote } from '@/data';
import { InsuranceType, QuoteResult } from '@/lib/types';

export function useUnifiedQuotePage() {
  const location = useLocation();
  const locationInsuranceType = location.state?.prod as InsuranceType | undefined;

  const [insuranceType, setInsuranceType] = useState<InsuranceType>(
    locationInsuranceType || 'health'
  );
  const [quoteResults, setQuoteResults] = useState<QuoteResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationInsuranceType && locationInsuranceType !== insuranceType) {
      setInsuranceType(locationInsuranceType);
      setQuoteResults(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationInsuranceType]);

  const handleSubmit = useCallback(async (_data: unknown) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = generateMockHealthQuote();
    setQuoteResults(results);
    setIsLoading(false);

    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const insuranceTypes: { value: InsuranceType; label: string; color: string }[] = [
    { value: 'health', label: '🏥 Salud', color: 'bg-blue-100 dark:bg-blue-900' },
    { value: 'life', label: '💼 Vida', color: 'bg-purple-100 dark:bg-purple-900' },
    { value: 'life_savings', label: '💰 Vida y Ahorro', color: 'bg-green-100 dark:bg-green-900' },
    { value: 'vehicle', label: '🚗 Vehicular', color: 'bg-orange-100 dark:bg-orange-900' },
  ];

  const selectType = useCallback((type: InsuranceType) => {
    setInsuranceType(type);
    setQuoteResults(null);
  }, []);

  const clearResults = useCallback(() => setQuoteResults(null), []);

  return {
    insuranceType,
    insuranceTypes,
    quoteResults,
    isLoading,
    handleSubmit,
    selectType,
    clearResults,
  } as const;
}

export type UseUnifiedQuotePage = ReturnType<typeof useUnifiedQuotePage>;
