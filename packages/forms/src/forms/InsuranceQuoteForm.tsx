// Simplified InsuranceQuoteForm with CustomEvents
// Full implementation would follow same pattern as ClaimForm
import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FormField, FormCheckbox } from '../components/atoms';
import { Loader2 } from 'lucide-react';
import { FORM_EVENTS } from '../events/constants';
import {
  FormStartDetail,
  FormSubmitDataDetail,
  FormSubmitLoadingDetail,
  FormResultDetail,
  isFormSubmitLoading,
} from '../events/types';
import { QuoteFormData, BrandId } from '../types';
import { getBrandCopies } from '../data';
import { healthQuoteSchema } from '../lib/schemas';

export interface InsuranceQuoteFormProps {
  className?: string;
}

export const InsuranceQuoteForm = forwardRef<HTMLDivElement, InsuranceQuoteFormProps>(
  ({ className }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [brand, setBrand] = useState<BrandId>('LPC001');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FormResultDetail | null>(null);

    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    const copies = getBrandCopies(brand).quoteForm;

    const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<QuoteFormData>({
      resolver: zodResolver(healthQuoteSchema),
      mode: 'onChange',
      defaultValues: {
        insuranceType: 'health',
        acceptTerms: false,
      } as Partial<QuoteFormData>,
    });

    const handleFormSubmit = async (data: QuoteFormData) => {
      if (rootRef.current) {
        const event = new CustomEvent<FormSubmitDataDetail<QuoteFormData>>(FORM_EVENTS.SUBMIT, {
          detail: { data },
          bubbles: true,
        });
        rootRef.current.dispatchEvent(event);
      }
    };

    // Listen for form:start
    useEffect(() => {
      const handleStart = (e: Event) => {
        const customEvent = e as CustomEvent<FormStartDetail<QuoteFormData>>;
        const { brand: newBrand, insurance, initialData } = customEvent.detail;

        if (newBrand) setBrand(newBrand as BrandId);

        if (initialData) {
          reset({
            insuranceType: insurance,
            ...initialData,
          } as Partial<QuoteFormData>);
        }
      };

      const currentRoot = rootRef.current;
      if (currentRoot) {
        currentRoot.addEventListener(FORM_EVENTS.START, handleStart);
      }

      return () => {
        if (currentRoot) {
          currentRoot.removeEventListener(FORM_EVENTS.START, handleStart);
        }
      };
    }, [reset]);

    // Listen for form:submit loading state
    useEffect(() => {
      const handleSubmitResponse = (e: Event) => {
        const customEvent = e as CustomEvent<FormSubmitLoadingDetail>;
        if (isFormSubmitLoading(customEvent.detail)) {
          setIsLoading(customEvent.detail.isLoading);
        }
      };

      const currentRoot = rootRef.current;
      if (currentRoot) {
        currentRoot.addEventListener(FORM_EVENTS.SUBMIT, handleSubmitResponse);
      }

      return () => {
        if (currentRoot) {
          currentRoot.removeEventListener(FORM_EVENTS.SUBMIT, handleSubmitResponse);
        }
      };
    }, []);

    // Listen for form:result
    useEffect(() => {
      const handleResult = (e: Event) => {
        const customEvent = e as CustomEvent<FormResultDetail>;
        setResult(customEvent.detail);

        if (customEvent.detail.ok) {
          reset();
        }
      };

      const currentRoot = rootRef.current;
      if (currentRoot) {
        currentRoot.addEventListener(FORM_EVENTS.RESULT, handleResult);
      }

      return () => {
        if (currentRoot) {
          currentRoot.removeEventListener(FORM_EVENTS.RESULT, handleResult);
        }
      };
    }, [reset]);

    return (
      <div ref={rootRef} className={className}>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">{copies.title}</CardTitle>
            <CardDescription>{copies.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            {result && result.ok && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium">
                  {result.message || '¡Cotización enviada exitosamente!'}
                </p>
                {result.resultId && (
                  <p className="text-sm text-green-600 mt-1">ID: {result.resultId}</p>
                )}
              </div>
            )}

            {result && !result.ok && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-medium">
                  {result.error || 'Error al enviar la cotización'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Simplified form - full implementation would include all insurance types */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={copies.fields.firstName.label}
                    placeholder={copies.fields.firstName.placeholder}
                    error={errors.personalInfo?.firstName?.message}
                    {...register('personalInfo.firstName')}
                  />

                  <FormField
                    label={copies.fields.lastName.label}
                    placeholder={copies.fields.lastName.placeholder}
                    error={errors.personalInfo?.lastName?.message}
                    {...register('personalInfo.lastName')}
                  />
                </div>

                <FormField
                  label={copies.fields.email.label}
                  type="email"
                  placeholder={copies.fields.email.placeholder}
                  error={errors.personalInfo?.email?.message}
                  {...register('personalInfo.email')}
                />

                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <FormCheckbox
                      ref={field.ref}
                      label={copies.fields.acceptTerms.label}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      error={errors.acceptTerms?.message}
                    />
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="min-w-[200px]"
                >
                  {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {copies.buttons.submit}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
);

InsuranceQuoteForm.displayName = 'InsuranceQuoteForm';
