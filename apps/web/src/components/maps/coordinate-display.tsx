import * as React from 'react';

interface CoordinateDisplayProps {
  lat: number;
  lng: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({
  lat,
  lng,
  zoom,
  pitch = 0,
}) => {
  return (
    <div className="absolute bottom-3 left-3 z-20 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-1.5 shadow-2xl backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center space-x-3">
      <div>
        <span className="text-slate-500 uppercase">Lat:</span>{' '}
        <span className="font-bold text-teal-400">{lat.toFixed(4)}° N</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase">Lng:</span>{' '}
        <span className="font-bold text-teal-400">{lng.toFixed(4)}° E</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase">Zoom:</span>{' '}
        <span className="font-bold text-slate-200">{zoom.toFixed(1)}x</span>
      </div>
      {pitch !== undefined && pitch > 0 && (
        <div>
          <span className="text-slate-500 uppercase">Pitch:</span>{' '}
          <span className="font-bold text-slate-200">{pitch.toFixed(0)}°</span>
        </div>
      )}
    </div>
  );
};
