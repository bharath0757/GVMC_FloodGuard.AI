import * as React from 'react';
import { cn } from '@floodguard/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Storybook & Component Documentation: Sidebar Navigation
 * 
 * **Purpose:** Persistent vertical navigation panel for government officers, emergency responders, and administrators.
 * **Usage:** `<Sidebar collapsed={collapsed} onToggle={toggle}><SidebarNav><SidebarNavItem icon={<Map />} label="Live Flood Map" active /></SidebarNav></Sidebar>`
 * **Accessibility Notes:** `<nav aria-label="Main Navigation">`, full keyboard tab support.
 */

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  brandLogo?: React.ReactNode;
  brandName?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, onToggleCollapse, brandLogo, brandName = 'FloodGuard AI', children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'relative flex flex-col h-screen border-r border-border bg-card text-card-foreground transition-all duration-300 select-none z-30',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/60">
          <div className="flex items-center space-x-3 overflow-hidden">
            {brandLogo ? (
              <div className="shrink-0">{brandLogo}</div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                F
              </div>
            )}
            {!collapsed && (
              <span className="font-bold text-base tracking-tight text-foreground truncate">{brandName}</span>
            )}
          </div>
          {onToggleCollapse && !collapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content / Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">{children}</div>

        {/* Footer / Toggle when collapsed */}
        {onToggleCollapse && collapsed && (
          <div className="p-3 border-t border-border/60 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarNav: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <nav className={cn('space-y-1', className)} {...props} />
);

export interface SidebarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
  collapsed?: boolean;
}

const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ className, icon, label, active = false, badge, collapsed = false, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
          active
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          collapsed && 'justify-center px-0',
          className
        )}
        title={collapsed ? label : undefined}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {!collapsed && <span className="truncate flex-1">{label}</span>}
        {!collapsed && badge && <span className="shrink-0">{badge}</span>}
      </a>
    );
  }
);
SidebarNavItem.displayName = 'SidebarNavItem';

const SidebarSectionTitle: React.FC<{ title: string; collapsed?: boolean }> = ({ title, collapsed }) => {
  if (collapsed) return null;
  return (
    <div className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
      {title}
    </div>
  );
};

export { Sidebar, SidebarNav, SidebarNavItem, SidebarSectionTitle };
