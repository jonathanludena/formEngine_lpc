import { FormCheckbox, FormField, FormSelect, SelectOption } from '@/components/atoms';
import { TermsModal } from '@/components/molecules/TermsModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getBrandCopies } from '@/data';
import {
  healthQuoteSchema,
  lifeQuoteSchema,
  lifeSavingsQuoteSchema,
  vehicleQuoteSchema,
} from '@/lib/schemas';
import { BaseFormProps, BrandId, InsuranceType, QuoteFormData } from '@/lib/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

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

  // Mock preexisting conditions options for health insurance
  const PREEXISTING_OPTIONS: { value: string; label: string }[] = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hipertensión' },
    { value: 'asthma', label: 'Asma' },
    { value: 'cardiac', label: 'Condiciones Cardíacas' },
    { value: 'none', label: 'Ninguna' },
  ];

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
  const coverageType =
    insuranceType === 'health'
      ? (watch('coverageType' as keyof QuoteFormData) as string | undefined)
      : null;
  const identificationTypeValue = watch('personalInfo.identificationType' as keyof QuoteFormData) as string | undefined;

  // Date limits
  const today = new Date();
  const maxBirthDate = today.toISOString().split('T')[0];
  const minBirth = new Date();
  minBirth.setFullYear(minBirth.getFullYear() - 120);
  const minBirthDate = minBirth.toISOString().split('T')[0];

  // Vehicle helpers
  const currentYear = new Date().getFullYear();
  const vehicleYearMin = currentYear - 5;
  const vehicleYearMax = currentYear + 1;

  // Brands / models (mock Ecuador local market)
  const VEHICLE_BRANDS: SelectOption[] = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'nissan', label: 'Nissan' },
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'kia', label: 'Kia' },
    { value: 'ford', label: 'Ford' },
    { value: 'mitsubishi', label: 'Mitsubishi' },
    { value: 'suzuki', label: 'Suzuki' },
  ];

  const MODEL_MAP: Record<string, SelectOption[]> = {
    toyota: [
      { value: 'corolla', label: 'Corolla' },
      { value: 'rav4', label: 'RAV4' },
    ],
    chevrolet: [{ value: 'cruze', label: 'Cruze' }, { value: 'dmax', label: 'D-MAX' }],
    nissan: [{ value: 'sentra', label: 'Sentra' }, { value: 'xtrail', label: 'X-Trail' }],
    hyundai: [{ value: 'accent', label: 'Accent' }, { value: 'tucson', label: 'Tucson' }],
    kia: [{ value: 'rio', label: 'Rio' }, { value: 'sportage', label: 'Sportage' }],
    ford: [{ value: 'ranger', label: 'Ranger' }, { value: 'escape', label: 'Escape' }],
    mitsubishi: [{ value: 'l200', label: 'L200' }, { value: 'outlander', label: 'Outlander' }],
    suzuki: [{ value: 'swift', label: 'Swift' }, { value: 'vitara', label: 'Vitara' }],
  };

  const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);

  // Update models when brand changes
  useEffect(() => {
    const brandValue = watch('vehicleBrand' as keyof QuoteFormData) as string | undefined;
    if (brandValue && MODEL_MAP[brandValue]) {
      setModelOptions(MODEL_MAP[brandValue]);
    } else {
      setModelOptions([]);
      // clear vehicleModel if brand cleared
      setValue('vehicleModel' as keyof QuoteFormData, '' as unknown as QuoteFormData[keyof QuoteFormData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('vehicleBrand')]);

  const beneficiaryRelationshipOptions: SelectOption[] = [
    { value: 'hijo', label: 'Hijo/a' },
    { value: 'conyuge', label: 'Cónyuge' },
    { value: 'padre', label: 'Padre' },
    { value: 'madre', label: 'Madre' },
    { value: 'hermano', label: 'Hermano/a' },
    { value: 'pareja', label: 'Pareja' },
  ];

  const occupationOptions: SelectOption[] = [
    { value: 'comerciante', label: 'Comerciante' },
    { value: 'ingeniero', label: 'Ingeniero' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'estudiante', label: 'Estudiante' },
    { value: 'otro', label: 'Otro' },
  ];

  // Beneficiaries for life insurance
  const { fields, append, remove } = useFieldArray<
    QuoteFormData,
    'beneficiaries' extends keyof QuoteFormData ? 'beneficiaries' : never
  >({
    control,
    name: 'beneficiaries' as 'beneficiaries' extends keyof QuoteFormData ? 'beneficiaries' : never,
  });

  const handleTermsAccept = () => {
    // Close the modal only. Do not programmatically set the checkbox value.
    // The user should be free to check the box themselves after reading.
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
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" autoComplete="off">
            {/* Hidden dummy input to further discourage browser autocomplete */}
            <input
              type="text"
              name="__autocomplete_disable"
              autoComplete="off"
              style={{ display: 'none' }}
            />
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
                        pattern="^[A-Za-zñÑ\s'-]+$"
                      />

                      <FormField
                        label={copies.fields.lastName.label}
                        placeholder={copies.fields.lastName.placeholder}
                        error={errors.personalInfo?.lastName?.message}
                        {...register('personalInfo.lastName')}
                        pattern="^[A-Za-zñÑ\s'-]+$"
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

                      <Controller
                        name="personalInfo.phone"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label={copies.fields.phone.label}
                            type="tel"
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const raw = (e.target as HTMLInputElement).value || '';
                              if (!raw.startsWith('+593')) {
                                const digits = raw.replace(/\D/g, '');
                                const normalized = digits.replace(/^0+/, '');
                                field.onChange(normalized ? `+593${normalized}` : '');
                              } else {
                                const after = raw.slice(4).replace(/\D/g, '');
                                field.onChange(after ? `+593${after}` : '+593');
                              }
                            }}
                            onFocus={() => {
                              if (!field.value) field.onChange('+593');
                            }}
                            placeholder={
                              copies.fields.phone.placeholder && String(copies.fields.phone.placeholder).startsWith('+593')
                                ? copies.fields.phone.placeholder
                                : `+593${copies.fields.phone.placeholder || ' 9XX XXX XXXX'}`
                            }
                            error={errors.personalInfo?.phone?.message}
                            inputMode="numeric"
                            maxLength={13}
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label={copies.fields.birthDate.label}
                        type="date"
                        error={errors.personalInfo?.birthDate?.message}
                        {...register('personalInfo.birthDate')}
                        max={maxBirthDate}
                        min={minBirthDate}
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
                      inputMode={identificationTypeValue === 'cedula' || identificationTypeValue === 'ruc' ? 'numeric' : 'text'}
                      pattern={
                        identificationTypeValue === 'cedula'
                          ? "\\d{10}"
                          : identificationTypeValue === 'ruc'
                          ? "\\d{13}"
                          : "[A-Za-z0-9]{5,12}"
                      }
                      maxLength={identificationTypeValue === 'cedula' ? 10 : identificationTypeValue === 'ruc' ? 13 : 12}
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
                            error={
                              'coverageType' in errors
                                ? (errors as Record<string, { message?: string }>).coverageType
                                    ?.message
                                : undefined
                            }
                          />
                        )}
                      />

                      {(coverageType === 'family' || coverageType === 'couple') && (
                        <FormField
                          label="Número de Dependientes"
                          type="number"
                          placeholder="0"
                          error={
                            'dependents' in errors
                              ? (errors as Record<string, { message?: string }>).dependents?.message
                              : undefined
                          }
                          {...register('dependents' as keyof QuoteFormData, {
                            valueAsNumber: true,
                          })}
                        />
                      )}

                      <Controller
                        name={'preExistingConditions' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => (
                          <FormCheckbox
                            ref={field.ref}
                            label="¿Tiene condiciones preexistentes?"
                            checked={field.value as boolean}
                            onCheckedChange={(val) => {
                              // Update the boolean value
                              field.onChange(val);
                              // If user unchecks, clear any selected preexisting items
                              if (!val) {
                                // Clear selected preexisting items to avoid stale data
                                const currentValues = watch() as Partial<QuoteFormData>;
                                reset({ ...currentValues, preExistingList: [] } as Partial<QuoteFormData>);
                              }
                            }}
                          />
                        )}
                      />

                      {/* If user indicates pre-existing conditions, show checkbox list + selected chips */}
                      <Controller
                        name={'preExistingList' as keyof QuoteFormData}
                        control={control}
                        render={({ field }) => {
                          const current: string[] = (field.value as unknown as string[]) || [];

                          // Only render the list when the boolean checkbox is true
                          const hasPre = (watch('preExistingConditions' as keyof QuoteFormData) as boolean) === true;

                          return (
                            <div className="pt-2">
                              {hasPre && (
                                <>
                                  <p className="text-sm font-medium mb-2">Selecciona tus preexistencias</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {PREEXISTING_OPTIONS.map((opt) => (
                                      <div key={opt.value} className="flex items-center">
                                        <FormCheckbox
                                          id={`pre-${opt.value}`}
                                          label={opt.label}
                                          checked={current.includes(opt.value)}
                                          onCheckedChange={(checked) => {
                                            const next = checked
                                              ? Array.from(new Set([...current, opt.value]))
                                              : current.filter((v) => v !== opt.value);
                                            field.onChange(next);
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        }}
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
                        {...register('coverageAmount' as keyof QuoteFormData, {
                          valueAsNumber: true,
                        })}
                        min={5000}
                        step={1000}
                      />

                      {insuranceType === 'life_savings' && (
                        <>
                          <FormField
                            label="Meta de Ahorro"
                            type="number"
                            placeholder="50000"
                            error={getFieldError('savingsGoal')}
                            {...register('savingsGoal' as keyof QuoteFormData, {
                              valueAsNumber: true,
                            })}
                            min={5000}
                            step={1000}
                          />

                          <FormField
                            label="Plazo (años)"
                            type="number"
                            placeholder="10"
                            error={getFieldError('termYears')}
                            {...register('termYears' as keyof QuoteFormData, {
                              valueAsNumber: true,
                            })}
                            min={5}
                            max={30}
                          />
                        </>
                      )}

                      {insuranceType === 'life' && (
                        <>
                          <Controller
                            name={'occupation' as keyof QuoteFormData}
                            control={control}
                            render={({ field }) => (
                              <FormSelect
                                id="occupation"
                                label="Ocupación"
                                placeholder="Selecciona ocupación"
                                options={occupationOptions}
                                value={field.value as string}
                                onValueChange={field.onChange}
                                error={getFieldError('occupation')}
                              />
                            )}
                          />

                          <Controller
                            name={'smoker' as keyof QuoteFormData}
                            control={control}
                            render={({ field }) => (
                              <FormCheckbox
                                ref={field.ref}
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
                              <Controller
                                name={`beneficiaries.${index}.relationship` as unknown as keyof QuoteFormData}
                                control={control}
                                render={({ field }) => (
                                  <FormSelect
                                    id={`beneficiaries-${index}-relationship`}
                                    label="Parentesco"
                                    placeholder="Selecciona parentesco"
                                    options={beneficiaryRelationshipOptions}
                                    value={String(field.value ?? '')}
                                    onValueChange={(v) => field.onChange(v)}
                                    error={getFieldError(`beneficiaries.${index}.relationship`)}
                                  />
                                )}
                              />

                              <FormField
                                label="Porcentaje (%)"
                                type="number"
                                placeholder="50"
                                error={getFieldError(`beneficiaries.${index}.percentage`)}
                                {...register(
                                  `beneficiaries.${index}.percentage` as keyof QuoteFormData,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
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
                                id="vehicleType"
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
                        <Controller
                          name={'vehicleBrand' as keyof QuoteFormData}
                          control={control}
                          render={({ field }) => (
                            <FormSelect
                              id="vehicleBrand"
                              label="Marca"
                              placeholder="Selecciona la marca"
                              options={VEHICLE_BRANDS}
                              value={String(field.value ?? '')}
                              onValueChange={(v) => field.onChange(v)}
                              error={getFieldError('vehicleBrand')}
                            />
                          )}
                        />

                        <Controller
                          name={'vehicleModel' as keyof QuoteFormData}
                          control={control}
                          render={({ field }) => (
                            <FormSelect
                              id="vehicleModel"
                              label="Modelo"
                              placeholder="Selecciona el modelo"
                              options={modelOptions}
                              value={String(field.value ?? '')}
                              onValueChange={(v) => field.onChange(v)}
                              error={getFieldError('vehicleModel')}
                              disabled={modelOptions.length === 0}
                            />
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Año"
                          type="number"
                          placeholder="2020"
                          error={getFieldError('vehicleYear')}
                          {...register('vehicleYear' as keyof QuoteFormData, {
                            valueAsNumber: true,
                          })}
                          min={vehicleYearMin}
                          max={vehicleYearMax}
                          step={1}
                        />

                        <FormField
                          label="Valor del Vehículo (USD)"
                          type="number"
                          placeholder="15000"
                          error={getFieldError('vehicleValue')}
                          {...register('vehicleValue' as keyof QuoteFormData, {
                            valueAsNumber: true,
                          })}
                          min={15000}
                          step={1000}
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
                            ref={field.ref}
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
                    ref={field.ref}
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
