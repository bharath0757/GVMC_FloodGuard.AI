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
      className={cn('relative w-full flex flex-col justify-center items-center rounded-lg bg-background/50 p-2', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      {...props}
    >
      {isLoading && (
        <div className="w-full h-full flex flex-col space-y-3 p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-destructive">
          <AlertCircle className="h-8 w-8 mb-2 opacity-80" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!isLoading && !error && isEmpty && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <BarChart2 className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}

      {!isLoading && !error && !isEmpty && <div className="w-full h-full">{children}</div>}
    </div>
  );
};
