'use client';

import { useRef, useEffect, useState } from 'react';
import { FORM_EVENTS } from '@jonathanludena/form-engine';
import type {
  FormStartDetail,
  FormSubmitDataDetail,
  FormResultDetail,
} from '@jonathanludena/form-engine';
import type { FormSubmitResult } from './types';

interface UseFormHostLogicProps<T = unknown> {
  config: FormStartDetail<T>;
  onSubmit: (data: T) => Promise<FormSubmitResult>;
}

interface UseFormHostLogicReturn {
  formRef: React.RefObject<HTMLDivElement | null>;
  isInitialized: boolean;
}

/**
 * Custom hook that handles form initialization and submission logic
 * @param config - Form configuration to initialize the form
 * @param onSubmit - Callback to handle form submission
 */
export function useFormHostLogic<T = unknown>({
  config,
  onSubmit,
}: UseFormHostLogicProps<T>): UseFormHostLogicReturn {
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
    async function handleFormSubmit(e: Event) {
      const customEvent = e as CustomEvent<FormSubmitDataDetail<T>>;

      // Check if this is data submission (from form)
      if ('data' in customEvent.detail) {
        // Set loading state
        dispatchLoadingState(true);

        try {
          // Call the provided onSubmit handler
          const result = await onSubmit(customEvent.detail.data);

          // Clear loading state
          dispatchLoadingState(false);

          // Send result to form
          dispatchResult(result);
        } catch (error) {
          // Clear loading state
          dispatchLoadingState(false);

          // Send error result
          dispatchResult({
            ok: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          });
        }
      }
    }

    function dispatchLoadingState(isLoading: boolean) {
      formRef.current?.dispatchEvent(
        new CustomEvent(FORM_EVENTS.SUBMIT, {
          detail: { isLoading },
          bubbles: true,
        })
      );
    }

    function dispatchResult(result: FormSubmitResult) {
      formRef.current?.dispatchEvent(
        new CustomEvent<FormResultDetail>(FORM_EVENTS.RESULT, {
          detail: result,
          bubbles: true,
        })
      );
    }

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

  return { formRef, isInitialized };
}
