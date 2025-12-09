import type { FormStartDetail } from '@jonathanludena/form-engine';

const DEFAULT_BRAND = 'LPC001';
const DEFAULT_FEATURE = 'claim';
const DEFAULT_INSURANCE = 'health';

interface WebhookErrorResponse {
  success: false;
  error: string;
  code: 404 | 401;
}

// Health Claim Structure
interface HealthClaimData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  availablePolicies: Array<{
    value: string;
    label: string;
  }>;
  policyNumber: string;
  planName: string;
  insurer: string;
  healthCoverage: Record<string, unknown>;
  dependents: Array<{
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    birthDate: string;
    identificationType: string;
    identificationNumber: string;
  }>;
  medicalCenters: Array<{
    value: string;
    label: string;
  }>;
}

// Vehicle Claim Structure
interface VehicleClaimData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  availablePolicies: Array<{
    value: string;
    label: string;
  }>;
  policyNumber: string;
  planName: string;
  insurer: string;
  vehicleDetails: Record<string, unknown>;
  vehiclePlate: string;
}

interface WebhookSuccessResponse {
  success: true;
  data: {
    brand?: string;
    feature?: string;
    insurance?: 'health' | 'vehicule';
    initialData: HealthClaimData | VehicleClaimData;
  };
}

type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;

function getWebhookConfig() {
  const webhookUrl = process.env.WEBHOOK_CLAIM_START_URL;
  const apiKey = process.env.ROUTARA_API_KEY;

  if (!webhookUrl || !apiKey) {
    throw new Error('Webhook configuration missing. Set WEBHOOK_CLAIM_START_URL and ROUTARA_API_KEY.');
  }

  return { webhookUrl, apiKey };
}

function normalizeInsurance(value: string | undefined, fallback: 'health' | 'vehicule'): 'health' | 'vehicule' {
  if (!value) return fallback;
  const lower = value.toLowerCase();
  if (lower === 'vehicle' || lower === 'vehicule') return 'vehicule';
  if (lower === 'health') return 'health';
  return fallback;
}

function normalizeFeature(value: string | undefined): 'claim' | 'quote' | 'collection' {
  if (!value) return DEFAULT_FEATURE;
  const lower = value.toLowerCase();
  if (lower === 'claim' || lower === 'quote' || lower === 'collection') {
    return lower as 'claim' | 'quote' | 'collection';
  }
  return DEFAULT_FEATURE;
}

export async function getClaimStartConfigByToken(
  token: string,
  insuranceType: 'health' | 'vehicule'
): Promise<FormStartDetail> {
  const { webhookUrl, apiKey } = getWebhookConfig();

  try {
    const response = await fetch(`${webhookUrl}?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-routara-key': apiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status: ${response.status}`);
    }

    const result: WebhookResponse = await response.json();

    if (!result.success) {
      const errorCode = result.code === 404 ? '404' : '401';
      throw new Error(`Claim start validation failed: ${result.error} (${errorCode})`);
    }

    const payload = result.data;
    const normalizedInsurance = normalizeInsurance(payload.insurance, insuranceType ?? DEFAULT_INSURANCE);

    return {
      brand: payload.brand ?? DEFAULT_BRAND,
      feature: normalizeFeature(payload.feature),
      insurance: normalizedInsurance,
      initialData: payload.initialData,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch claim start configuration: ${String(error)}`);
  }
}
