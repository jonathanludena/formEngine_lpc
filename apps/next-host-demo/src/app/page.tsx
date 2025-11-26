import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">LPC Insurance Broker</h1>
          <p className="text-xl text-gray-600">Sistema de Gestión de Seguros y Cotizaciones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Nueva Cotización */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Nueva Cotización</CardTitle>
              <CardDescription>Obtén una cotización para tu seguro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/quote/health">
                <Button className="w-full" variant="default">Seguro de Salud</Button>
              </Link>
              <Link href="/quote/vehicle">
                <Button className="w-full" variant="default">Seguro Vehicular</Button>
              </Link>
              <Link href="/quote/life">
                <Button className="w-full" variant="default">Seguro de Vida</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Registrar Reclamo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Registrar Reclamo</CardTitle>
              <CardDescription>Clientes existentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/claim/health">
                <Button className="w-full" variant="secondary">Reclamo Salud</Button>
              </Link>
              <Link href="/claim/vehicle">
                <Button className="w-full" variant="secondary">Reclamo Vehicular</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Consultas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Consultas</CardTitle>
              <CardDescription>Buscar información</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/search/customers">
                <Button className="w-full" variant="outline">Buscar Clientes</Button>
              </Link>
              <Link href="/search/insured">
                <Button className="w-full" variant="outline">Buscar Asegurados</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-600 mt-12">
          <p>Demo de integración de formularios con Next.js App Router</p>
          <p>Comunicación por CustomEvents • Prisma + SQLite • Autenticación JWT</p>
        </div>
      </div>
    </main>
  );
}
