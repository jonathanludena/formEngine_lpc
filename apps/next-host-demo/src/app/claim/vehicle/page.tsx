'use client';

import { Suspense, useState } from 'react';
import { FormHostShell } from '@/components/organisms/FormHostShell';
import { useClaimVehicleConfig } from './useClaimVehicleConfig';
import { ClaimVehicleLoading } from './ClaimVehicleLoading';

// --- Constants ---
// In a real app, this would come from auth context or route, not be hardcoded.
const POLICY_ID_TO_LOAD = 'POL-VEHICLE-001';

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

function SuccessDisplay({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          ¡Reclamo enviado exitosamente!
        </h2>
        <p className="text-green-700">{message}</p>
        <p className="text-sm text-gray-600 mt-4">
          Recibirás actualizaciones sobre tu reclamo por los canales de contacto registrados.
        </p>
      </div>
    </div>
  );
}

function ServiceUnavailableDisplay() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">
          Servicio no disponible
        </h2>
        <p className="text-yellow-700 mb-4">
          Lo sentimos, el servicio de reclamos no está disponible en este momento.
        </p>
        <p className="text-sm text-gray-600">
          Por favor, intenta nuevamente más tarde o contáctanos directamente.
        </p>
      </div>
    </div>
  );
}

// --- Main Component ---

function ClaimVehicleContent() {
  const { config, isLoading, error } = useClaimVehicleConfig(POLICY_ID_TO_LOAD);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- Submit Handler ---
  async function handleSubmit(data: unknown) {
    try {
      // Obtener token de la cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      const token = getCookie('token');

      // Incluir el token en el payload
      const payload = {
        ...(data as Record<string, unknown>),
        tk: token,
      };

      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Si la respuesta no es 200 OK
      if (!response.ok) {
        setIsServiceUnavailable(true);
        return {
          ok: false,
          error: result.error || 'Servicio no disponible',
        };
      }

      // Respuesta 200 OK - Eliminar cookie del token (la misma que se seteó en /api/auth/token)
      document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      // Marcar como enviado exitosamente
      setIsSubmitted(true);
      setSuccessMessage(result.message || '¡Reclamo registrado exitosamente!');

      return {
        ok: true,
        message: result.message || '¡Reclamo registrado exitosamente!',
        resultId: result.data?.id,
      };
    } catch (error) {
      setIsServiceUnavailable(true);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  }

  // Si ya fue enviado exitosamente, mostrar mensaje de éxito
  if (isSubmitted) {
    return <SuccessDisplay message={successMessage} />;
  }

  // Si el servicio no está disponible, mostrar mensaje de error
  if (isServiceUnavailable) {
    return <ServiceUnavailableDisplay />;
  }

  if (isLoading) {
    return <ClaimVehicleLoading />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!config) {
    return <ErrorDisplay message="No se pudo cargar la configuración del formulario" />;
  }

  return (
    <div className="space-y-6">
      <FormHostShell formType="claim" config={config} onSubmit={handleSubmit} />
    </div>
  );
}

export default function ClaimVehiclePage() {
  return (
    <Suspense fallback={<ClaimVehicleLoading />}>
      <ClaimVehicleContent />
    </Suspense>
  );
}
