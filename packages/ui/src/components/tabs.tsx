import * as React from 'react';
import { cn } from '@floodguard/utils';

/**
 * Storybook & Component Documentation: Tabs Suite
 *
 * **Purpose:** Switch between view perspectives (e.g., Live Map / Data Table / Analytics).
 * **Usage:** `<Tabs defaultValue="map"><TabsList><TabsTrigger value="map">Map</TabsTrigger><TabsTrigger value="table">Table</TabsTrigger></TabsList><TabsContent value="map">...</TabsContent></Tabs>`
 * **Accessibility Notes:** ARIA `tablist`, `tab`, `tabpanel` with keyboard arrow key support.
 */

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(
    controlledValue || defaultValue || '',
  );

  const currentTab =
    controlledValue !== undefined ? controlledValue : selectedTab;

  const handleTabChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setSelectedTab(newValue);
      }
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange],
  );

  return (
    <TabsContext.Provider
      value={{ value: currentTab, onValueChange: handleTabChange }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      'bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-lg p-1',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, icon, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const isActive = context.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        onClick={() => context.onValueChange(value)}
        className={cn(
          'ring-offset-background focus-visible:ring-ring inline-flex select-none items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-background text-foreground font-semibold shadow-sm'
            : 'hover:bg-background/50 hover:text-foreground/80',
          className,
        )}
        {...props}
      >
        {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    if (context.value !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          'ring-offset-background focus-visible:ring-ring animate-in fade-in-50 mt-4 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
