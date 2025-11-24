import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormField, FormSelect, FormCheckbox, SelectOption } from '@/components/atoms';
import { TermsModal } from '@/components/molecules/TermsModal';
import {
  healthQuoteSchema,
  lifeQuoteSchema,
  vehicleQuoteSchema,
  lifeSavingsQuoteSchema,
} from '@/lib/schemas';
import {
  QuoteFormData,
  BaseFormProps,
  BrandId,
  InsuranceType,
} from '@/lib/types';
import { getBrandCopies } from '@/data';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface InsuranceQuoteFormProps extends Omit<BaseFormProps<QuoteFormData>, 'onSubmit'> {
  brand?: BrandId;
  insuranceType: InsuranceType;
  onSubmit: (data: QuoteFormData) => void | Promise<void>;
  coverageOptions?: SelectOption[];
  vehicleTypes?: SelectOption[];
  coverageTypes?: SelectOption[];
}

export const InsuranceQuoteForm = ({
  brand = 'default',
  insuranceType,
  onSubmit,
  initialData,
  isLoading = false,
  coverageOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'family', label: 'Familiar' },
    { value: 'couple', label: 'Pareja' },
  ],
  vehicleTypes = [
    { value: 'car', label: 'Auto' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Camioneta' },
    { value: 'motorcycle', label: 'Motocicleta' },
  ],
  coverageTypes = [
    { value: 'basic', label: 'Básica' },
    { value: 'complete', label: 'Completa' },
    { value: 'premium', label: 'Premium' },
  ],
}: InsuranceQuoteFormProps) => {
  const copies = getBrandCopies(brand).quoteForm;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal-info');

  const identificationTypes: SelectOption[] = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'ruc', label: 'RUC' },
  ];

  const getSchema = () => {
    switch (insuranceType) {
      case 'health':
        return healthQuoteSchema;
      case 'life':
        return lifeQuoteSchema;
      case 'life_savings':
        return lifeSavingsQuoteSchema;
      case 'vehicle':
        return vehicleQuoteSchema;
      default:
        return healthQuoteSchema;
    }
  };

  const getTitle = () => {
    const titles = {
      health: 'Cotiza tu Seguro de Salud',
      life: 'Cotiza tu Seguro de Vida',
      life_savings: 'Cotiza tu Seguro de Vida y Ahorro',
      vehicle: 'Cotiza tu Seguro Vehicular',
    };
    return titles[insuranceType] || copies.title;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      insuranceType,
      acceptTerms: false,
      ...initialData,
    } as Partial<QuoteFormData>,
  });

  // Reset form when insurance type changes
  useEffect(() => {
    reset({
      insuranceType,
      acceptTerms: false,
      ...initialData,
    } as Partial<QuoteFormData>);
  }, [insuranceType, initialData, reset]);

  const acceptTerms = watch('acceptTerms');
  const coverageType = insuranceType === 'health' ? (watch('coverageType' as keyof QuoteFormData) as string | undefined) : null;

  // Beneficiaries for life insurance
  const { fields, append, remove } = useFieldArray<QuoteFormData, 'beneficiaries' extends keyof QuoteFormData ? 'beneficiaries' : never>({
    control,
    name: 'beneficiaries' as 'beneficiaries' extends keyof QuoteFormData ? 'beneficiaries' : never,
  });

  const handleTermsAccept = () => {
    setValue('acceptTerms', true);
    setShowTermsModal(false);
  };

  const handleFormSubmit = async (data: QuoteFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Type helper for accessing dynamic insurance-specific fields in errors
  const getFieldError = (fieldName: string): string | undefined => {
    return (errors as Record<string, { message?: string }>)[fieldName]?.message;
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{getTitle()}</CardTitle>
          <CardDescription>{copies.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Accordion type="single" value={activeSection} onValueChange={setActiveSection}>
              {/* Personal Information Section */}
              <AccordionItem value="personal-info">
                <AccordionTrigger>
                  <span className="text-lg font-semibold">{copies.steps.personalInfo}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label={copies.fields.email.label}
                        type="email"
                        placeholder={copies.fields.email.placeholder}
                        error={errors.personalInfo?.email?.message}
                        {...register('personalInfo.email')}
                      />

                      <FormField
                        label={copies.fields.phone.label}
                        type="tel"
                        placeholder={copies.fields.phone.placeholder}
                        error={errors.personalInfo?.phone?.message}
                        {...register('personalInfo.phone')}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label={copies.fields.birthDate.label}
                        type="date"
                        error={errors.personalInfo?.birthDate?.message}
                        {...register('personalInfo.birthDate')}
                      />

                      <Controller
                        name="personalInfo.identificationType"
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label={copies.fields.identificationType.label}
                            placeholder={copies.fields.identificationType.placeholder}
                            options={identificationTypes}
                            value={field.value}
                            onValueChange={field.onChange}
                            error={errors.personalInfo?.identificationType?.message}
                          />
                        )}
                      />
                    </div>

                    <FormField
                      label={copies.fields.identificationNumber.label}
                      placeholder={copies.fields.identificationNumber.placeholder}
                      error={errors.personalInfo?.identificationNumber?.message}
                      {...register('personalInfo.identificationNumber')}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Health-specific fields */}
              {insuranceType === 'health' && (
                <AccordionItem value="insurance-details">
                  <AccordionTrigger>
                    <span className="text-lg font-semibold">{copies.steps.insuranceDetails}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <Controller
                        name={'coverageType' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label="Tipo de Cobertura"
                            placeholder="Selecciona el tipo de cobertura"
                            options={coverageOptions}
                            value={field.value as string}
                            onValueChange={field.onChange}
                            error={'coverageType' in errors ? (errors as Record<string, { message?: string }>).coverageType?.message : undefined}
                          />
                        )}
                      />

                      {(coverageType === 'family' || coverageType === 'couple') && (
                        <FormField
                          label="Número de Dependientes"
                          type="number"
                          placeholder="0"
                          error={'dependents' in errors ? (errors as Record<string, { message?: string }>).dependents?.message : undefined}
                          {...register('dependents' as keyof QuoteFormData, { valueAsNumber: true })}
                        />
                      )}

                      <Controller
                        name={'preExistingConditions' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => (
                          <FormCheckbox
                            label="¿Tiene condiciones preexistentes?"
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Life insurance specific fields */}
              {(insuranceType === 'life' || insuranceType === 'life_savings') && (
                <AccordionItem value="insurance-details">
                  <AccordionTrigger>
                    <span className="text-lg font-semibold">Detalles del Seguro</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <FormField
                        label="Monto de Cobertura"
                        type="number"
                        placeholder="100000"
                        error={getFieldError('coverageAmount')}
                        {...register('coverageAmount' as keyof QuoteFormData, { valueAsNumber: true })}
                      />

                      {insuranceType === 'life_savings' && (
                        <>
                          <FormField
                            label="Meta de Ahorro"
                            type="number"
                            placeholder="50000"
                            error={getFieldError('savingsGoal')}
                            {...register('savingsGoal' as keyof QuoteFormData, { valueAsNumber: true })}
                          />

                          <FormField
                            label="Plazo (años)"
                            type="number"
                            placeholder="10"
                            error={getFieldError('termYears')}
                            {...register('termYears' as keyof QuoteFormData, { valueAsNumber: true })}
                          />
                        </>
                      )}

                      {insuranceType === 'life' && (
                        <>
                          <FormField
                            label="Ocupación"
                            placeholder="Ingeniero, Doctor, etc."
                            error={getFieldError('occupation')}
                            {...register('occupation' as keyof QuoteFormData)}
                          />

                          <Controller
                            name={'smoker' as keyof QuoteFormData}
                            control={control}
                            render={({ field }) => (
                              <FormCheckbox
                                label="¿Fuma?"
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Beneficiaries for life insurance */}
              {(insuranceType === 'life' || insuranceType === 'life_savings') && (
                <AccordionItem value="beneficiaries">
                  <AccordionTrigger>
                    <span className="text-lg font-semibold">Beneficiarios</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Agrega los beneficiarios de tu póliza
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ name: '', relationship: '', percentage: 0 })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <Card key={field.id}>
                          <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium">Beneficiario {index + 1}</h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <FormField
                              label="Nombre Completo"
                              placeholder="Nombre del beneficiario"
                              error={getFieldError(`beneficiaries.${index}.name`)}
                              {...register(`beneficiaries.${index}.name` as keyof QuoteFormData)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                label="Parentesco"
                                placeholder="Hijo, Cónyuge, etc."
                                error={getFieldError(`beneficiaries.${index}.relationship`)}
                                {...register(`beneficiaries.${index}.relationship` as keyof QuoteFormData)}
                              />

                              <FormField
                                label="Porcentaje (%)"
                                type="number"
                                placeholder="50"
                                error={getFieldError(`beneficiaries.${index}.percentage`)}
                                {...register(`beneficiaries.${index}.percentage` as keyof QuoteFormData, {
                                  valueAsNumber: true,
                                })}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {getFieldError('beneficiaries') && (
                        <p className="text-sm text-destructive">{getFieldError('beneficiaries')}</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Vehicle insurance specific fields */}
              {insuranceType === 'vehicle' && (
                <AccordionItem value="vehicle-info">
                  <AccordionTrigger>
                    <span className="text-lg font-semibold">Información del Vehículo</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <Controller
                        name={'vehicleType' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label="Tipo de Vehículo"
                            placeholder="Selecciona el tipo"
                            options={vehicleTypes}
                            value={field.value as string}
                            onValueChange={field.onChange}
                            error={getFieldError('vehicleType')}
                          />
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Marca"
                          placeholder="Toyota, Chevrolet, etc."
                          error={getFieldError('vehicleBrand')}
                          {...register('vehicleBrand' as keyof QuoteFormData)}
                        />

                        <FormField
                          label="Modelo"
                          placeholder="Corolla, Cruze, etc."
                          error={getFieldError('vehicleModel')}
                          {...register('vehicleModel' as keyof QuoteFormData)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Año"
                          type="number"
                          placeholder="2020"
                          error={getFieldError('vehicleYear')}
                          {...register('vehicleYear' as keyof QuoteFormData, { valueAsNumber: true })}
                        />

                        <FormField
                          label="Valor del Vehículo (USD)"
                          type="number"
                          placeholder="15000"
                          error={getFieldError('vehicleValue')}
                          {...register('vehicleValue' as keyof QuoteFormData, { valueAsNumber: true })}
                        />
                      </div>

                      <Controller
                        name={'coverageType' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label="Tipo de Cobertura"
                            placeholder="Selecciona la cobertura"
                            options={coverageTypes}
                            value={field.value as string}
                            onValueChange={field.onChange}
                            error={getFieldError('coverageType')}
                          />
                        )}
                      />

                      <Controller
                        name={'hasFinancing' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => (
                          <FormCheckbox
                            label="¿El vehículo tiene financiamiento?"
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Terms and Conditions */}
            <div className="space-y-4 pt-4 border-t">
              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <FormCheckbox
                    label={copies.fields.acceptTerms.label}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    error={errors.acceptTerms?.message}
                    linkText="términos y condiciones"
                    onLinkClick={() => setShowTermsModal(true)}
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || !acceptTerms}
                className="min-w-[200px]"
              >
                {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {copies.buttons.submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
        title={copies.termsAndConditions.title}
        content={copies.termsAndConditions.content}
      />
    </>
  );
};
