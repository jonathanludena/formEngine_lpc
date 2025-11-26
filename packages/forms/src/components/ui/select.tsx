import * as React from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  id?: string;
  ariaLabel?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Seleccionar...',
  disabled = false,
  className,
  id,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  const selectRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  React.useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideSelect = selectRef.current && selectRef.current.contains(target);
      const clickedInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      if (!clickedInsideSelect && !clickedInsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute dropdown position when opened
  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownStyle({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    } else {
      setDropdownStyle(null);
    }
  }, [isOpen]);

  // Update position on resize/scroll
  React.useEffect(() => {
    const handler = () => {
      if (isOpen && selectRef.current) {
        const rect = selectRef.current.getBoundingClientRect();
        setDropdownStyle({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      }
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

  return (
    <div ref={selectRef} className={clsx('relative', className)}>
      <button
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'flex h-10 w-full items-center justify-between rounded-md border border-input',
          'bg-background px-3 py-2 text-sm ring-offset-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !selectedValue && 'text-muted-foreground'
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={clsx('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && dropdownStyle &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: 'absolute', top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
            className="z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md"
          >
            <div className="max-h-[300px] overflow-y-auto p-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={clsx(
                    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm',
                    'outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground',
                    selectedValue === option.value && 'bg-accent'
                  )}
                >
                  <Check
                    className={clsx(
                      'mr-2 h-4 w-4',
                      selectedValue === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

Select.displayName = 'Select';

export { Select };
