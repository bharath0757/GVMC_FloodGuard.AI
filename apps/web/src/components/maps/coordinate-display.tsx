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
    <div className="absolute bottom-3 left-3 z-20 flex items-center space-x-3 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 shadow-2xl backdrop-blur-md">
      <div>
        <span className="uppercase text-slate-500">Lat:</span>{' '}
        <span className="font-bold text-teal-400">{lat.toFixed(4)}° N</span>
      </div>
      <div>
        <span className="uppercase text-slate-500">Lng:</span>{' '}
        <span className="font-bold text-teal-400">{lng.toFixed(4)}° E</span>
      </div>
      <div>
        <span className="uppercase text-slate-500">Zoom:</span>{' '}
        <span className="font-bold text-slate-200">{zoom.toFixed(1)}x</span>
      </div>
      {pitch !== undefined && pitch > 0 && (
        <div>
          <span className="uppercase text-slate-500">Pitch:</span>{' '}
          <span className="font-bold text-slate-200">{pitch.toFixed(0)}°</span>
        </div>
      )}
    </div>
  );
};
