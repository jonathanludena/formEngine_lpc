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

  const policeReport = insuranceType === 'vehicle' ? watch('policeReport' as any) : false;

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
                    error={errors.policyNumber?.message}
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
                        value={field.value}
                        onValueChange={field.onChange}
                        error={errors.claimType?.message}
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
                      error={errors.personalInfo?.firstName?.message}
                      {...register('personalInfo.firstName')}
                    />

                    <FormField
                      label="Apellido"
                      placeholder="Tu apellido"
                      error={errors.personalInfo?.lastName?.message}
                      {...register('personalInfo.lastName')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Email"
                      type="email"
                      placeholder="tu@email.com"
                      error={errors.personalInfo?.email?.message}
                      {...register('personalInfo.email')}
                    />

                    <Controller
                      name="personalInfo.phone"
                      control={control}
                      render={({ field }) => (
                        <FormField
                          label="Teléfono"
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
                            copies.fields?.policyNumber // keep type-checker happy; if phone placeholder exists in copies use it
                              ? (copies.fields as any).phone && String((copies.fields as any).phone.placeholder).startsWith('+593')
                                ? (copies.fields as any).phone.placeholder
                                : `+593${(copies.fields as any).phone?.placeholder || ' 9XXXXXXXX'}`
                              : '+593 9XXXXXXXX'
                          }
                          error={errors.personalInfo?.phone?.message}
                          inputMode="numeric"
                          maxLength={13}
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
                    error={errors.incidentDate?.message}
                    {...register('incidentDate')}
                  />

                  <FormTextarea
                    label={copies.fields.description.label}
                    placeholder={copies.fields.description.placeholder}
                    rows={5}
                    error={errors.description?.message}
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
                      error={(errors as any).medicalCenter?.message}
                      {...register('medicalCenter' as any)}
                    />

                    <FormField
                      label="Diagnóstico (opcional)"
                      placeholder="Diagnóstico médico"
                      error={(errors as any).diagnosis?.message}
                      {...register('diagnosis' as any)}
                    />

                    <FormField
                      label="Monto Total"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      error={(errors as any).totalAmount?.message}
                      {...register('totalAmount' as any, { valueAsNumber: true })}
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
                      error={(errors as any).vehiclePlate?.message}
                      {...register('vehiclePlate' as any)}
                    />

                    <FormField
                      label="Ubicación del Incidente"
                      placeholder="Dirección donde ocurrió el incidente"
                      error={(errors as any).location?.message}
                      {...register('location' as any)}
                    />

                    <Controller
                      name={'policeReport' as any}
                      control={control}
                      render={({ field }) => (
                        <FormCheckbox
                          label="¿Se generó reporte policial?"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />

                    {policeReport && (
                      <FormField
                        label="Número de Reporte Policial"
                        placeholder="REP-123456"
                        error={(errors as any).policeReportNumber?.message}
                        {...register('policeReportNumber' as any)}
                      />
                    )}

                    <FormField
                      label="Daño Estimado (USD)"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      error={(errors as any).estimatedDamage?.message}
                      {...register('estimatedDamage' as any, { valueAsNumber: true })}
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
