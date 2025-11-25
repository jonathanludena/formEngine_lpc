import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormField, FormSelect, FormTextarea, FormCheckbox, SelectOption } from '@/components/atoms';
import { healthClaimSchema, vehicleClaimSchema } from '@/lib/schemas';
import { HealthClaimData, VehicleClaimData, BaseFormProps, BrandId } from '@/lib/types';
import { getBrandCopies } from '@/data';
import { Loader2 } from 'lucide-react';

type ClaimFormData = HealthClaimData | VehicleClaimData;

interface ClaimFormProps extends Omit<BaseFormProps<ClaimFormData>, 'brand'> {
  brand?: BrandId;
  insuranceType: 'health' | 'vehicle';
}

export const ClaimForm = ({
  brand = 'default',
  insuranceType,
  onSubmit,
  initialData,
  isLoading = false,
}: ClaimFormProps) => {
  const copies = getBrandCopies(brand).claimForm;
  const [activeSection, setActiveSection] = useState<string>('policy-info');

  const getSchema = () => {
    return insuranceType === 'health' ? healthClaimSchema : vehicleClaimSchema;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(getSchema()),
    mode: 'onChange',
    defaultValues: {
      insuranceType,
      ...initialData,
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
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting claim:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{copies.title}</CardTitle>
        <CardDescription>{copies.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" autoComplete="off">
          {/* Hidden dummy input to further discourage browser autocomplete */}
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
                          onFocus={() => {}}
                          placeholder={'9XXXXXXXX'}
                          error={getError('personalInfo.phone')}
                          inputMode="numeric"
                          maxLength={9}
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
  );
};
