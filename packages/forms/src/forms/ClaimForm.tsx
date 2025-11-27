import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { FormField, FormSelect, FormTextarea, FormCheckbox, FormFileUpload, SelectOption } from '../components/atoms';
import { healthClaimSchema, vehicleClaimSchema } from '../lib/schemas';
import { HealthClaimData, VehicleClaimData, BrandId } from '../types';
import { getBrandCopies } from '../data';
import { Loader2, AlertCircle } from 'lucide-react';
import { FORM_EVENTS } from '../events/constants';
import {
  FormStartDetail,
  FormSubmitDataDetail,
  FormSubmitLoadingDetail,
  FormResultDetail,
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
  const [hasThirdParty, setHasThirdParty] = useState(false);
  const [availablePolicies, setAvailablePolicies] = useState<SelectOption[]>([]);
  const [dependents, setDependents] = useState<SelectOption[]>([]);
  const [medicalCenters, setMedicalCenters] = useState<SelectOption[]>([]);
  const [contactFieldsReadonly, setContactFieldsReadonly] = useState(false);
  const [contactDataModified, setContactDataModified] = useState(false);
  const [originalContactData, setOriginalContactData] = useState<any>(null);
  const [insuredName, setInsuredName] = useState<string>('');
  const [policyInfo, setPolicyInfo] = useState<{ planName?: string; insurer?: string }>({});
  
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
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(getSchema()),
    mode: 'onChange',
    defaultValues: {
      insuranceType,
    } as Partial<ClaimFormData>,
  });

  const policeReport = insuranceType === 'vehicle' ? watch('policeReport' as keyof VehicleClaimData) : false;
  
  const handleRequestDataUpdate = () => {
    // Habilitar edición de campos de contacto
    setContactFieldsReadonly(false);
    setContactDataModified(true);
  };
  
  const handleFormSubmit = async (data: ClaimFormData) => {
    // TODO: Si contactDataModified es true, enviar datos modificados a servicio de notificaciones
    // Este servicio enviará una notificación al admin del broker
    if (contactDataModified && originalContactData) {
      console.log('Datos de contacto modificados - pendiente implementar servicio de notificación:', {
        original: originalContactData,
        modified: data.personalInfo
      });
      // TODO: await fetch('/api/notifications/contact-update', { method: 'POST', body: JSON.stringify(...) })
    }
    
    // Emit form:submit event with data to host
    if (rootRef.current) {
      const event = new CustomEvent<FormSubmitDataDetail<ClaimFormData>>(FORM_EVENTS.SUBMIT, {
        detail: { data },
        bubbles: true,
      });
      rootRef.current.dispatchEvent(event);
    }
  };

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
        // Process available policies
        if ((initialData as any).availablePolicies) {
          setAvailablePolicies((initialData as any).availablePolicies);
        }
        
        // Process dependents for health insurance
        if ((initialData as any).dependents && insurance === 'health') {
          const dependentOptions: SelectOption[] = [
            { value: 'titular', label: 'Titular (Yo)' }
          ];
          ((initialData as any).dependents as any[]).forEach((dep: any, index: number) => {
            dependentOptions.push({
              value: dep.id || `dependent-${index}`,
              label: `${dep.firstName} ${dep.lastName} (${dep.relationship})`
            });
          });
          setDependents(dependentOptions);
        }
        
        // Process medical centers for health insurance
        if ((initialData as any).medicalCenters && insurance === 'health') {
          setMedicalCenters((initialData as any).medicalCenters);
        }
        
        // Set contact fields as readonly if data is provided
        if ((initialData as any).firstName || (initialData as any).personalInfo?.firstName) {
          setContactFieldsReadonly(true);
          // Guardar datos originales para comparación posterior
          setOriginalContactData((initialData as any).personalInfo || {
            firstName: (initialData as any).firstName,
            lastName: (initialData as any).lastName,
            email: (initialData as any).email,
            phone: (initialData as any).phone,
          });
          
          // Guardar nombre del asegurado para el saludo
          const firstName = (initialData as any).personalInfo?.firstName || (initialData as any).firstName;
          const lastName = (initialData as any).personalInfo?.lastName || (initialData as any).lastName;
          setInsuredName(`${firstName} ${lastName}`);
        }
        
        // Guardar información de la póliza para el saludo
        if ((initialData as any).planName || (initialData as any).insurer) {
          setPolicyInfo({
            planName: (initialData as any).planName,
            insurer: (initialData as any).insurer,
          });
        }
        
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
          
          {insuredName && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-lg font-semibold text-blue-900">
                ¡Hola, {insuredName}!
              </p>
              {policyInfo.planName && (
                <p className="text-sm text-blue-700 mt-1">
                  {policyInfo.planName}
                  {policyInfo.insurer && ` - ${policyInfo.insurer}`}
                </p>
              )}
              <p className="text-sm text-blue-600 mt-2">
                Estamos aquí para ayudarte. Completa el formulario a continuación para registrar tu {insuranceType === 'health' ? 'reclamo de salud' : 'siniestro vehicular'}.
              </p>
            </div>
          )}
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
                    {availablePolicies.length > 0 ? (
                      <Controller
                        name="policyNumber"
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label={copies.fields.policyNumber.label}
                            placeholder="Selecciona tu póliza"
                            options={availablePolicies}
                            value={typeof field.value === 'string' ? field.value : undefined}
                            onValueChange={field.onChange}
                            error={getError('policyNumber')}
                          />
                        )}
                      />
                    ) : (
                      <FormField
                        label={copies.fields.policyNumber.label}
                        placeholder={copies.fields.policyNumber.placeholder}
                        error={getError('policyNumber')}
                        {...register('policyNumber')}
                      />
                    )}

                    {dependents.length > 0 && insuranceType === 'health' && (
                      <Controller
                        name={"dependentId" as any}
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label="¿Para quién es el reclamo?"
                            placeholder="Selecciona el beneficiario"
                            options={dependents}
                            value={typeof field.value === 'string' ? field.value : undefined}
                            onValueChange={field.onChange}
                            error={getError('dependentId')}
                          />
                        )}
                      />
                    )}

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
                    {contactFieldsReadonly && !contactDataModified && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>Los datos de contacto no pueden ser editados. Si necesitas actualizarlos, usa el botón al final de esta sección.</p>
                      </div>
                    )}
                    
                    {contactDataModified && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>Has solicitado modificar tus datos de contacto. Los cambios se enviarán al administrador para su revisión al enviar el formulario.</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre"
                        placeholder="Tu nombre"
                        error={getError('personalInfo.firstName')}
                        disabled={contactFieldsReadonly}
                        className={contactFieldsReadonly ? 'bg-gray-50' : ''}
                        {...register('personalInfo.firstName')}
                      />

                      <FormField
                        label="Apellido"
                        placeholder="Tu apellido"
                        error={getError('personalInfo.lastName')}
                        disabled={contactFieldsReadonly}
                        className={contactFieldsReadonly ? 'bg-gray-50' : ''}
                        {...register('personalInfo.lastName')}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        error={getError('personalInfo.email')}
                        disabled={contactFieldsReadonly}
                        className={contactFieldsReadonly ? 'bg-gray-50' : ''}
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
                            disabled={contactFieldsReadonly}
                            className={contactFieldsReadonly ? 'bg-gray-50' : ''}
                          />
                        )}
                      />
                    </div>

                    {contactFieldsReadonly && !contactDataModified && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRequestDataUpdate}
                        >
                          Solicitar actualización de datos
                        </Button>
                      </div>
                    )}
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

                    <FormFileUpload
                      label="Formulario de Aseguradora"
                      description="Subir el formulario oficial de la aseguradora (PDF o imagen)"
                      accept=".pdf,image/*"
                      onChange={(file) => setValue('insurerForm' as any, file as any)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Health-specific fields */}
              {insuranceType === 'health' && (
                <>
                  <AccordionItem value="medical-info">
                    <AccordionTrigger>
                      <span className="text-lg font-semibold">Información Médica</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {medicalCenters.length > 0 ? (
                          <Controller
                            name={"medicalCenterId" as any}
                            control={control}
                            render={({ field }) => (
                              <FormSelect
                                label="Centro Médico"
                                placeholder="Selecciona el centro médico de la red"
                                options={medicalCenters}
                                value={field.value as string | undefined}
                                onValueChange={field.onChange}
                                error={getError('medicalCenterId')}
                              />
                            )}
                          />
                        ) : (
                          <FormField
                            label="Centro Médico"
                            placeholder="Hospital o clínica donde fue atendido"
                            error={getError('medicalCenterId')}
                            {...register('medicalCenterId' as any)}
                          />
                        )}

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

                  <AccordionItem value="medical-documents">
                    <AccordionTrigger>
                      <span className="text-lg font-semibold">Documentos Médicos</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <FormFileUpload
                          label="Receta Médica"
                          description="Prescripción médica (PDF o imagen)"
                          accept=".pdf,image/*"
                          onChange={(file) => setValue('medicalPrescription' as any, file as any)}
                        />

                        <FormFileUpload
                          label="Diagnóstico del Médico"
                          description="Informe médico con el diagnóstico"
                          accept=".pdf,image/*"
                          onChange={(file) => setValue('medicalDiagnosis' as any, file as any)}
                        />

                        <FormFileUpload
                          label="Exámenes de Salud"
                          description="Resultados de laboratorio, rayos X, etc. (múltiples archivos)"
                          accept=".pdf,image/*"
                          multiple={true}
                          onChange={(files) => setValue('medicalExams' as any, files as any)}
                        />

                        <FormFileUpload
                          label="Factura de Medicinas"
                          description="Factura de la farmacia"
                          accept=".pdf,image/*"
                          onChange={(file) => setValue('medicineInvoice' as any, file as any)}
                        />

                        <FormFileUpload
                          label="Factura de Cita Médica"
                          description="Factura de la consulta o procedimiento"
                          accept=".pdf,image/*"
                          onChange={(file) => setValue('medicalAppointmentInvoice' as any, file as any)}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}

              {/* Vehicle-specific fields */}
              {insuranceType === 'vehicle' && (
                <>
                  <AccordionItem value="vehicle-info">
                    <AccordionTrigger>
                      <span className="text-lg font-semibold">Información del Vehículo</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <FormField
                          label="Placa del Vehículo Asegurado"
                          placeholder="ABC-1234"
                          error={getError('vehiclePlate')}
                          disabled={Boolean(watch('vehiclePlate'))}
                          className={watch('vehiclePlate') ? 'bg-gray-50' : ''}
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

                        <div className="pt-4 border-t">
                          <FormCheckbox
                            label="¿Hubo terceros afectados?"
                            checked={hasThirdParty}
                            onCheckedChange={setHasThirdParty}
                          />
                        </div>

                        {hasThirdParty && (
                          <div className="space-y-4 border-l-4 border-yellow-400 pl-4 mt-4">
                            <h4 className="font-medium text-gray-900">Información del Tercero Afectado</h4>
                            
                            <FormField
                              label="Placa del Vehículo del Tercero (si aplica)"
                              placeholder="XYZ-5678"
                              error={getError('thirdPartyPlate')}
                              {...register('thirdPartyPlate' as any)}
                            />
                            
                            <FormField
                              label="Nombre del Tercero Afectado"
                              placeholder="Nombre completo de la persona afectada"
                              error={getError('thirdPartyName')}
                              {...register('thirdPartyName' as any)}
                            />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="vehicle-documents">
                    <AccordionTrigger>
                      <span className="text-lg font-semibold">Documentos del Siniestro</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <FormFileUpload
                          label="Fotos del Vehículo Asegurado"
                          description="Fotos donde se muestren los daños del vehículo (múltiples fotos)"
                          accept="image/*"
                          multiple={true}
                          onChange={(files) => setValue('insuredVehiclePhotos' as any, files as any)}
                        />

                        <FormFileUpload
                          label="Foto de Licencia del Asegurado"
                          description="Licencia de conducir del titular"
                          accept="image/*"
                          onChange={(file) => setValue('insuredLicensePhoto' as any, file as any)}
                        />

                        {hasThirdParty && (
                          <>
                            <div className="pt-4 border-t">
                              <h4 className="font-medium text-gray-900 mb-4">Documentos del Tercero Afectado</h4>
                            </div>

                            <FormFileUpload
                              label="Fotos del Bien de Terceros Afectado"
                              description="Fotos del vehículo o propiedad del tercero (múltiples fotos)"
                              accept="image/*"
                              multiple={true}
                              onChange={(files) => setValue('thirdPartyPropertyPhotos' as any, files as any)}
                            />

                            <FormFileUpload
                              label="Foto de la Persona Afectada"
                              description="Foto de la persona involucrada en el incidente (si aplica)"
                              accept="image/*"
                              onChange={(file) => setValue('affectedPersonPhoto' as any, file as any)}
                            />

                            <FormFileUpload
                              label="Foto de Licencia del Tercero"
                              description="Licencia de conducir del tercero (si aplica)"
                              accept="image/*"
                              onChange={(file) => setValue('thirdPartyLicensePhoto' as any, file as any)}
                            />

                            <FormFileUpload
                              label="Foto de Matrícula del Vehículo del Tercero"
                              description="Matrícula o documento de propiedad del vehículo del tercero"
                              accept="image/*"
                              onChange={(file) => setValue('thirdPartyRegistrationPhoto' as any, file as any)}
                            />

                            <FormFileUpload
                              label="Foto de Identificación del Tercero"
                              description="Cédula o identificación de la persona afectada"
                              accept="image/*"
                              onChange={(file) => setValue('thirdPartyIdPhoto' as any, file as any)}
                            />
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </>
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
