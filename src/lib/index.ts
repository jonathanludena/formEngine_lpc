// Export main components (organisms)
export { InsuranceQuoteForm } from '@/components/organisms/InsuranceQuoteForm';
export { ClaimForm } from '@/components/organisms/ClaimForm';

// Export types
export type {
  InsuranceType,
  BrandId,
  PersonalInfo,
  HealthQuoteData,
  LifeQuoteData,
  LifeSavingsQuoteData,
  VehicleQuoteData,
  QuoteFormData,
  BaseFormProps,
  QuoteResult,
  InsuranceCompany,
} from '@/lib/types';

// Export schemas
export {
  healthQuoteSchema,
  lifeQuoteSchema,
  lifeSavingsQuoteSchema,
  vehicleQuoteSchema,
  quoteSchema,
} from '@/lib/schemas';

export type { QuoteSchemaType } from '@/lib/schemas';

// Export utilities
export { getBrandCopies } from '@/data';
export type { BrandCopies } from '@/data/copies/brand-copies';

// Export UI components (opcional, para uso avanzado)
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
export { Button } from '@/components/ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
