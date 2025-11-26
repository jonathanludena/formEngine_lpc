import * as React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
  onClose?: () => void;
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);

  React.useEffect(() => {
    setIsOpen(open ?? false);
  }, [open]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <SheetContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within Sheet');
  }
  return context;
};

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  SheetTriggerProps
>(({ asChild = false, className, onClick, children, ...props }, ref) => {
  const { setIsOpen } = useSheet();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(true);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        handleClick(e);
        const childOnClick = (child.props as Record<string, unknown>)['onClick'];
        if (typeof childOnClick === 'function') (
          childOnClick as (event: React.MouseEvent<HTMLButtonElement>) => void
        )(e);
      },
    });
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
SheetTrigger.displayName = 'SheetTrigger';

const SheetPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSheet();
  
  if (!isOpen) return null;

  return <>{children}</>;
};

const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { setIsOpen } = useSheet();

    return (
      <div
        ref={ref}
        className={clsx(
          'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
          className
        )}
        onClick={() => setIsOpen(false)}
        {...props}
      />
    );
  }
);
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, onClose, ...props }, ref) => {
    const { setIsOpen, isOpen } = useSheet();

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          onClose?.();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
      }
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, setIsOpen, onClose]);

    const sideStyles = {
      left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
      top: 'inset-x-0 top-0 w-full border-b',
      bottom: 'inset-x-0 bottom-0 w-full border-t',
    };

    return (
      <SheetPortal>
        <div className="fixed inset-0 z-50">
          <SheetOverlay />
          <div
            ref={ref}
            className={clsx(
              'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
              sideStyles[side],
              className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={clsx('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
);
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
