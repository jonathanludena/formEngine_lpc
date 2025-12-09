'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

interface ClaimTokenResult {
  token: string | null;
  hasToken: boolean;
}

/**
 * Reads the claim prefill token from the URL without coupling it to a specific form.
 */
export function useClaimToken(paramName = 'tk'): ClaimTokenResult {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const value = searchParams?.get(paramName) ?? null;
    const token = value && value.trim().length > 0 ? value : null;
    return { token, hasToken: Boolean(token) };
  }, [paramName, searchParams]);
}
