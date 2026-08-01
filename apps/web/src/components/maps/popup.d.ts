import * as React from 'react';
interface PopupData {
    name?: string;
    title?: string;
    ward_name?: string;
    ward?: string;
    number?: number;
    capacity?: number | string;
    current_occupancy?: number;
    contact_phone?: string;
    water_depth_cm?: number;
    severity?: string;
    description?: string;
    riskCategory?: string;
    riskScore?: number;
    waterLevelCm?: number;
    surgeDepth?: number;
    population?: number;
    drainType?: string;
    status?: string;
    connectedWards?: string;
    flowDirection?: string;
    maintenanceStatus?: string;
    capacityStatus?: string;
    congestionLevel?: string;
    overflowProbability?: string;
    aiReason?: string;
    [key: string]: unknown;
}
interface PopupProps {
    type: 'shelter' | 'report' | 'riskZone' | 'drainage';
    data: PopupData;
    onClose: () => void;
}
export declare const Popup: React.FC<PopupProps>;
export {};
//# sourceMappingURL=popup.d.ts.map