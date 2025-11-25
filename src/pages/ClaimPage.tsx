import { ClaimForm } from '@/components/organisms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useClaimPage } from './useClaimPage';

export const ClaimPage = () => {
  const { insuranceType, submitted, isLoading, submissionResult, handleSubmit, selectType, resetSubmitted } =
    useClaimPage();

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
              <CardTitle className="text-3xl">¡Reclamo Recibido!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Hemos registrado tu reclamo exitosamente. Nuestro equipo lo revisará y te
              contactaremos en un plazo máximo de 48 horas.
            </p>
            {submissionResult ? (
              <div className="bg-muted p-4 rounded-lg text-left">
                <p className="font-semibold">Número de Seguimiento</p>
                <p className="text-2xl font-mono text-primary">{submissionResult.id}</p>
                <p className="mt-2 text-sm">Fecha: {new Date(submissionResult.submittedAt).toLocaleString()}</p>
                {submissionResult.data && (
                  <div className="mt-4 space-y-2">
                    <p className="font-semibold">Detalles del Reclamo</p>
                    {submissionResult.data.policyNumber && (
                      <p className="text-sm">Póliza: {submissionResult.data.policyNumber}</p>
                    )}
                    {submissionResult.data.incidentDate && (
                      <p className="text-sm">Fecha de incidente: {submissionResult.data.incidentDate}</p>
                    )}
                    {submissionResult.data.description && (
                      <p className="text-sm">Descripción: {submissionResult.data.description}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold">Número de Seguimiento</p>
                <p className="text-2xl font-mono text-primary">CLM-{Date.now().toString().slice(-6)}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">Guarda este número para dar seguimiento a tu reclamo</p>
            <Button onClick={() => resetSubmitted()} className="mt-6">
              Nuevo Reclamo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Reportar un Reclamo</h1>
        <p className="text-muted-foreground">
          Completa el formulario para iniciar el proceso de tu reclamo
        </p>

        {/* Insurance Type Selector */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => selectType('health')}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              insuranceType === 'health'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            🏥 Seguro de Salud
          </button>
          <button
            onClick={() => selectType('vehicle')}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              insuranceType === 'vehicle'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            🚗 Seguro Vehicular
          </button>
        </div>
      </div>

      <ClaimForm
        key={insuranceType}
        brand="brand_A"
        insuranceType={insuranceType}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
