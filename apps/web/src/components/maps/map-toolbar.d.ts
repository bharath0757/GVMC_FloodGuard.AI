import * as React from 'react';
interface MapToolbarProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    selectedStyle: string;
    onStyleChange: (s: string) => void;
    severityFilter: string;
    onSeverityFilterChange: (f: string) => void;
    onSearchSelect: (q: string) => void;
}
export declare const MapToolbar: React.FC<MapToolbarProps>;
export {};
//# sourceMappingURL=map-toolbar.d.ts.map