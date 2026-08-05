import * as React from 'react';
import { cn } from '@floodguard/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

/**
 * Storybook & Component Documentation: AnalyticsCard
 *
 * **Purpose:** Card container designed specifically for hosting data analytics widgets, charts, and historical trends.
 * **Usage:** `<AnalyticsCard title="Precipitation Trends" description="24h water level forecast" actionSlot={<Button size="sm">Export CSV</Button>}>...chart...</AnalyticsCard>`
 * **Accessibility Notes:** Semantic section container with standard heading hierarchy.
 */

export interface AnalyticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  children: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  description,
  actionSlot,
  filterSlot,
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={cn('flex h-full flex-col overflow-hidden', className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {filterSlot}
          {actionSlot}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">{children}</CardContent>
    </Card>
  );
};
