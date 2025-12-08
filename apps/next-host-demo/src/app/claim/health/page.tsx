'use client';

import { FormHostShell } from '@/components/organisms/FormHostShell';
import { useClaimHealthConfig } from './useClaimHealthConfig';
import { ClaimHealthLoading } from './ClaimHealthLoading';

// --- Constants ---
// In a real app, this would come from auth context or route, not be hardcoded.
const POLICY_ID_TO_LOAD = 'POL-HEALTH-001';

// --- Helper Components ---

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-700">Error</h1>
      <p className="text-muted-foreground mt-2">
        No se pudo cargar la configuración del formulario.
      </p>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Detalle del error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
}


// --- Main Handler ---

async function handleSubmit(data: unknown) {
  try {
    const response = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
}

// --- Main Page Component ---

export default function ClaimHealthPage() {
  const { config, isLoading, error } = useClaimHealthConfig(POLICY_ID_TO_LOAD);

  if (isLoading) {
    return <ClaimHealthLoading />;
  }

  if (error || !config) {
    return <ErrorDisplay message={error || 'La configuración del formulario está vacía.'} />;
  }
  
  return (
    <div className="space-y-6">
      <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />
    </div>
  );
}