import * as React from 'react';
interface LegendProps {
  activeLayers: {
    riskZones: boolean;
    shelters: boolean;
    reports: boolean;
    stormwaterDrainage?: boolean;
    waterFlowSim?: boolean;
    floodSimulation?: boolean;
  };
}
export declare const Legend: React.FC<LegendProps>;
export {};
//# sourceMappingURL=legend.d.ts.map
