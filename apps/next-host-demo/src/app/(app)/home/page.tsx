import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Car, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Bienvenido a Form Engine
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-2">
          Sistema de Formularios Dinámicos para LPC Insurance Broker
        </p>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto px-4">
          Plataforma de gestión de seguros y cotizaciones con comunicación por eventos personalizados
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Cotizaciones */}
        <div className="bg-white rounded-2xl shadow-airbnb hover:shadow-airbnb-hover transition-all p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Cotizaciones</h2>
          </div>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Obtén cotizaciones personalizadas para diferentes tipos de seguros
          </p>
          <div className="space-y-2 sm:space-y-3">
            <Link href="/quote/health">
              <Button className="w-full justify-between" size="lg">
                Seguro de Salud
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link href="/quote/vehicle">
              <Button className="w-full justify-between" size="lg" variant="outline">
                Seguro Vehicular
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link href="/quote/life">
              <Button className="w-full justify-between" size="lg" variant="outline">
                Seguro de Vida
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link href="/quote/life-savings">
              <Button className="w-full justify-between" size="lg" variant="outline">
                Vida y Ahorro
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Reclamos */}
        <div className="bg-white rounded-2xl shadow-airbnb hover:shadow-airbnb-hover transition-all p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reclamos</h2>
          </div>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Registra y gestiona siniestros de manera rápida y sencilla
          </p>
          <div className="space-y-2 sm:space-y-3">
            <Link href="/claim/health">
              <Button className="w-full justify-between" size="lg" variant="outline">
                Siniestro de Salud
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link href="/claim/vehicle">
              <Button className="w-full justify-between" size="lg" variant="outline">
                Siniestro Vehicular
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl shadow-airbnb p-6 sm:p-8 border border-gray-100">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          Características del Sistema
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎨</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Design System Airbnb</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Paleta de colores y componentes basados en el design system de Airbnb
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Custom Events</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Comunicación mediante eventos personalizados entre host y formularios
            </p>
          </div>
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🌍</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Multi-idioma</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Sistema de copies por broker para personalización completa
            </p>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="text-center text-gray-500 space-y-2 pt-6 sm:pt-8 border-t">
        <p className="text-xs sm:text-sm px-4">
          Demo de integración con Next.js App Router • Prisma + Turso • Autenticación JWT
        </p>
        <p className="text-xs">
          Versión 2.1.0 • © 2025 LPC Insurance Broker
        </p>
      </div>
    </div>
  );
}
