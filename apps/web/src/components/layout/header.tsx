import { Link } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/providers/theme-provider';

interface HeaderProps {
  showSidebarToggle?: boolean;
}

export function Header({ showSidebarToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {showSidebarToggle && (
            <button
              className="md:hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FloodGuard Logo"
              className="h-8 w-auto object-contain rounded-lg border border-slate-700/50 bg-slate-900/80 p-0.5"
            />
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
              FloodGuard AI 🌊
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#0D9488] transition-colors"
          >
            Home
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          {!showSidebarToggle && (
            <button
              className="md:hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && !showSidebarToggle && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link 
                to="/" 
                className="text-sm font-medium p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
