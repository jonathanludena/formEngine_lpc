/**
 * CustomEvent names for form communication
 * These events are used for Host ⇄ Form communication
 */
export const FORM_EVENTS = {
  /** Dispatched from Host to Form to initialize form with configuration */
  START: 'form:start',
  
  /** Bidirectional event:
   * - From Form to Host: carries form data on submission
   * - From Host to Form: carries loading state
   */
  SUBMIT: 'form:submit',
  
  /** Dispatched from Host to Form to provide submission result feedback */
  RESULT: 'form:result',
} as const;

export type FormEventName = typeof FORM_EVENTS[keyof typeof FORM_EVENTS];
