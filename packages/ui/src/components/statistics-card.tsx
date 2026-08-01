import * as React from 'react';
import { cn } from '@floodguard/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from './card';

/**
 * Storybook & Component Documentation: StatisticsCard
 * 
 * **Purpose:** Display high-level telemetry KPIs (e.g. Active Evacuations, Water Level Change, Open Shelters).
 * **Usage:** `<StatisticsCard title="Active Shelters" value="42 / 50" trend="+4 this hour" trendDirection="up" icon={<Building />} />`
 * **Accessibility Notes:** Structured text output for screen reader announcements.
 */

export interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'safe';
  className?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'neutral',
  icon,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'border-border',
    danger: 'border-red-500/40 bg-red-500/5',
    warning: 'border-amber-500/40 bg-amber-500/5',
    safe: 'border-emerald-500/40 bg-emerald-500/5',
  };

  return (
    <Card className={cn('overflow-hidden transition-all', variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground p-2 rounded-lg bg-muted/60">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-extrabold tracking-tight text-foreground font-mono">{value}</div>
          {trend && (
            <div
              className={cn(
                'inline-flex items-center text-xs font-semibold rounded-full px-2 py-0.5',
                trendDirection === 'up' && 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
                trendDirection === 'down' && 'text-red-600 bg-red-500/10 dark:text-red-400',
                trendDirection === 'neutral' && 'text-muted-foreground bg-muted'
              )}
            >
              {trendDirection === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
              {trendDirection === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
              {trendDirection === 'neutral' && <Minus className="mr-1 h-3 w-3" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};
