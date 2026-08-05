import * as React from 'react';
import { cn } from '@floodguard/utils';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { Card, CardContent } from './card';

export interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'safe';
  sparklineData?: number[];
  lastUpdated?: string;
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
  sparklineData = [12, 18, 25, 22, 35, 42, 50, 48, 62, 70],
  lastUpdated = 'Just now',
  className,
}) => {
  const variantStyles = {
    default: 'border-slate-800 bg-slate-900/80 hover:border-slate-700',
    danger:
      'border-red-500/40 bg-gradient-to-br from-red-950/30 to-slate-900/90 hover:border-red-500/60 glow-red',
    warning:
      'border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-slate-900/90 hover:border-amber-500/60 glow-amber',
    safe: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-slate-900/90 hover:border-emerald-500/60',
  };

  const sparklineColor =
    variant === 'danger'
      ? '#ef4444'
      : variant === 'warning'
        ? '#f59e0b'
        : variant === 'safe'
          ? '#10b981'
          : '#06b6d4';

  return (
    <Card
      className={cn(
        'overflow-hidden shadow-xl backdrop-blur-md transition-all duration-200',
        variantStyles[variant],
        className,
      )}
    >
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          {icon && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="font-mono text-2xl font-black tracking-tight text-white">
            {value}
          </div>
          {trend && (
            <div
              className={cn(
                'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold',
                trendDirection === 'up' &&
                  'border-emerald-500/40 bg-emerald-950/60 text-emerald-400',
                trendDirection === 'down' &&
                  'border-red-500/40 bg-red-950/60 text-red-400',
                trendDirection === 'neutral' &&
                  'border-slate-800 bg-slate-900 text-slate-400',
              )}
            >
              {trendDirection === 'up' && (
                <TrendingUp className="mr-1 h-3 w-3" />
              )}
              {trendDirection === 'down' && (
                <TrendingDown className="mr-1 h-3 w-3 text-red-400" />
              )}
              {trendDirection === 'neutral' && (
                <Minus className="mr-1 h-3 w-3" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* Sparkline & Subtitle Row */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-1 font-mono text-[10px] text-slate-400">
          <span className="max-w-[170px] truncate">{subtitle}</span>
          <div className="flex shrink-0 items-center space-x-1">
            <svg className="h-5 w-16 overflow-visible" viewBox="0 0 100 30">
              <path
                d={`M 0 ${30 - sparklineData[0] * 0.4} L ${sparklineData
                  .map(
                    (d, i) =>
                      `${(i / (sparklineData.length - 1)) * 100} ${30 - d * 0.4}`,
                  )
                  .join(' L ')}`}
                fill="none"
                stroke={sparklineColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5 font-mono text-[9px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5 text-slate-500" /> Synced:{' '}
            {lastUpdated}
          </span>
          <span className="text-cyan-400/80">● LIVE DB</span>
        </div>
      </CardContent>
    </Card>
  );
};
