import { forwardRef, ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface FormCheckboxProps {
  label: string | ReactNode;
  error?: string;
  helperText?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  linkText?: string;
  onLinkClick?: () => void;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, helperText, checked, onCheckedChange, disabled, id, linkText, onLinkClick }, ref) => {
    const fieldId = id || `checkbox-${typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : 'checkbox'}`;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={fieldId}
            ref={ref}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
          <Label
            htmlFor={fieldId}
            className="text-sm font-normal leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {linkText && onLinkClick && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onLinkClick();
                  }}
                  className="text-primary hover:underline font-normal"
                >
                  {linkText}
                </button>
              </>
            )}
          </Label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

export { FormCheckbox };
