import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MOCK_RAINFALL_SERIES } from '@/data/mockData';
import { ChartContainer } from '@floodguard/ui';
export const RainfallChart = () => {
    const maxRainfall = 80;
    return (_jsx(ChartContainer, { height: 260, children: _jsxs("div", { className: "flex flex-col h-full justify-between pt-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground mb-2", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-primary inline-block" }), _jsx("span", { children: "Observed Rainfall (mm)" })] }), _jsxs("span", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-cyan-400 border border-cyan-300 inline-block" }), _jsx("span", { children: "TFT Forecast Horizon (mm)" })] })] }), _jsx("span", { className: "font-mono text-[10px] bg-muted px-2 py-0.5 rounded", children: "TFT Model v2.4" })] }), _jsx("div", { className: "relative flex-1 w-full flex items-end justify-between gap-2 border-b border-l border-border/80 px-2 pb-1", children: MOCK_RAINFALL_SERIES.map((pt, i) => {
                        const val = pt.actualRainfall !== null ? pt.actualRainfall : pt.predictedRainfall;
                        const heightPct = Math.min(100, Math.max(10, (val / maxRainfall) * 100));
                        const isForecast = pt.actualRainfall === null;
                        return (_jsxs("div", { className: "flex-1 flex flex-col items-center group relative h-full justify-end", children: [_jsxs("div", { className: "absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-1.5 rounded shadow-lg z-20 pointer-events-none font-mono whitespace-nowrap", children: [pt.time, ": ", val, " mm", isForecast && ' (AI Prediction)'] }), _jsx("div", { className: `w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${isForecast
                                        ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 border-t border-cyan-200 animate-pulse opacity-90'
                                        : 'bg-gradient-to-t from-primary/80 to-primary'}`, style: { height: `${heightPct}%` } }), _jsx("span", { className: "text-[9px] font-mono text-muted-foreground mt-2 truncate w-full text-center", children: pt.time.split(' ')[0] })] }, i));
                    }) })] }) }));
};
//# sourceMappingURL=rainfall-chart.js.map