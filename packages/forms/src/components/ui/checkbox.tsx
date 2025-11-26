import * as React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, onChange, ...props }, ref) => {
    const localRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(localRef.current);
      } else {
        try {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = localRef.current;
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to assign ref in Checkbox:', error);
          }
        }
      }
    }, [ref]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={localRef}
          checked={checked ?? false}
          onChange={handleChange}
          {...props}
        />
        <div
          className={clsx(
            'h-5 w-5 shrink-0 rounded border border-primary',
            'ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'peer-checked:bg-primary peer-checked:text-primary-foreground',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'cursor-pointer transition-colors',
            'flex items-center justify-center',
            className
          )}
          onClick={() => {
            localRef.current?.click();
          }}
        >
          <Check
            className={clsx(
              'h-4 w-4 text-current opacity-0 transition-opacity',
              checked && 'opacity-100'
            )}
          />
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
