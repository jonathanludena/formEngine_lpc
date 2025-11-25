import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useHomePage } from './useHomePage';

export const HomePage = () => {
  const { features, claimOptions } = useHomePage();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Form Engine LPC
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema de gestión de formularios dinámicos para Broker de Seguros. Cotiza y compara
          seguros de manera fácil y rápida.
        </p>
      </div>

      {/* Features Grid - Cotizaciones */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Cotiza tu Seguro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={`${feature.color} border-2 transition-all hover:shadow-lg hover:scale-105 flex flex-col`}
            >
              <CardHeader className="flex-grow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.to} state={feature.state}>
                  <Button className="w-full group">
                    Cotizar Ahora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Claims Grid - Reclamos */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Reportar Reclamos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {claimOptions.map((claim) => (
            <Card
              key={claim.title}
              className={`${claim.color} border-2 transition-all hover:shadow-lg hover:scale-105 flex flex-col`}
            >
              <CardHeader className="flex-grow">
                <div className="text-5xl mb-4">{claim.icon}</div>
                <CardTitle>{claim.title}</CardTitle>
                <CardDescription>{claim.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={claim.to} state={claim.state}>
                  <Button variant="destructive" className="w-full group">
                    Reportar Ahora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Características del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">✅ Formularios Dinámicos</h3>
              <p className="text-sm text-muted-foreground">
                Formularios adaptables según el tipo de seguro y marca
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">✅ Validaciones Avanzadas</h3>
              <p className="text-sm text-muted-foreground">
                Validación en tiempo real con Zod y react-hook-form
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">✅ Multi-marca</h3>
              <p className="text-sm text-muted-foreground">
                Copys personalizados por marca o empresa
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">✅ Comparación de Seguros</h3>
              <p className="text-sm text-muted-foreground">
                Compara coberturas de múltiples aseguradoras
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Stack Tecnológico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              'React',
              'TypeScript',
              'Vite',
              'TailwindCSS',
              'shadcn/ui',
              'Zod',
              'React Hook Form',
              'TanStack Query',
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
