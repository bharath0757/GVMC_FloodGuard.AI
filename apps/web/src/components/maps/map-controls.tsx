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
    <div className="absolute right-3 top-16 z-20 flex flex-col space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/90 p-1.5 text-slate-300 shadow-2xl backdrop-blur-md">
      <button
        onClick={onZoomIn}
        title="Zoom In"
        className="rounded-lg p-2 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        className="rounded-lg border-b border-slate-800/80 p-2 pb-2 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        onClick={onResetPitch}
        title="Reset Orientation"
        className="rounded-lg p-2 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <Compass className="h-4 w-4" />
      </button>
      <button
        onClick={onGeolocate}
        title="My Location"
        className="rounded-lg p-2 transition-colors hover:bg-slate-800 hover:text-teal-400"
      >
        <Navigation className="h-4 w-4" />
      </button>
      <button
        onClick={onToggleFullscreen}
        title="Fullscreen"
        className="rounded-lg p-2 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <Maximize className="h-4 w-4" />
      </button>
    </div>
  );
};
