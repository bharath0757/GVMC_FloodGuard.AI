import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { useMediaQuery } from '@/hooks/use-media-query';

type LayoutVariant = 'default' | 'dashboard' | 'minimal';

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within Layout');
  return context;
};

interface RootLayoutProps {
  variant?: LayoutVariant;
}

export function RootLayout({ variant = 'default' }: RootLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const layoutContextValue = {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  };

  if (variant === 'minimal') {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
        <Outlet />
      </main>
    );
  }

  const isDashboard = variant === 'dashboard';

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
        <Header showSidebarToggle={isDashboard} />

        <div className="flex flex-1 overflow-hidden">
          {isDashboard && (
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
          )}

          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Outlet />
            </main>
            {variant === 'default' && <Footer />}
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
