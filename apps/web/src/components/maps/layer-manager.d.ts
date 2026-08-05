import * as React from 'react';
interface LayerManagerProps {
  layers: {
    riskZones: boolean;
    shelters: boolean;
    reports: boolean;
    radar: boolean;
    stormwaterDrainage: boolean;
    floodSimulation: boolean;
  };
  onToggleLayer: (layerKey: keyof LayerManagerProps['layers']) => void;
}
export declare const LayerManager: React.FC<LayerManagerProps>;
export {};
//# sourceMappingURL=layer-manager.d.ts.map
