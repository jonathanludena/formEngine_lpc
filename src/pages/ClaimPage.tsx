import { useState } from 'react';
import { ClaimForm } from '@/components/organisms';
import { ClaimFormData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export const ClaimPage = () => {
  const [insuranceType, setInsuranceType] = useState<'health' | 'vehicle'>('health');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ClaimFormData) => {
    setIsLoading(true);
    console.log('Claim data:', data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setSubmitted(true);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

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
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">Número de Seguimiento</p>
              <p className="text-2xl font-mono text-primary">CLM-{Date.now().toString().slice(-6)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Guarda este número para dar seguimiento a tu reclamo
            </p>
            <Button onClick={() => setSubmitted(false)} className="mt-6">
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
            onClick={() => setInsuranceType('health')}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              insuranceType === 'health'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            🏥 Seguro de Salud
          </button>
          <button
            onClick={() => setInsuranceType('vehicle')}
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
