import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@floodguard/utils';
import { Check } from 'lucide-react';

/**
 * Storybook & Component Documentation: Progress Components (Progress, RadialProgress, MultiStepProgress)
 * 
 * **Purpose:** Display evacuation capacity, sensor battery levels, model confidence scores, or multi-step wizard progress.
 * **Usage:** 
 * - `<Progress value={75} variant="danger" />`
 * - `<RadialProgress value={85} size={60} strokeWidth={6} />`
 * - `<MultiStepProgress steps={['Report', 'Verification', 'Dispatch']} currentStep={1} />`
 * **Accessibility Notes:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
 */

const progressVariants = cva('h-full w-full flex-1 transition-all duration-500 ease-out', {
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      danger: 'bg-red-500',
      warning: 'bg-amber-500',
      safe: 'bg-emerald-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number; // 0 to 100
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, variant, showLabel = false, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(clampedValue)}%</span>
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
          {...props}
        >
          <div
            className={cn(progressVariants({ variant }))}
            style={{ transform: `translateX(-${100 - clampedValue}%)` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export interface RadialProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'secondary' | 'danger' | 'warning' | 'safe';
  className?: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  size = 48,
  strokeWidth = 4,
  variant = 'default',
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const strokeColors = {
    default: 'stroke-primary',
    secondary: 'stroke-secondary',
    danger: 'stroke-red-500',
    warning: 'stroke-amber-500',
    safe: 'stroke-emerald-500',
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn('transition-all duration-500 ease-out', strokeColors[variant])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-[10px] font-bold font-mono">{Math.round(clampedValue)}%</span>
    </div>
  );
};

export interface MultiStepProgressProps {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
}

const MultiStepProgress: React.FC<MultiStepProgressProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn('w-full flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center space-y-1">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  isCompleted && 'bg-safe text-white',
                  isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-xs text-center font-medium max-w-[80px] truncate',
                  isCurrent ? 'text-foreground font-bold' : 'text-muted-foreground'
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mb-5 transition-all',
                  index < currentStep ? 'bg-safe' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export { Progress, RadialProgress, MultiStepProgress };
