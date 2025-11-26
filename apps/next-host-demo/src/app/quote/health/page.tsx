'use client';

import { FormHostShell } from '@/components/organisms/FormHostShell';
import type { FormStartDetail } from '@jonathanludena/forms';

export default function QuoteHealthPage() {
  const config: FormStartDetail = {
    brand: 'default',
    feature: 'quote',
    insurance: 'health',
  };

  const handleSubmit = async (data: unknown) => {
    try {
      // Get a demo broker ID (in production, this would come from auth/session)
      const brokersResponse = await fetch('/api/brokers');
      const brokersData = await brokersResponse.json();
      const brokerId = brokersData.data?.[0]?.id || 'demo-broker';

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brokerId,
          ...(data as Record<string, unknown>),
          quoteData: data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || 'Error al procesar la cotización',
        };
      }

      return {
        ok: true,
        message: result.message || '¡Cotización enviada exitosamente!',
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cotizar Seguro de Salud</h1>
          <p className="text-gray-600">Complete el formulario para recibir una cotización</p>
        </div>
        
        <FormHostShell formType="quote" config={config} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
