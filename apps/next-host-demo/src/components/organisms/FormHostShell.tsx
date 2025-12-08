'use client';

import dynamic from 'next/dynamic';
import { useFormHostLogic } from './useFormHostLogic';
import { FormSkeleton } from './FormSkeleton';
import type { FormHostShellProps } from './types';

// Dynamic imports with no SSR
const ClaimForm = dynamic(
  () => import('@jonathanludena/form-engine').then((mod) => mod.ClaimForm),
  { ssr: false, loading: () => <FormSkeleton /> }
);

const InsuranceQuoteForm = dynamic(
  () => import('@jonathanludena/form-engine').then((mod) => mod.InsuranceQuoteForm),
  { ssr: false, loading: () => <FormSkeleton /> }
);

export function FormHostShell<T = unknown>({ formType, config, onSubmit }: FormHostShellProps<T>) {
  const { formRef } = useFormHostLogic({ config, onSubmit });

  const FormComponent = formType === 'claim' ? ClaimForm : InsuranceQuoteForm;

  return <FormComponent ref={formRef} />;
}
