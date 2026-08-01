import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChartContainer } from '@floodguard/ui';
export const IncidentReportsChart = () => {
    const categories = [
        { label: 'Blocked Drains / Overflow', count: 18, pct: 45, color: '#EF4444' },
        { label: 'Submerged Alleyways', count: 12, pct: 30, color: '#F97316' },
        { label: 'Fallen Trees & Power Lines', count: 6, pct: 15, color: '#EAB308' },
        { label: 'Stranded Citizens', count: 4, pct: 10, color: '#3B82F6' },
    ];
    return (_jsx(ChartContainer, { height: 260, children: _jsx("div", { className: "flex flex-col justify-between h-full pt-2", children: _jsx("div", { className: "space-y-3", children: categories.map((cat) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "font-medium text-foreground", children: cat.label }), _jsxs("span", { className: "font-mono text-muted-foreground", children: [cat.count, " reports (", cat.pct, "%)"] })] }), _jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all duration-500", style: { width: `${cat.pct}%`, backgroundColor: cat.color } }) })] }, cat.label))) }) }) }));
};
//# sourceMappingURL=incident-reports-chart.js.map