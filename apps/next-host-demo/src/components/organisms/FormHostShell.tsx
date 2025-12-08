'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { FORM_EVENTS } from '@jonathanludena/form-engine';
import type {
  FormStartDetail,
  FormSubmitDataDetail,
  FormResultDetail,
} from '@jonathanludena/form-engine';

// Dynamic imports with no SSR
const ClaimForm = dynamic(
  () => import('@jonathanludena/form-engine').then((mod) => mod.ClaimForm),
  { ssr: false, loading: () => <FormSkeleton /> }
);

const InsuranceQuoteForm = dynamic(
  () => import('@jonathanludena/form-engine').then((mod) => mod.InsuranceQuoteForm),
  { ssr: false, loading: () => <FormSkeleton /> }
);

interface FormHostShellProps<T = unknown> {
  formType: 'claim' | 'quote';
  config: FormStartDetail<T>;
  onSubmit: (data: T) => Promise<{ ok: boolean; message?: string; error?: string; resultId?: string }>;
  children?: ReactNode;
}

function FormSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="space-y-3 pt-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function FormHostShell<T = unknown>({ formType, config, onSubmit }: FormHostShellProps<T>) {
  const formRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form with config
  useEffect(() => {
    if (formRef.current && !isInitialized) {
      const timer = setTimeout(() => {
        formRef.current?.dispatchEvent(
          new CustomEvent(FORM_EVENTS.START, {
            detail: config,
            bubbles: true,
          })
        );
        setIsInitialized(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [config, isInitialized]);

  // Listen for form submission
  useEffect(() => {
    const handleFormSubmit = async (e: Event) => {
      const customEvent = e as CustomEvent<FormSubmitDataDetail<T>>;

      // Check if this is data submission (from form)
      if ('data' in customEvent.detail) {
        // Set loading state
        formRef.current?.dispatchEvent(
          new CustomEvent(FORM_EVENTS.SUBMIT, {
            detail: { isLoading: true },
            bubbles: true,
          })
        );

        try {
          // Call the provided onSubmit handler
          const result = await onSubmit(customEvent.detail.data);

          // Clear loading state
          formRef.current?.dispatchEvent(
            new CustomEvent(FORM_EVENTS.SUBMIT, {
              detail: { isLoading: false },
              bubbles: true,
            })
          );

          // Send result to form
          formRef.current?.dispatchEvent(
            new CustomEvent<FormResultDetail>(FORM_EVENTS.RESULT, {
              detail: result,
              bubbles: true,
            })
          );
        } catch (error) {
          // Clear loading state
          formRef.current?.dispatchEvent(
            new CustomEvent(FORM_EVENTS.SUBMIT, {
              detail: { isLoading: false },
              bubbles: true,
            })
          );

          // Send error result
          formRef.current?.dispatchEvent(
            new CustomEvent<FormResultDetail>(FORM_EVENTS.RESULT, {
              detail: {
                ok: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
              },
              bubbles: true,
            })
          );
        }
      }
    };

    const currentForm = formRef.current;
    if (currentForm) {
      currentForm.addEventListener(FORM_EVENTS.SUBMIT, handleFormSubmit);
    }

    return () => {
      if (currentForm) {
        currentForm.removeEventListener(FORM_EVENTS.SUBMIT, handleFormSubmit);
      }
    };
  }, [onSubmit]);

  const FormComponent = formType === 'claim' ? ClaimForm : InsuranceQuoteForm;

  return <FormComponent ref={formRef} />;
}
