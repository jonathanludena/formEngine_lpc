'use client';

import { FormHostShell } from '@/components/organisms/FormHostShell';
import type { FormStartDetail } from '@jonathanludena/forms';

export default function ClaimVehiclePage() {
  const config: FormStartDetail = {
    brand: 'LPC001',
    feature: 'claim',
    insurance: 'vehicule',
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Siniestro Vehicular</h1>
        <p className="text-muted-foreground mt-2">
          Completa el formulario para registrar el siniestro de tu vehículo
        </p>
      </div>
      
      <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />
    </div>
  );
}
