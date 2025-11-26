import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { FormField, FormSelect, FormTextarea, FormCheckbox, SelectOption } from '../components/atoms';
import { healthClaimSchema, vehicleClaimSchema } from '../lib/schemas';
import { HealthClaimData, VehicleClaimData, BrandId } from '../types';
import { getBrandCopies } from '../data';
import { Loader2 } from 'lucide-react';
import { FORM_EVENTS } from '../events/constants';
import {
  FormStartDetail,
  FormSubmitDataDetail,
  FormSubmitLoadingDetail,
  FormResultDetail,
  isFormSubmitData,
  isFormSubmitLoading,
} from '../events/types';

type ClaimFormData = HealthClaimData | VehicleClaimData;

export interface ClaimFormProps {
  /** Optional CSS class */
  className?: string;
}

export const ClaimForm = forwardRef<HTMLDivElement, ClaimFormProps>(({ className }, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [brand, setBrand] = useState<BrandId>('LPC001');
  const [insuranceType, setInsuranceType] = useState<'health' | 'vehicle'>('health');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FormResultDetail | null>(null);
  const [activeSection, setActiveSection] = useState<string>('policy-info');
  
  // Expose the root element ref
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  const copies = getBrandCopies(brand).claimForm;

  const getSchema = () => {
    return insuranceType === 'health' ? healthClaimSchema : vehicleClaimSchema;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(getSchema()),
    mode: 'onChange',
    defaultValues: {
      insuranceType,
    } as Partial<ClaimFormData>,
  });

  const policeReport = insuranceType === 'vehicle' ? watch('policeReport' as keyof VehicleClaimData) : false;

  const getError = (path: string): string | undefined => {
    const parts = path.split('.');
    let curr: unknown = errors as unknown;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in (curr as Record<string, unknown>)) {
        curr = (curr as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return (curr as { message?: string } | undefined)?.message;
  };

  const healthClaimTypes: SelectOption[] = [
    { value: 'consultation', label: 'Consulta Médica' },
    { value: 'hospitalization', label: 'Hospitalización' },
    { value: 'surgery', label: 'Cirugía' },
    { value: 'medication', label: 'Medicamentos' },
  ];

  const vehicleClaimTypes: SelectOption[] = [
    { value: 'accident', label: 'Accidente' },
    { value: 'theft', label: 'Robo' },
    { value: 'damage', label: 'Daño' },
    { value: 'total_loss', label: 'Pérdida Total' },
  ];

  const handleFormSubmit = async (data: ClaimFormData) => {
    // Emit form:submit event with data to host
    if (rootRef.current) {
      const event = new CustomEvent<FormSubmitDataDetail<ClaimFormData>>(FORM_EVENTS.SUBMIT, {
        detail: { data },
        bubbles: true,
      });
      rootRef.current.dispatchEvent(event);
    }
  };

  // Listen for form:start event from host
  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<FormStartDetail<ClaimFormData>>;
      const { brand: newBrand, insurance, initialData } = customEvent.detail;
      
      if (newBrand) setBrand(newBrand as BrandId);
      if (insurance && (insurance === 'health' || insurance === 'vehicule')) {
        setInsuranceType(insurance === 'vehicule' ? 'vehicle' : insurance);
      }
      
      if (initialData) {
        reset({
          insuranceType: insurance === 'vehicule' ? 'vehicle' : insurance as 'health' | 'vehicle',
          ...initialData,
        } as Partial<ClaimFormData>);
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

  // Listen for form:submit event with loading state from host
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

  // Listen for form:result event from host
  useEffect(() => {
    const handleResult = (e: Event) => {
      const customEvent = e as CustomEvent<FormResultDetail>;
      setResult(customEvent.detail);
      
      if (customEvent.detail.ok) {
        // Reset form on success
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
              <p className="text-green-800 font-medium">{result.message || '¡Reclamo enviado exitosamente!'}</p>
              {result.resultId && (
                <p className="text-sm text-green-600 mt-1">ID: {result.resultId}</p>
              )}
            </div>
          )}
          
          {result && !result.ok && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">{result.error || 'Error al enviar el reclamo'}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" autoComplete="off">
            <input type="text" name="__autocomplete_disable" autoComplete="off" style={{ display: 'none' }} />
            <Accordion type="single" value={activeSection} onValueChange={setActiveSection}>
              {/* Policy Information */}
              <AccordionItem value="policy-info">
                <AccordionTrigger>
                  <span className="text-lg font-semibold">Información de la Póliza</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <FormField
                      label={copies.fields.policyNumber.label}
                      placeholder={copies.fields.policyNumber.placeholder}
                      error={getError('policyNumber')}
                      {...register('policyNumber')}
                    />

                    <Controller
                      name="claimType"
                      control={control}
                      render={({ field }) => (
                        <FormSelect
                          label="Tipo de Reclamo"
                          placeholder="Selecciona el tipo de reclamo"
                          options={insuranceType === 'health' ? healthClaimTypes : vehicleClaimTypes}
                          value={typeof field.value === 'string' ? field.value : undefined}
                          onValueChange={field.onChange}
                          error={getError('claimType')}
                        />
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Personal Information */}
              <AccordionItem value="personal-info">
                <AccordionTrigger>
                  <span className="text-lg font-semibold">Datos de Contacto</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre"
                        placeholder="Tu nombre"
                        error={getError('personalInfo.firstName')}
                        {...register('personalInfo.firstName')}
                      />

                      <FormField
                        label="Apellido"
                        placeholder="Tu apellido"
                        error={getError('personalInfo.lastName')}
                        {...register('personalInfo.lastName')}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        error={getError('personalInfo.email')}
                        {...register('personalInfo.email')}
                      />

                      <Controller
                        name="personalInfo.phone"
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label="Teléfono"
                            type="tel"
                            value={typeof field.value === 'string' ? field.value : ''}
                            onChange={field.onChange}
                            onFocus={() => { }}
                            placeholder={'09XXXXXXXX'}
                            error={getError('personalInfo.phone')}
                            inputMode="numeric"
                            maxLength={10}
                          />
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Incident Details */}
              <AccordionItem value="incident-details">
                <AccordionTrigger>
                  <span className="text-lg font-semibold">Detalles del Incidente</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <FormField
                      label={copies.fields.incidentDate.label}
                      type="date"
                      error={getError('incidentDate')}
                      {...register('incidentDate')}
                    />

                    <FormTextarea
                      label={copies.fields.description.label}
                      placeholder={copies.fields.description.placeholder}
                      rows={5}
                      error={getError('description')}
                      {...register('description')}
                      maxLength={1000}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Health-specific fields */}
              {insuranceType === 'health' && (
                <AccordionItem value="medical-info">
                  <AccordionTrigger>
                    <span className="text-lg font-semibold">Información Médica</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <FormField
                        label="Centro Médico"
                        placeholder="Hospital o clínica donde fue atendido"
                        error={getError('medicalCenter')}
                        {...register('medicalCenter')}
                      />

                      <FormField
                        label="Diagnóstico (opcional)"
                        placeholder="Diagnóstico médico"
                        error={getError('diagnosis')}
                        {...register('diagnosis')}
                      />

                      <FormField
                        label="Monto Total"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        error={getError('totalAmount')}
                        {...register('totalAmount', { valueAsNumber: true })}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Vehicle-specific fields */}
              {insuranceType === 'vehicle' && (
                <AccordionItem value="vehicle-info">
                  <AccordionTrigger>
                    <span className="text-lg font-semibold">Información del Vehículo</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <FormField
                        label="Placa del Vehículo"
                        placeholder="ABC-1234"
                        error={getError('vehiclePlate')}
                        {...register('vehiclePlate')}
                      />

                      <FormField
                        label="Ubicación del Incidente"
                        placeholder="Dirección donde ocurrió el incidente"
                        error={getError('location')}
                        {...register('location')}
                      />

                      <Controller
                        name="policeReport"
                        control={control}
                        render={({ field }) => (
                          <FormCheckbox
                            label="¿Se generó reporte policial?"
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />

                      {policeReport && (
                        <FormField
                          label="Número de Reporte Policial"
                          placeholder="REP-123456"
                          error={getError('policeReportNumber')}
                          {...register('policeReportNumber')}
                        />
                      )}

                      <FormField
                        label="Daño Estimado (USD)"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        error={getError('estimatedDamage')}
                        {...register('estimatedDamage', { valueAsNumber: true })}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting || isLoading || !isValid} className="min-w-[200px]">
                {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {copies.buttons.submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});

ClaimForm.displayName = 'ClaimForm';
