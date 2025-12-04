'use client';

import { useState, useEffect } from 'react';
import type { FormStartDetail } from '@jonathanludena/form-engine';
import type { Policy, PolicyListItem, Dependent, MedicalCenter, SelectOption } from './types';

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
    label: `${policy.policyNumber} - ${policy.plan?.name} (${policy.plan?.insurer?.name})`,
  }));
}

/**
 * Transforms a list of dependents into a simplified format.
 */
function transformDependents(dependents: Dependent[]) {
  return dependents.map(({ id, firstName, lastName, relationship, birthDate, identificationType, identificationNumber }) => ({
    id,
    firstName,
    lastName,
    relationship,
    birthDate,
    identificationType,
    identificationNumber,
  }));
}

/**
 * Transforms a list of medical centers into select options.
 */
function transformMedicalCentersToOptions(medicalCenters: MedicalCenter[]): SelectOption[] {
  return medicalCenters.map(mc => ({
    value: mc.id,
    label: `${mc.name} - ${mc.type} (${mc.city})`,
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
    insurance: 'health',
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
      healthCoverage: policyData.parsedDetails,
      dependents: policyData.dependents ? transformDependents(policyData.dependents) : [],
      medicalCenters: policyData.medicalCenters ? transformMedicalCentersToOptions(policyData.medicalCenters) : [],
    },
  };
}

const defaultBasicConfig: FormStartDetail = {
  brand: 'LPC001',
  feature: 'claim',
  insurance: 'health',
};

// --- Custom Hook ---

interface UseClaimHealthConfigReturn {
  config: FormStartDetail | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and configure the data needed for the Health Claim form.
 * @param policyId - The ID of the policy to load.
 */
export function useClaimHealthConfig(policyId: string): UseClaimHealthConfigReturn {
  const [config, setConfig] = useState<FormStartDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      setError(null);

      try {
        const policyData = await fetchData<Policy>(
          `${API_BASE_URL}/insured/${policyId}`,
          'Failed to fetch policy data'
        );

        const customerPolicies = await fetchData<PolicyListItem[]>(
          `${API_BASE_URL}/customers/${policyData.customerId}/policies?insuranceType=health`,
          'Failed to fetch customer policies'
        );
        
        const availablePolicies = transformPoliciesToOptions(customerPolicies);
        const formConfig = buildFormConfig(policyData, availablePolicies);
        
        setConfig(formConfig);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error loading insured data:', errorMessage);
        setError(errorMessage);
        setConfig(defaultBasicConfig); // Fallback to basic config
      } finally {
        setIsLoading(false);
      }
    }

    if (policyId) {
      loadInitialData();
    }
  }, [policyId]);

  return { config, isLoading, error };
}
