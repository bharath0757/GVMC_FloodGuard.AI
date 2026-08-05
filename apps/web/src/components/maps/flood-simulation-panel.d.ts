import * as React from 'react';
import type { SimulationState } from './flood-simulation-engine';
interface FloodSimPanelProps {
  state: SimulationState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (s: 0.5 | 1 | 2) => void;
  onScrub: (hour: number) => void;
  onWardClick?: (wardId: string) => void;
}
export declare const FloodSimPanel: React.FC<FloodSimPanelProps>;
export {};
//# sourceMappingURL=flood-simulation-panel.d.ts.map
