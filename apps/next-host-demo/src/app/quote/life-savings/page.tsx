'use client';

import { FormHostShell } from '@/components/organisms/FormHostShell';
import type { FormStartDetail } from '@jonathanludena/form-engine';

export default function QuoteLifeSavingsPage() {
  const config: FormStartDetail = {
    brand: 'LPC001',
    feature: 'quote',
    insurance: 'life_savings',
  };

  const handleSubmit = async (data: unknown) => {
    try {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cotización de Seguro de Vida y Ahorro</h1>
        <p className="text-muted-foreground mt-2">
          Protege a tu familia mientras ahorras para el futuro
        </p>
      </div>

      <FormHostShell formType="quote" config={config} onSubmit={handleSubmit} />
    </div>
  );
}
