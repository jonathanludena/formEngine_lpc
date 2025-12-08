import React from 'react';

export function ClaimVehicleLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Siniestro Vehicular</h1>
        <p className="text-muted-foreground mt-2">Cargando información...</p>
      </div>
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
