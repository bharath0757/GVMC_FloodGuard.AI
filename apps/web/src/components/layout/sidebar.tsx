import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Map,
  BarChart3,
} from 'lucide-react';
import { cn } from '@floodguard/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/' },
  { label: 'Map View', icon: Map, path: '/map' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile && !isOpen) return null;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isOpen ? 256 : 64,
        x: isMobile && !isOpen ? -256 : 0,
      }}
      className={cn(
        'z-30 flex flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        isMobile
          ? 'fixed inset-y-0 left-0 h-full pt-16'
          : 'relative h-[calc(100vh-4rem)]',
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive && 'text-[#0D9488]',
                  )}
                />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>

      {!isMobile && (
        <div className="border-t border-slate-200 p-2 dark:border-slate-800">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </motion.aside>
  );
}
