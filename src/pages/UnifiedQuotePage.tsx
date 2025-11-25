import { InsuranceQuoteForm } from '@/components/organisms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMockHealthQuote } from '@/data';
import { InsuranceType, QuoteResult } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const UnifiedQuotePage = () => {
  const location = useLocation();
  const locationInsuranceType = location.state?.prod;
  const [insuranceType, setInsuranceType] = useState<InsuranceType>(
    locationInsuranceType || 'health'
  );
  const [quoteResults, setQuoteResults] = useState<QuoteResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationInsuranceType && locationInsuranceType !== insuranceType) {
      setInsuranceType(locationInsuranceType);
      setQuoteResults(null);
    }
  }, [locationInsuranceType, insuranceType]);

  const handleSubmit = async (_data: unknown) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = generateMockHealthQuote();
    setQuoteResults(results);
    setIsLoading(false);

    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const insuranceTypes = [
    { value: 'health' as InsuranceType, label: '🏥 Salud', color: 'bg-blue-100 dark:bg-blue-900' },
    { value: 'life' as InsuranceType, label: '💼 Vida', color: 'bg-purple-100 dark:bg-purple-900' },
    {
      value: 'life_savings' as InsuranceType,
      label: '💰 Vida y Ahorro',
      color: 'bg-green-100 dark:bg-green-900',
    },
    {
      value: 'vehicle' as InsuranceType,
      label: '🚗 Vehicular',
      color: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Cotiza tu Seguro</h1>
        <p className="text-muted-foreground">
          Selecciona el tipo de seguro y completa el formulario
        </p>

        {/* Insurance Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {insuranceTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setInsuranceType(type.value);
                setQuoteResults(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                insuranceType === type.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              } ${type.color}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{type.label.split(' ')[0]}</div>
                <div className="text-sm font-medium">
                  {type.label.split(' ').slice(1).join(' ')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <InsuranceQuoteForm
        key={insuranceType}
        brand="brand_A"
        insuranceType={insuranceType}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {quoteResults && (
        <div id="results" className="space-y-6">
          <div className="text-center space-y-2">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">¡Cotización Generada!</h2>
            <p className="text-muted-foreground">
              Encontramos {quoteResults.length} opciones para ti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quoteResults.map((quote, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <img
                      src={quote.company.logo}
                      alt={quote.company.name}
                      className="h-8 object-contain"
                    />
                    {index === 0 && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        Mejor Precio
                      </span>
                    )}
                  </div>
                  <CardTitle>{quote.company.name}</CardTitle>
                  <CardDescription>Deducible: ${quote.deductible}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Prima Mensual</p>
                    <p className="text-3xl font-bold text-primary">${quote.monthlyPremium}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${quote.annualPremium} anual
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Cobertura:</p>
                    {Object.entries(quote.coverage).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Beneficios:</p>
                    <ul className="text-sm space-y-1">
                      {quote.benefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">Solicitar</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setQuoteResults(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Nueva Cotización
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
