'use client';

import { FormHostShell } from '@/components/organisms/FormHostShell';
import type { FormStartDetail } from '@jonathanludena/forms';

export default function ClaimHealthPage() {
  const config: FormStartDetail = {
    brand: 'default',
    feature: 'claim',
    insurance: 'health',
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Registrar Reclamo de Salud</h1>
          <p className="text-gray-600">Complete el formulario para registrar su reclamo</p>
        </div>
        
        <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
