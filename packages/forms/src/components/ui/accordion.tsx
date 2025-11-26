import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Context para el Accordion
interface AccordionContextValue {
  value: string | null;
  onValueChange: (value: string) => void;
  type?: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
};

// Accordion Root
interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Accordion = ({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}: AccordionProps) => {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      const newValue = value === itemValue ? '' : itemValue;
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Accordion Item
interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const AccordionItemContext = createContext<{ value: string; isOpen: boolean } | undefined>(undefined);

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem components must be used within AccordionItem');
  }
  return context;
};

export const AccordionItem = ({ value, className, children }: AccordionItemProps) => {
  const { value: openValue } = useAccordion();
  const isOpen = openValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        className={cn(
          'border rounded-lg overflow-hidden',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// Accordion Trigger
interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionTrigger = ({ className, children }: AccordionTriggerProps) => {
  const { onValueChange } = useAccordion();
  const { value, isOpen } = useAccordionItem();

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between py-4 px-5 text-left font-medium transition-all',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={() => onValueChange(value)}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
};

// Accordion Content
interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionContent = ({ className, children }: AccordionContentProps) => {
  const { isOpen } = useAccordionItem();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen, children]);

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        className
      )}
      style={{ height: isOpen ? height : 0 }}
    >
      <div ref={contentRef} className="px-5 pb-4 pt-0">
        {children}
      </div>
    </div>
  );
};
