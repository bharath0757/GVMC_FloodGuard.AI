import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Layers, Check, Eye } from 'lucide-react';
import { Badge } from '@floodguard/ui';
export const LayerManager = ({ layers, onToggleLayer }) => {
    const [open, setOpen] = React.useState(false);
    const activeCount = Object.values(layers).filter(Boolean).length;
    return (_jsxs("div", { className: "absolute top-3 left-3 z-20", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-xs font-mono text-slate-200 shadow-2xl backdrop-blur-md hover:bg-slate-900 transition-colors", children: [_jsx(Layers, { className: "h-4 w-4 text-teal-400" }), _jsx("span", { className: "font-bold", children: "Map Layers" }), _jsx(Badge, { variant: "secondary", className: "px-1.5 py-0 text-[10px]", children: activeCount })] }), open && (_jsxs("div", { className: "mt-2 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-md text-xs font-mono space-y-2 text-slate-200", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-slate-400 font-bold text-[10px] uppercase", children: [_jsx("span", { children: "ACTIVE OVERLAYS" }), _jsx(Eye, { className: "h-3 w-3" })] }), [
                        { key: 'riskZones', label: '☑ Flood Risk Zones', color: 'bg-red-500' },
                        { key: 'shelters', label: '☑ Relief Shelters', color: 'bg-emerald-500' },
                        { key: 'reports', label: '☑ Citizen Reports', color: 'bg-amber-500' },
                        { key: 'stormwaterDrainage', label: '☑ Road & Underground Drains', color: 'bg-blue-500' },
                        { key: 'floodSimulation', label: '🌊 Dynamic Flood Flow', color: 'bg-blue-600' },
                        { key: 'radar', label: 'Radar Sweep Animation', color: 'bg-teal-400' },
                    ].map((item) => {
                        const isActive = layers[item.key];
                        return (_jsxs("button", { onClick: () => onToggleLayer(item.key), className: `w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${isActive
                                ? 'border-slate-700 bg-slate-900 text-white'
                                : 'border-slate-900 bg-slate-950/40 text-slate-500 hover:text-slate-300'}`, children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: `h-2.5 w-2.5 rounded-full ${item.color}` }), _jsx("span", { className: "text-[11px] font-bold", children: item.label })] }), isActive && _jsx(Check, { className: "h-3.5 w-3.5 text-teal-400" })] }, item.key));
                    })] }))] }));
};
//# sourceMappingURL=layer-manager.js.map