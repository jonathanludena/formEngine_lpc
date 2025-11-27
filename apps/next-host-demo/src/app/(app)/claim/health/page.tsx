'use client';

import { useState, useEffect } from 'react';
import { FormHostShell } from '@/components/organisms/FormHostShell';
import type { FormStartDetail } from '@jonathanludena/forms';

export default function ClaimHealthPage() {
  const [config, setConfig] = useState<FormStartDetail | null>(null);

  // Load initial data from insured
  useEffect(() => {
    async function loadInsuredData() {
      try {
        // En un caso real, obtendríamos el customerId del usuario autenticado
        // Por ahora, usamos el customer del seed (Juan Pérez tiene POL-HEALTH-001)
        const policyResponse = await fetch('/api/insured/POL-HEALTH-001');
        
        if (policyResponse.ok) {
          const { data } = await policyResponse.json();
          
          // Obtener todas las pólizas de salud del cliente
          const policiesResponse = await fetch(`/api/customers/${data.customerId}/policies?insuranceType=health`);
          let availablePolicies: any[] = [];
          
          if (policiesResponse.ok) {
            const { data: policies } = await policiesResponse.json();
            availablePolicies = policies.map((policy: any) => ({
              value: policy.policyNumber,
              label: `${policy.policyNumber} - ${policy.plan?.name} (${policy.plan?.insurer?.name})`,
            }));
          }
          
          setConfig({
            brand: 'LPC001',
            feature: 'claim',
            insurance: 'health',
            initialData: data ? {
              // Datos personales (dentro de personalInfo según schema)
              personalInfo: {
                firstName: data.customer.firstName,
                lastName: data.customer.lastName,
                email: data.customer.email,
                phone: data.customer.phone,
              },
              
              // Pólizas disponibles
              availablePolicies,
              
              // Datos de la póliza actual (pre-seleccionada)
              policyNumber: data.policyNumber,
              planName: data.plan?.name,
              insurer: data.plan?.insurer?.name,
              
              // Datos de cobertura
              healthCoverage: data.parsedDetails,
              
              // Dependientes
              dependents: data.dependents?.map((d: any) => ({
                id: d.id,
                firstName: d.firstName,
                lastName: d.lastName,
                relationship: d.relationship,
                birthDate: d.birthDate,
                identificationType: d.identificationType,
                identificationNumber: d.identificationNumber,
              })),
              
              // Centros Médicos de cobertura
              medicalCenters: data.medicalCenters?.map((mc: any) => ({
                value: mc.id,
                label: `${mc.name} - ${mc.type} (${mc.city})`,
              })),
            } : undefined,
          });
        } else {
          // Si no hay datos, usar configuración básica
          setConfig({
            brand: 'LPC001',
            feature: 'claim',
            insurance: 'health',
          });
        }
      } catch (error) {
        console.error('Error loading insured data:', error);
        // Usar configuración básica en caso de error
        setConfig({
          brand: 'LPC001',
          feature: 'claim',
          insurance: 'health',
        });
      }
    }

    loadInsuredData();
  }, []);

  const handleSubmit = async (data: unknown) => {
    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || 'Error al procesar el reclamo',
        };
      }

      return {
        ok: true,
        message: result.message || '¡Reclamo registrado exitosamente!',
        resultId: result.data?.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  };

  if (!config) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registrar Siniestro de Salud</h1>
          <p className="text-muted-foreground mt-2">Cargando información...</p>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Siniestro de Salud</h1>
        <p className="text-muted-foreground mt-2">
          Completa el formulario para registrar tu siniestro y recibir asistencia
        </p>
      </div>
      
      <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />
    </div>
  );
}
