import * as React from 'react';
import L from 'leaflet';
import type { SimulationState } from './flood-simulation-engine';
interface FloodSimOverlayProps {
  map: L.Map | null;
  simState: SimulationState;
  active: boolean;
}
export declare const FloodSimOverlay: React.FC<FloodSimOverlayProps>;
export {};
//# sourceMappingURL=flood-simulation-overlay.d.ts.map
