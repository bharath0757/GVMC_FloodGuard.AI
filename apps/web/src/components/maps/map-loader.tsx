import * as React from 'react';
import { Loader2 } from 'lucide-react';

export const MapLoader: React.FC = () => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-teal-400 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-xs font-mono tracking-wider font-bold">INITIALIZING GIS VECTOR MAP ENGINE...</span>
    </div>
  );
};
