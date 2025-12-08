import type { ReactNode } from 'react';
import type { FormStartDetail } from '@jonathanludena/form-engine';

export interface FormHostShellProps<T = unknown> {
  formType: 'claim' | 'quote';
  config: FormStartDetail<T>;
  onSubmit: (data: T) => Promise<{ 
    ok: boolean; 
    message?: string; 
    error?: string; 
    resultId?: string 
  }>;
  children?: ReactNode;
}

export interface FormSubmitResult {
  ok: boolean;
  message?: string;
  error?: string;
  resultId?: string;
}
