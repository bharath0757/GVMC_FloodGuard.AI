import * as React from 'react';
import { cn } from '@floodguard/utils';
import { Card, CardContent } from './card';
import { Progress } from './progress';

/**
 * Storybook & Component Documentation: MetricCard
 * 
 * **Purpose:** Display sensor telemetry or resource metrics with status indicator dots and target thresholds.
 * **Usage:** `<MetricCard label="Ward 12 Rainfall" value="124.5 mm" progress={82} status="critical" timestamp="2 mins ago" />`
 * **Accessibility Notes:** Accessible text descriptions for screen readers.
 */

export interface MetricCardProps {
  label: string;
  value: string | number;
  target?: string | number;
  progress?: number; // 0 - 100
  status?: 'safe' | 'warning' | 'danger' | 'neutral';
  timestamp?: string;
  unit?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  target,
  progress,
  status = 'neutral',
  timestamp,
  unit,
  className,
}) => {
  const statusDots = {
    safe: 'bg-emerald-500 shadow-emerald-500/50',
    warning: 'bg-amber-500 shadow-amber-500/50',
    danger: 'bg-red-500 shadow-red-500/50 animate-pulse',
    neutral: 'bg-slate-400',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={cn('h-2.5 w-2.5 rounded-full shadow-xs', statusDots[status])} />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
          </div>
          {timestamp && <span className="text-[10px] text-muted-foreground">{timestamp}</span>}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-xl font-bold font-mono text-foreground">
            {value} {unit && <span className="text-xs font-normal text-muted-foreground">{unit}</span>}
          </div>
          {target && <div className="text-xs text-muted-foreground">Target: {target}</div>}
        </div>

        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} variant={status === 'danger' ? 'danger' : status === 'warning' ? 'warning' : 'default'} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
