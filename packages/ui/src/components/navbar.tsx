import * as React from 'react';
import { cn } from '@floodguard/utils';
import { ShieldAlert } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';

/**
 * Storybook & Component Documentation: Navbar
 * 
 * **Purpose:** Global header topbar displaying system status, active emergency banner toggle, and user quick actions.
 * **Usage:** `<Navbar isEmergency={isEmergency} onToggleEmergency={toggleEmergency} rightActions={<UserAvatar />} />`
 * **Accessibility Notes:** Header landmark `<header>`, high-contrast emergency warning state.
 */

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  brandSub?: string;
  isEmergency?: boolean;
  onToggleEmergency?: () => void;
  rightActions?: React.ReactNode;
  leftSlot?: React.ReactNode;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({
    className,
    brandName = 'FloodGuard AI',
    brandSub = 'GVMC Command Center',
    isEmergency = false,
    onToggleEmergency,
    rightActions,
    leftSlot,
    ...props
  }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 sm:px-6 backdrop-blur-md transition-colors',
          isEmergency && 'border-red-600/50 bg-red-950/30',
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-4">
          {leftSlot}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-foreground">{brandName}</span>
              <Badge variant={isEmergency ? 'risk_critical' : 'safe'}>
                {isEmergency ? 'CRITICAL EMERGENCY' : 'SYSTEM NORMAL'}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{brandSub}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onToggleEmergency && (
            <Button
              variant={isEmergency ? 'danger' : 'outline'}
              size="sm"
              onClick={onToggleEmergency}
              leftIcon={<ShieldAlert className="h-4 w-4" />}
            >
              {isEmergency ? 'Exit Emergency Mode' : 'Emergency Mode'}
            </Button>
          )}
          {rightActions}
        </div>
      </header>
    );
  }
);
Navbar.displayName = 'Navbar';

export { Navbar };
