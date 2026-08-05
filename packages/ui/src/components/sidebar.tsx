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
  (
    {
      className,
      collapsed = false,
      onToggleCollapse,
      brandLogo,
      brandName = 'FloodGuard AI',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'relative z-30 flex h-screen shrink-0 select-none flex-col border-r border-slate-800/90 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur-xl transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            {brandLogo ? (
              <div className="shrink-0">{brandLogo}</div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-lg font-extrabold text-white shadow-md">
                F
              </div>
            )}
            {!collapsed && (
              <div className="truncate">
                <span className="block text-base font-extrabold tracking-tight text-white">
                  {brandName}
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                  EOC Operations
                </span>
              </div>
            )}
          </div>
          {onToggleCollapse && !collapsed && (
            <button
              onClick={onToggleCollapse}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content / Nav */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {children}
        </div>

        {/* Footer / Toggle when collapsed */}
        {onToggleCollapse && collapsed && (
          <div className="flex justify-center border-t border-slate-800 p-3">
            <button
              onClick={onToggleCollapse}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    );
  },
);
Sidebar.displayName = 'Sidebar';

const SidebarNav: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  ...props
}) => <nav className={cn('space-y-1.5', className)} {...props} />;

export interface SidebarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
  collapsed?: boolean;
}

const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  (
    {
      className,
      icon,
      label,
      active = false,
      badge,
      collapsed = false,
      ...props
    },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          'flex cursor-pointer items-center space-x-3 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-150',
          active
            ? 'border-cyan-500/50 bg-cyan-950/70 font-bold text-cyan-300 text-white shadow-lg shadow-cyan-950/50'
            : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/80 hover:text-white',
          collapsed && 'justify-center px-0',
          className,
        )}
        title={collapsed ? label : undefined}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'shrink-0',
              active ? 'text-cyan-400' : 'text-slate-400',
            )}
          >
            {icon}
          </span>
        )}
        {!collapsed && (
          <span className="flex-1 truncate font-sans">{label}</span>
        )}
        {!collapsed && badge && <span className="shrink-0">{badge}</span>}
      </a>
    );
  },
);
SidebarNavItem.displayName = 'SidebarNavItem';

const SidebarSectionTitle: React.FC<{ title: string; collapsed?: boolean }> = ({
  title,
  collapsed,
}) => {
  if (collapsed) return null;
  return (
    <div className="px-3 pb-1.5 pt-4 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
      {title}
    </div>
  );
};

export { Sidebar, SidebarNav, SidebarNavItem, SidebarSectionTitle };
