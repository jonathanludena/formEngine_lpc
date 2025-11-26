'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Car, DollarSign, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">LPC Insurance Broker</h1>
        <p className="text-xl text-muted-foreground">
          Sistema de Gestión de Seguros y Cotizaciones
        </p>
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
              <Button className="w-full" variant="default">
                <Heart className="w-4 h-4 mr-2" />
                Seguro de Salud
              </Button>
            </Link>
            <Link href="/quote/vehicle">
              <Button className="w-full" variant="default">
                <Car className="w-4 h-4 mr-2" />
                Seguro Vehicular
              </Button>
            </Link>
            <Link href="/quote/life">
              <Button className="w-full" variant="default">
                <DollarSign className="w-4 h-4 mr-2" />
                Seguro de Vida
              </Button>
            </Link>
            <Link href="/quote/life-savings">
              <Button className="w-full" variant="default">
                <DollarSign className="w-4 h-4 mr-2" />
                Vida y Ahorro
              </Button>
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
              <Button className="w-full" variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Reclamo Salud
              </Button>
            </Link>
            <Link href="/claim/vehicle">
              <Button className="w-full" variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Reclamo Vehicular
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Información */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Sistema</CardTitle>
            <CardDescription>Información del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-gray-600">
              Demo de integración de formularios con Next.js App Router
            </p>
            <p className="text-gray-600">
              Comunicación por CustomEvents • Prisma + SQLite • Autenticación JWT
            </p>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">Versión: 2.1.0</p>
              <p className="text-xs text-gray-500">© 2025 LPC</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
