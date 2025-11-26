import { forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';

export interface FormSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  ({ label, error, helperText, placeholder, options, value, onValueChange, disabled, id }, ref) => {
    return (
      <div className="space-y-2" ref={ref}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          id={id}
          ariaLabel={`${placeholder ? placeholder : ''}${label ? (placeholder ? ' ' : '') + label : ''}`}
          placeholder={placeholder}
          options={options}
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export { FormSelect };
export type { SelectOption };
