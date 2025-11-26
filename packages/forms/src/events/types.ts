/**
 * Type definitions for CustomEvent detail payloads
 */

/**
 * Configuration sent from Host to Form via form:start
 */
export interface FormStartDetail<T = unknown> {
  /** Broker/brand ID */
  brand: string;
  
  /** Feature type: claim, quote, or collection */
  feature: 'claim' | 'quote' | 'collection';
  
  /** Insurance type */
  insurance: 'vehicule' | 'health' | 'life' | 'life_savings';
  
  /** Callback function to handle form submission (not used with CustomEvents, kept for compatibility) */
  onSubmit?: (data: T) => void | Promise<void>;
  
  /** Optional initial data to populate form */
  initialData?: Partial<T>;
}

/**
 * Data sent from Form to Host via form:submit
 */
export interface FormSubmitDataDetail<T = unknown> {
  /** Form data payload */
  data: T;
}

/**
 * Loading state sent from Host to Form via form:submit
 */
export interface FormSubmitLoadingDetail {
  /** Loading state for submit button */
  isLoading: boolean;
}

/**
 * Result feedback sent from Host to Form via form:result
 */
export interface FormResultDetail {
  /** Whether the operation was successful */
  ok: boolean;
  
  /** Success message to display */
  message?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Optional result ID (e.g., created record ID) */
  resultId?: string;
}

/**
 * Type guard to check if detail contains data (Form → Host)
 */
export function isFormSubmitData<T>(
  detail: FormSubmitDataDetail<T> | FormSubmitLoadingDetail
): detail is FormSubmitDataDetail<T> {
  return 'data' in detail;
}

/**
 * Type guard to check if detail contains loading state (Host → Form)
 */
export function isFormSubmitLoading(
  detail: FormSubmitDataDetail | FormSubmitLoadingDetail
): detail is FormSubmitLoadingDetail {
  return 'isLoading' in detail;
}
