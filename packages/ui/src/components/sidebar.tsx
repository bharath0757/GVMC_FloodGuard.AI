import * as React from 'react';
import { cn } from '@floodguard/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
          'relative flex flex-col h-screen border-r border-slate-800/90 bg-slate-950/95 text-slate-100 transition-all duration-300 select-none z-30 shadow-2xl backdrop-blur-xl shrink-0',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 overflow-hidden">
            {brandLogo ? (
              <div className="shrink-0">{brandLogo}</div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-md">
                F
              </div>
            )}
            {!collapsed && (
              <div className="truncate">
                <span className="font-extrabold text-base tracking-tight text-white block">
                  {brandName}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono block tracking-wider uppercase">
                  EOC Operations
                </span>
              </div>
            )}
          </div>
          {onToggleCollapse && !collapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
          <div className="p-3 border-t border-slate-800 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
  <nav className={cn('space-y-1.5', className)} {...props} />
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
          'flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 cursor-pointer border',
          active
            ? 'bg-cyan-950/70 border-cyan-500/50 text-white font-bold shadow-lg shadow-cyan-950/50 text-cyan-300'
            : 'border-transparent text-slate-400 hover:bg-slate-900/80 hover:text-white hover:border-slate-800',
          collapsed && 'justify-center px-0',
          className
        )}
        title={collapsed ? label : undefined}
        {...props}
      >
        {icon && <span className={cn('shrink-0', active ? 'text-cyan-400' : 'text-slate-400')}>{icon}</span>}
        {!collapsed && <span className="truncate flex-1 font-sans">{label}</span>}
        {!collapsed && badge && <span className="shrink-0">{badge}</span>}
      </a>
    );
  }
);
SidebarNavItem.displayName = 'SidebarNavItem';

const SidebarSectionTitle: React.FC<{ title: string; collapsed?: boolean }> = ({ title, collapsed }) => {
  if (collapsed) return null;
  return (
    <div className="px-3 pt-4 pb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">
      {title}
    </div>
  );
};

export { Sidebar, SidebarNav, SidebarNavItem, SidebarSectionTitle };

