import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ClaimFormData } from '@/lib/types';

export function useClaimPage() {
  const location = useLocation();
  const locationInsuranceType = location.state?.prod as 'health' | 'vehicle' | undefined;

  const [insuranceType, setInsuranceType] = useState<'health' | 'vehicle'>(
    locationInsuranceType || 'health'
  );
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<
    | { id: string; message: string; submittedAt: string; data?: Partial<ClaimFormData> }
    | null
  >(null);

  useEffect(() => {
    if (locationInsuranceType && locationInsuranceType !== insuranceType) {
      setInsuranceType(locationInsuranceType);
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationInsuranceType]);

  const handleSubmit = useCallback(async (data: ClaimFormData) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const id = `CLM-${Date.now().toString().slice(-6)}`;
    const submittedAt = new Date().toISOString();

    setIsLoading(false);
    setSubmissionResult({ id, message: 'Reclamo recibido correctamente', submittedAt, data });
    setSubmitted(true);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const selectType = useCallback((type: 'health' | 'vehicle') => {
    setInsuranceType(type);
    setSubmitted(false);
  }, []);

  const resetSubmitted = useCallback(() => setSubmitted(false), []);

  return {
    insuranceType,
    submitted,
    isLoading,
    submissionResult,
    handleSubmit,
    selectType,
    resetSubmitted,
  } as const;
}

export type UseClaimPage = ReturnType<typeof useClaimPage>;
