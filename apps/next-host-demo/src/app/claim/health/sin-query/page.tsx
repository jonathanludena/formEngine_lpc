'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function NoQueryLandingPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 md:space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
          Sistema de Gestión de Reclamaciones
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Plataforma integral para procesar reclamaciones de seguros de salud con máxima eficiencia
        </p>
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
          Simplificamos el proceso de reclamos con tecnología avanzada y seguimiento en tiempo real
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Feature 1 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguridad</h3>
          <p className="text-gray-600 text-sm">
            Tus datos están protegidos con los más altos estándares de seguridad
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Rápido</h3>
          <p className="text-gray-600 text-sm">
            Procesa tus reclamaciones en minutos, no en días
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Soporte</h3>
          <p className="text-gray-600 text-sm">
            Equipo dedicado disponible para ayudarte en cada paso
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Eficiente</h3>
          <p className="text-gray-600 text-sm">
            Automatización inteligente para reducir tiempos de espera
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 border border-primary/10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          ¿Por qué elegir nuestro sistema?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">✓ Proceso simplificado</h3>
            <p className="text-gray-700">
              Interfaz intuitiva que guía al usuario paso a paso a través del proceso de reclamo
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">✓ Seguimiento en tiempo real</h3>
            <p className="text-gray-700">
              Monitorea el estado de tus reclamaciones desde cualquier dispositivo
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">✓ Integración completa</h3>
            <p className="text-gray-700">
              Conectado con nuestro sistema de gestión de pólizas y aseguradoras
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">✓ Validación automática</h3>
            <p className="text-gray-700">
              Sistema inteligente que valida datos y detecta inconsistencias al instante
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            10K+
          </div>
          <p className="text-gray-600">Reclamaciones procesadas</p>
        </div>
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
            98%
          </div>
          <p className="text-gray-600">Tasa de satisfacción</p>
        </div>
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
            24h
          </div>
          <p className="text-gray-600">Tiempo promedio de respuesta</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Listo para iniciar?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accede a través de tu portal de seguros con tu número de póliza para procesar tu reclamo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/claim/health">
              <Button size="lg" className="gap-2">
                Ingresar con Póliza
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="text-center space-y-4 pb-8">
        <p className="text-gray-600">
          ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
        </p>
        <div className="space-x-4 text-sm">
          <a href="mailto:support@lpc.com" className="text-primary hover:underline">
            support@lpc.com
          </a>
          <span className="text-gray-400">•</span>
          <a href="tel:+1234567890" className="text-primary hover:underline">
            +1 (234) 567-890
          </a>
        </div>
      </section>
    </div>
  );
}
