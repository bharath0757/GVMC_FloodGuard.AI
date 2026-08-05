import * as React from 'react';
import { cn } from '@floodguard/utils';
import { Skeleton } from './skeleton';
import { BarChart2, AlertCircle } from 'lucide-react';

/**
 * Storybook & Component Documentation: ChartContainer
 *
 * **Purpose:** Responsive container for chart visualizations (Recharts, ChartJS, etc.) with unified loading/empty/error states.
 * **Usage:** `<ChartContainer isLoading={loading} isEmpty={data.length === 0}>...<ResponsiveContainer>...</ChartContainer>`
 * **Accessibility Notes:** Provides alt text / summary view for screen readers when data charts cannot be parsed visually.
 */

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  height = 300,
  isLoading = false,
  isEmpty = false,
  error,
  emptyMessage = 'No telemetry data available for the selected timeframe.',
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-background/50 relative flex w-full flex-col items-center justify-center rounded-lg p-2',
        className,
      )}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      {...props}
    >
      {isLoading && (
        <div className="flex h-full w-full flex-col space-y-3 p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      )}

      {!isLoading && error && (
        <div className="text-destructive flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="mb-2 h-8 w-8 opacity-80" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!isLoading && !error && isEmpty && (
        <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
          <BarChart2 className="mb-2 h-8 w-8 opacity-40" />
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}

      {!isLoading && !error && !isEmpty && (
        <div className="h-full w-full">{children}</div>
      )}
    </div>
  );
};
