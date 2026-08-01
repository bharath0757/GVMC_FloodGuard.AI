import * as React from 'react';
import { MapContainer } from './maps';

export interface MapPlaceholderProps {
  className?: string;
  height?: string;
  selectedWardId?: string;
  onSelectWard?: (wardId: string) => void;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  className,
  height = '520px',
  selectedWardId = 'w14',
  onSelectWard,
}) => {
  return (
    <div className={className}>
      <MapContainer selectedWardId={selectedWardId} onSelectWard={onSelectWard} height={height} />
    </div>
  );
};
