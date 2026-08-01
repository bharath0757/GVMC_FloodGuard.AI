import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="flex flex-col items-center gap-4 rounded-xl bg-slate-900/90 p-8 shadow-2xl border border-slate-800"
            >
              <Loader2 className="h-12 w-12 animate-spin text-[#0D9488]" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl font-semibold text-white tracking-tight">FloodGuard AI</span>
                <span className="text-sm text-slate-400 animate-pulse">Processing request...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
