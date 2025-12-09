# Estructura de Webhook para Claim Start

Este documento describe la estructura esperada del webhook que reemplaza la conexión directa a Redis.

## Configuración

### Variables de Entorno

```env
WEBHOOK_CLAIM_START_URL="https://your-webhook-url.com/api/claim-start"
ROUTARA_API_KEY="your-routara-secret-key"
```

## Request

### Método

`GET`

### Headers

```
Content-Type: application/json
x-routara-key: <ROUTARA_API_KEY>
```

### Query Parameters

- `token`: Token de sesión a validar

### Ejemplo de Request

```
GET https://your-webhook-url.com/api/claim-start?token=abc123xyz
Headers:
  Content-Type: application/json
  x-routara-key: your-secret-key
```

## Response

### Success Response (200 OK)

#### Para Health Claims

```json
{
  "success": true,
  "data": {
    "brand": "LPC001",
    "feature": "claim",
    "insurance": "health",
    "initialData": {
      "personalInfo": {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan.perez@example.com",
        "phone": "+1234567890"
      },
      "availablePolicies": [
        {
          "value": "POL-HEALTH-001",
          "label": "POL-HEALTH-001 - Plan Premium (Aseguradora XYZ)"
        }
      ],
      "policyNumber": "POL-HEALTH-001",
      "planName": "Plan Premium",
      "insurer": "Aseguradora XYZ",
      "healthCoverage": {
        "coverageAmount": 100000,
        "deductible": 500,
        "coinsurance": 20
      },
      "dependents": [
        {
          "id": "dep-001",
          "firstName": "María",
          "lastName": "Pérez",
          "relationship": "spouse",
          "birthDate": "1990-05-15",
          "identificationType": "cedula",
          "identificationNumber": "123456789"
        }
      ],
      "medicalCenters": [
        {
          "value": "mc-001",
          "label": "Hospital Central - Hospital (Ciudad Capital)"
        }
      ]
    }
  }
}
```

#### Para Vehicle Claims

```json
{
  "success": true,
  "data": {
    "brand": "LPC001",
    "feature": "claim",
    "insurance": "vehicule",
    "initialData": {
      "personalInfo": {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan.perez@example.com",
        "phone": "+1234567890"
      },
      "availablePolicies": [
        {
          "value": "POL-VEHICLE-001",
          "label": "POL-VEHICLE-001 - ABC123 (Aseguradora XYZ)"
        }
      ],
      "policyNumber": "POL-VEHICLE-001",
      "planName": "Seguro Todo Riesgo",
      "insurer": "Aseguradora XYZ",
      "vehicleDetails": {
        "make": "Toyota",
        "model": "Corolla",
        "year": 2022,
        "color": "Blanco",
        "vin": "1HGBH41JXMN109186"
      },
      "vehiclePlate": "ABC123"
    }
  }
}
```

### Error Responses

#### Token Not Found (404)

```json
{
  "success": false,
  "error": "Token no encontrado o expirado",
  "code": 404
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "error": "API key inválida",
  "code": 401
}
```

## Notas Importantes

1. **Seguridad**: El header `x-routara-key` debe validarse en cada request del webhook
2. **SSR Only**: Esta llamada solo debe realizarse en server-side rendering (SSR), nunca desde el cliente
3. **Cache**: La request usa `cache: 'no-store'` para asegurar datos frescos
4. **Estructura**: La estructura `initialData` debe mantener el formato específico de health o vehicle según el tipo de claim
5. **Campos Requeridos**: Todos los campos mostrados en los ejemplos son requeridos para el correcto funcionamiento del formulario

## Migración desde Redis

El webhook reemplaza la conexión directa a Redis con las siguientes ventajas:

- ✅ No requiere credenciales de Redis en la aplicación
- ✅ Centraliza la lógica de autenticación y validación
- ✅ Permite mayor flexibilidad en la fuente de datos (puede venir de cualquier backend)
- ✅ Facilita el versionado y cambios en la estructura de datos
- ✅ Mejor seguridad con API key específica
