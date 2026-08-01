import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Play, Pause, RotateCcw, Gauge, ChevronDown, ChevronUp, Brain, AlertTriangle } from 'lucide-react';
import { buildAIPanel } from './flood-simulation-engine';
function formatHour(h) {
    const hh = Math.floor(h);
    const mm = Math.floor((h - hh) * 60);
    return `T+${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
function fillColor(level) {
    if (level < 0.15)
        return 'text-green-400';
    if (level < 0.40)
        return 'text-yellow-400';
    if (level < 0.65)
        return 'text-orange-400';
    return 'text-red-400';
}
function fillBg(level) {
    if (level < 0.15)
        return 'bg-green-500';
    if (level < 0.40)
        return 'bg-yellow-400';
    if (level < 0.65)
        return 'bg-orange-500';
    return 'bg-red-500';
}
export const FloodSimPanel = ({ state, onPlay, onPause, onReset, onSpeedChange, onScrub, }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const ai = buildAIPanel(state);
    const progressPct = (state.currentHour / state.totalHours) * 100;
    const wardList = Object.values(state.wards)
        .sort((a, b) => b.fillLevel - a.fillLevel);
    return (_jsxs("div", { className: "absolute bottom-3 left-3 z-30 w-80 rounded-2xl border border-blue-900 bg-slate-950/97 shadow-2xl backdrop-blur-xl text-xs font-mono text-slate-200 select-none overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-3 py-2 bg-blue-950/60 border-b border-blue-900", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-2 w-2 rounded-full bg-blue-400 animate-pulse" }), _jsx("span", { className: "font-bold text-[11px] text-blue-300 uppercase tracking-wide", children: "Dynamic Flood Flow Simulation" })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "text-[9px] text-slate-500 font-sans italic", children: "AI-Assisted \u00B7 Not validated" }), _jsx("button", { onClick: () => setCollapsed(!collapsed), className: "text-slate-400 hover:text-white p-0.5", children: collapsed ? _jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : _jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })] })] }), !collapsed && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "px-3 pt-2.5 pb-2 border-b border-slate-800 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [state.isPlaying ? (_jsxs("button", { onClick: onPause, className: "flex items-center gap-1 rounded-lg bg-blue-900/50 border border-blue-800 px-2 py-1 text-blue-300 hover:bg-blue-900 transition-colors", children: [_jsx(Pause, { className: "h-3 w-3" }), " Pause"] })) : (_jsxs("button", { onClick: onPlay, className: "flex items-center gap-1 rounded-lg bg-blue-600/80 border border-blue-500 px-2 py-1 text-white hover:bg-blue-500 transition-colors", children: [_jsx(Play, { className: "h-3 w-3" }), " Play"] })), _jsxs("button", { onClick: onReset, className: "flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white transition-colors", children: [_jsx(RotateCcw, { className: "h-3 w-3" }), " Reset"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Gauge, { className: "h-3 w-3 text-slate-500" }), [0.5, 1, 2].map((s) => (_jsxs("button", { onClick: () => onSpeedChange(s), className: `px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${state.speed === s
                                                    ? 'bg-blue-600 border-blue-400 text-white'
                                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`, children: [s, "x"] }, s)))] })] }), _jsxs("div", { className: "space-y-0.5", children: [_jsxs("div", { className: "flex justify-between text-[9px] text-slate-500", children: [_jsx("span", { children: "T+00:00" }), _jsx("span", { className: "text-blue-400 font-bold", children: formatHour(state.currentHour) }), _jsxs("span", { children: ["T+", state.totalHours, ":00"] })] }), _jsx("input", { type: "range", min: 0, max: state.totalHours, step: 0.1, value: state.currentHour, onChange: (e) => onScrub(Number(e.target.value)), className: "w-full h-1.5 appearance-none rounded-full bg-slate-800 accent-blue-500 cursor-pointer" }), _jsx("div", { className: "h-1 w-full bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300", style: { width: `${progressPct}%` } }) })] }), _jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [_jsx("span", { className: "text-slate-500", children: "Rainfall Intensity:" }), _jsxs("span", { className: "text-red-400 font-bold", children: [state.rainfallIntensityMmHr, " mm/hr \u2014 \uD83C\uDF27\uFE0F RED ALERT"] })] })] }), _jsxs("div", { className: "px-3 py-2 border-b border-slate-800 space-y-1.5", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-teal-400 uppercase mb-1", children: [_jsx(Brain, { className: "h-3 w-3" }), "AI Simulation Summary"] }), [
                                { label: 'Flow Direction', value: ai.flowDirection, color: 'text-cyan-400' },
                                { label: 'Blocked Drains', value: ai.blockedDrains, color: 'text-amber-400' },
                                { label: 'Affected Wards', value: ai.affectedWards, color: 'text-orange-400' },
                                { label: 'Time to Overflow', value: ai.timeToOverflow, color: 'text-red-400' },
                                { label: 'Primary Cause', value: ai.primaryCause, color: 'text-slate-300' },
                            ].map(({ label, value, color }) => (_jsxs("div", { className: "text-[10px]", children: [_jsxs("span", { className: "text-slate-500", children: [label, ": "] }), _jsx("span", { className: `${color} font-bold`, children: value })] }, label))), _jsxs("div", { className: "mt-1.5 rounded-lg bg-slate-900 border border-slate-700 p-2 text-[10px] font-sans leading-snug", children: [_jsx("span", { className: "text-teal-400 font-bold font-mono block mb-0.5", children: "Recommended Action" }), _jsx("span", { className: "text-slate-300", children: ai.recommendation })] }), _jsxs("div", { className: "text-[9px] text-slate-600 italic", children: ["Confidence: ", ai.confidence] })] }), _jsxs("div", { className: "px-3 py-2 max-h-40 overflow-y-auto", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: [_jsx(AlertTriangle, { className: "h-3 w-3" }), "Ward Inundation Status"] }), _jsx("div", { className: "space-y-1", children: wardList.map((ward) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: `text-[10px] truncate w-28 ${fillColor(ward.fillLevel)}`, children: ward.name }), _jsxs("div", { className: "flex items-center gap-1.5 flex-1 ml-1", children: [_jsx("div", { className: "flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${fillBg(ward.fillLevel)}`, style: { width: `${Math.round(ward.fillLevel * 100)}%` } }) }), _jsxs("span", { className: `text-[9px] w-10 text-right font-bold ${fillColor(ward.fillLevel)}`, children: [ward.waterDepthCm, "cm"] }), ward.drainBlocked && (_jsx("span", { className: "text-[8px] text-red-400 font-bold", children: "\u26D4" }))] })] }, ward.wardId))) })] }), _jsx("div", { className: "px-3 py-1.5 bg-slate-900/60 border-t border-slate-800", children: _jsx("p", { className: "text-[8.5px] text-slate-600 italic font-sans leading-tight", children: "\u26A0\uFE0F AI-assisted visualization for decision support only. Not a validated hydraulic model. Do not use as a substitute for professional hydrodynamic modelling." }) })] }))] }));
};
//# sourceMappingURL=flood-simulation-panel.js.map