import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MOCK_SHELTERS } from '@/data/mockData';
import { ChartContainer, Progress } from '@floodguard/ui';
export const ShelterCapacityChart = () => {
    return (_jsx(ChartContainer, { height: 260, children: _jsx("div", { className: "space-y-3 overflow-y-auto max-h-[240px] pr-1", children: MOCK_SHELTERS.map((sh) => {
                const occupancyPct = Math.round((sh.currentOccupancy / sh.capacity) * 100);
                const isFull = occupancyPct >= 90;
                return (_jsxs("div", { className: "space-y-1 p-2 rounded-lg bg-muted/40 border border-border/60", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "font-semibold text-foreground truncate max-w-[200px]", children: sh.name }), _jsxs("span", { className: "font-mono text-muted-foreground", children: [sh.currentOccupancy, " / ", sh.capacity, " (", occupancyPct, "%)"] })] }), _jsx(Progress, { value: occupancyPct, variant: isFull ? 'danger' : occupancyPct > 70 ? 'warning' : 'safe' })] }, sh.id));
            }) }) }));
};
//# sourceMappingURL=shelter-capacity-chart.js.map