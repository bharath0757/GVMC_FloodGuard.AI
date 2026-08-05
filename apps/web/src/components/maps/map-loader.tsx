import * as React from 'react';
import { Loader2 } from 'lucide-react';

export const MapLoader: React.FC = () => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center space-y-3 bg-slate-950/80 text-teal-400 backdrop-blur-md">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="font-mono text-xs font-bold tracking-wider">
        INITIALIZING GIS VECTOR MAP ENGINE...
      </span>
    </div>
  );
};
