'use client';

import { useState, useEffect } from 'react';
import type { FormStartDetail } from '@jonathanludena/form-engine';
import type { Policy, PolicyListItem, SelectOption } from './types';

const API_BASE_URL = '/api';

// --- Helper Functions ---

/**
 * Fetches data from the API and handles the response.
 * @param url - The URL to fetch from.
 * @param errorMessage - The error message to throw if the fetch fails.
 */
async function fetchData<T>(url: string, errorMessage: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorInfo = await response.json().catch(() => ({}));
    throw new Error(errorInfo.error || errorMessage);
  }
  const { data } = await response.json();
  return data;
}

/**
 * Transforms a list of policies into select options.
 */
function transformPoliciesToOptions(policies: PolicyListItem[]): SelectOption[] {
  return policies.map(policy => ({
    value: policy.policyNumber,
    label: `${policy.policyNumber} - ${policy.parsedDetails?.plate || policy.plan?.name} (${policy.plan?.insurer?.name})`,
  }));
}

/**
 * Builds the final form configuration object.
 * @param policyData - The main policy data.
 * @param availablePolicies - The list of available policies for the customer.
 */
function buildFormConfig(policyData: Policy, availablePolicies: SelectOption[]): FormStartDetail {
  return {
    brand: 'LPC001',
    feature: 'claim',
    insurance: 'vehicule',
    initialData: {
      personalInfo: {
        firstName: policyData.customer.firstName,
        lastName: policyData.customer.lastName,
        email: policyData.customer.email,
        phone: policyData.customer.phone,
      },
      availablePolicies,
      policyNumber: policyData.policyNumber,
      planName: policyData.plan?.name,
      insurer: policyData.plan?.insurer?.name,
      vehicleDetails: policyData.parsedDetails,
      vehiclePlate: policyData.parsedDetails?.plate,
    },
  };
}

const defaultBasicConfig: FormStartDetail = {
  brand: 'LPC001',
  feature: 'claim',
  insurance: 'vehicule',
};

// --- Custom Hook ---

interface UseClaimVehicleConfigReturn {
  config: FormStartDetail | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to load and manage the claim vehicle form configuration.
 * @param policyNumber - The policy number to load data for.
 */
export function useClaimVehicleConfig(policyNumber: string): UseClaimVehicleConfigReturn {
  const [config, setConfig] = useState<FormStartDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClaimVehicleData() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Load main policy data
        const policyData = await fetchData<Policy>(
          `${API_BASE_URL}/insured/${policyNumber}`,
          'No se pudo cargar la información de la póliza'
        );

        // 2. Load all vehicle policies for the customer
        let availablePolicies: SelectOption[] = [];
        try {
          const policiesList = await fetchData<PolicyListItem[]>(
            `${API_BASE_URL}/customers/${policyData.customerId}/policies?insuranceType=vehicle`,
            'No se pudieron cargar las pólizas disponibles'
          );
          availablePolicies = transformPoliciesToOptions(policiesList);
        } catch (err) {
          console.warn('Could not load available policies:', err);
          // Continue without available policies
        }

        // 3. Build the complete configuration
        const formConfig = buildFormConfig(policyData, availablePolicies);
        setConfig(formConfig);
      } catch (err) {
        console.error('Error loading claim vehicle data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        // Set basic config as fallback
        setConfig(defaultBasicConfig);
      } finally {
        setIsLoading(false);
      }
    }

    loadClaimVehicleData();
  }, [policyNumber]);

  return { config, isLoading, error };
}
