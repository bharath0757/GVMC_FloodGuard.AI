import * as React from 'react';
import { cn } from '@floodguard/utils';
import { ShieldAlert, Clock } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  brandSub?: string;
  isEmergency?: boolean;
  onToggleEmergency?: () => void;
  rightActions?: React.ReactNode;
  leftSlot?: React.ReactNode;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      brandName = 'FloodGuard AI',
      brandSub = 'Visakhapatnam Command Center • Stage 3 Cyclone Warning',
      isEmergency = false,
      onToggleEmergency,
      rightActions,
      leftSlot,
      ...props
    },
    ref,
  ) => {
    const [currentTime, setCurrentTime] = React.useState<string>('');

    React.useEffect(() => {
      const updateClock = () => {
        const now = new Date();
        const istTimeString = now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
        });
        setCurrentTime(istTimeString + ' IST');
      };
      updateClock();
      const interval = setInterval(updateClock, 1000);
      return () => clearInterval(interval);
    }, []);

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/90 bg-slate-950/90 px-4 shadow-xl backdrop-blur-xl transition-all sm:px-6',
          isEmergency && 'border-red-600/60 bg-red-950/40 shadow-red-950/50',
          className,
        )}
        {...props}
      >
        <div className="flex items-center space-x-4">
          {leftSlot}
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-base font-extrabold tracking-tight text-white">
                  {brandName}
                </span>
                <Badge
                  variant={isEmergency ? 'risk_critical' : 'safe'}
                  className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                >
                  <span className="mr-1 h-1.5 w-1.5 animate-ping rounded-full bg-current" />
                  {isEmergency ? 'CRITICAL EMERGENCY' : 'SYSTEM OPERATIONAL'}
                </Badge>
              </div>
              <span className="hidden font-mono text-[11px] text-slate-400 sm:block">
                {brandSub}
              </span>
            </div>
          </div>
        </div>

        {/* Center Live Clock */}
        <div className="hidden items-center space-x-2 rounded-md border border-slate-800 bg-slate-900/90 px-3 py-1 font-mono text-xs text-cyan-300 lg:flex">
          <Clock className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
          <span>{currentTime || '18:20:00 IST'}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">GVMC EOC-1</span>
        </div>

        <div className="flex items-center space-x-3">
          {onToggleEmergency && (
            <Button
              variant={isEmergency ? 'danger' : 'outline'}
              size="sm"
              onClick={onToggleEmergency}
              className="font-mono text-xs"
              leftIcon={<ShieldAlert className="h-4 w-4" />}
            >
              {isEmergency ? 'Exit Crisis Mode' : 'Emergency Override'}
            </Button>
          )}
          {rightActions}
        </div>
      </header>
    );
  },
);
Navbar.displayName = 'Navbar';

export { Navbar };
