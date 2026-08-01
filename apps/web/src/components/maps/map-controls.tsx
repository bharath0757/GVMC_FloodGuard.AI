import * as React from 'react';
import { Plus, Minus, Compass, Maximize, Navigation } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetPitch: () => void;
  onToggleFullscreen: () => void;
  onGeolocate: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetPitch,
  onToggleFullscreen,
  onGeolocate,
}) => {
  return (
    <div className="absolute top-16 right-3 z-20 flex flex-col space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-md text-slate-300">
      <button
        onClick={onZoomIn}
        title="Zoom In"
        className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800/80 pb-2"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        onClick={onResetPitch}
        title="Reset Orientation"
        className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Compass className="h-4 w-4" />
      </button>
      <button
        onClick={onGeolocate}
        title="My Location"
        className="p-2 rounded-lg hover:bg-slate-800 hover:text-teal-400 transition-colors"
      >
        <Navigation className="h-4 w-4" />
      </button>
      <button
        onClick={onToggleFullscreen}
        title="Fullscreen"
        className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Maximize className="h-4 w-4" />
      </button>
    </div>
  );
};
