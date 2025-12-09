'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <div className="text-7xl md:text-8xl font-bold text-gray-900">404</div>
          <p className="text-xl md:text-2xl font-semibold text-gray-700">
            Página no encontrada
          </p>
        </div>

        {/* Error Description */}
        <div className="space-y-4">
          <p className="text-gray-600 text-lg">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <p className="text-gray-500 text-sm">
            Verifica la URL e intenta de nuevo, o utiliza los botones a continuación para continuar navegando.
          </p>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left space-y-3">
          <h3 className="font-semibold text-blue-900 flex items-center gap-2">
            <span>💡</span> Opciones disponibles:
          </h3>
          <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
            <li>Regresa al inicio para explorar las opciones disponibles</li>
            <li>Usa el botón atrás para ir a la página anterior</li>
            <li>Verifica que hayas ingresado la URL correcta</li>
            <li>Contacta a soporte si persiste el problema</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/">
            <Button className="gap-2" size="lg">
              <Home className="w-5 h-5" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Atrás
          </Button>
        </div>

        {/* Additional Help Links */}
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <p className="text-sm text-gray-600">
            Algunos enlaces útiles que podrían interesarte:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link
              href="/claim/health"
              className="text-primary hover:underline font-medium"
            >
              Crear Reclamación
            </Link>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <Link
              href="/quote/health"
              className="text-primary hover:underline font-medium"
            >
              Solicitar Cotización
            </Link>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <Link
              href="/claim/health/sin-query"
              className="text-primary hover:underline font-medium"
            >
              Información de Reclamaciones
            </Link>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center space-y-2 border-t border-gray-200 pt-8">
          <p className="text-gray-600 text-sm">
            ¿Necesitas ayuda? Contacta a nuestro equipo:
          </p>
          <div className="space-y-1">
            <p className="text-primary font-semibold">support@lpc.com</p>
            <p className="text-gray-600 text-sm">Disponible de lunes a viernes, 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
