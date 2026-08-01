import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Navigation, AlertTriangle, TrendingUp, Activity, RefreshCw, Building2, ChevronRight, Target } from 'lucide-react';
import { Badge, Button } from '@floodguard/ui';
import { useAIDashboardSummary, useAIPredictRisk, useAIRecommendShelter, useAISafeRoute } from '@/hooks/use-ai-queries';
// ─────────────────────────────────────────────
// Alert Color Mappings
// ─────────────────────────────────────────────
const ALERT_BG = {
    Red: 'bg-red-500/15 border-red-500/50 text-red-300',
    Orange: 'bg-orange-500/15 border-orange-500/50 text-orange-300',
    Yellow: 'bg-amber-500/15 border-amber-500/50 text-amber-300',
    Green: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300',
};
// ─────────────────────────────────────────────
// Ward Risk Card (mini)
// ─────────────────────────────────────────────
const WardRiskCard = ({ ward, onClick }) => {
    const barPct = Math.round(ward.risk_score);
    const barColor = ward.alert_color === 'Red' ? 'bg-red-500' :
        ward.alert_color === 'Orange' ? 'bg-orange-500' :
            ward.alert_color === 'Yellow' ? 'bg-amber-500' : 'bg-emerald-500';
    return (_jsxs(motion.button, { whileHover: { scale: 1.02 }, onClick: onClick, className: `w-full text-left p-3 rounded-xl border backdrop-blur-sm transition-all ${ALERT_BG[ward.alert_color]}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-bold text-xs truncate max-w-[100px]", children: ward.ward_name }), _jsx("span", { className: "font-mono font-bold text-sm", children: ward.risk_score.toFixed(0) })] }), _jsx("div", { className: "h-1.5 bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${barColor} rounded-full transition-all`, style: { width: `${barPct}%` } }) }), _jsxs("div", { className: "flex items-center justify-between mt-1.5 text-[10px] font-mono opacity-70", children: [_jsxs("span", { children: ["\uD83C\uDF27 ", ward.rainfall_mm_hr, " mm/h"] }), _jsxs("span", { children: ["\uD83D\uDCA7 ", ward.water_level_cm, " cm"] })] })] }));
};
// ─────────────────────────────────────────────
// Prediction Detail Panel
// ─────────────────────────────────────────────
const PredictionPanel = ({ ward, onClose }) => {
    const predictMutation = useAIPredictRisk();
    const shelterMutation = useAIRecommendShelter();
    const routeMutation = useAISafeRoute();
    React.useEffect(() => {
        predictMutation.mutate({
            ward_number: ward.ward_number,
            rainfall_mm_hr: ward.rainfall_mm_hr,
            water_level_cm: ward.water_level_cm,
        });
        shelterMutation.mutate({
            user_lat: 17.6868,
            user_lng: 83.2185,
            risk_score: ward.risk_score,
            ward_risk_category: ward.risk_category,
        });
        routeMutation.mutate({
            start_ward: `w${ward.ward_number}`,
            high_risk_wards: [`w${ward.ward_number}`],
            flooded_wards: [],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ward.ward_number]);
    const pred = predictMutation.data;
    const shelter = shelterMutation.data;
    const route = routeMutation.data;
    return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, className: "flex flex-col gap-4 h-full overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-white", children: ward.ward_name }), _jsxs("span", { className: "text-xs font-mono text-slate-400", children: ["Ward #", ward.ward_number, " \u2022 Live AI Analysis"] })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white text-xl p-1", children: "\u2715" })] }), _jsxs("div", { className: `p-4 rounded-xl border ${ALERT_BG[ward.alert_color]}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-xs font-mono uppercase font-bold", children: "AI Risk Score" }), _jsx(Badge, { variant: ward.alert_color === 'Red' ? 'destructive' : 'secondary', children: ward.risk_category })] }), _jsxs("div", { className: "text-5xl font-extrabold font-mono", children: [ward.risk_score.toFixed(1), _jsx("span", { className: "text-xl text-slate-400", children: "/100" })] }), _jsxs("div", { className: "mt-2 text-xs font-mono text-slate-300", children: ["Confidence: ", (ward.confidence * 100).toFixed(1), "% \u2022 Model: ", ward.model_used] })] }), pred?.explanations && (_jsxs("div", { children: [_jsx("div", { className: "text-xs font-mono text-slate-400 uppercase mb-2 font-bold", children: "Feature Importance (SHAP)" }), _jsx("div", { className: "space-y-2", children: pred.explanations.slice(0, 4).map((exp, i) => (_jsxs("div", { className: "flex items-center justify-between text-xs font-mono", children: [_jsx("span", { className: "text-slate-300 w-40 truncate", children: exp.feature.replace(/_/g, ' ') }), _jsx("div", { className: "flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full ${exp.direction === 'increases_risk' ? 'bg-red-500' : 'bg-emerald-500'}`, style: { width: `${Math.min(100, Math.abs(exp.contribution))}%` } }) }), _jsxs("span", { className: exp.direction === 'increases_risk' ? 'text-red-400' : 'text-emerald-400', children: [exp.contribution > 0 ? '+' : '', exp.contribution.toFixed(1)] })] }, i))) })] })), pred?.recommendations && (_jsxs("div", { children: [_jsx("div", { className: "text-xs font-mono text-slate-400 uppercase mb-2 font-bold", children: "AI Recommendations" }), _jsx("div", { className: "space-y-1.5", children: pred.recommendations.map((rec, i) => (_jsx("div", { className: "text-xs text-slate-300 bg-slate-900/60 border border-slate-800 rounded-lg p-2", children: rec }, i))) })] })), shelter?.primary_shelter && (_jsxs("div", { className: "p-3 rounded-xl border border-emerald-800/50 bg-emerald-950/30", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Building2, { className: "h-4 w-4 text-emerald-400" }), _jsx("span", { className: "text-xs font-bold text-emerald-400 uppercase font-mono", children: "Recommended Shelter" })] }), _jsx("div", { className: "font-bold text-sm text-white", children: shelter.primary_shelter.name }), _jsxs("div", { className: "flex items-center justify-between mt-1 text-xs font-mono text-slate-300", children: [_jsxs("span", { children: ["\uD83D\uDCCD ", shelter.primary_shelter.distance_km, " km away"] }), _jsxs("span", { children: ["\uD83C\uDFE0 ", shelter.primary_shelter.available_capacity, " spaces free"] }), _jsxs("span", { children: ["\u23F1 ~", shelter.primary_shelter.estimated_travel_min, " min"] })] })] })), route?.primary_route && (_jsxs("div", { className: "p-3 rounded-xl border border-cyan-800/50 bg-cyan-950/30", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Navigation, { className: "h-4 w-4 text-cyan-400" }), _jsx("span", { className: "text-xs font-bold text-cyan-400 uppercase font-mono", children: "A* Safe Evacuation Route" })] }), _jsx("div", { className: "flex items-center space-x-1 text-xs font-mono text-slate-300 flex-wrap gap-1", children: route.primary_route.path.map((node, i) => (_jsxs(React.Fragment, { children: [_jsx("span", { className: "bg-slate-800 px-1.5 py-0.5 rounded", children: node }), i < route.primary_route.path.length - 1 && _jsx(ChevronRight, { className: "h-3 w-3 text-slate-500" })] }, node))) }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400", children: [_jsxs("span", { children: ["\uD83D\uDCCF ", route.primary_route.total_distance_km, " km"] }), _jsxs("span", { children: ["\u23F1 ~", route.primary_route.estimated_time_min, " min"] }), _jsxs("span", { children: ["\uD83D\uDD2C ", route.routing_algorithm] })] })] }))] }));
};
// ─────────────────────────────────────────────
// Main AI Dashboard Component
// ─────────────────────────────────────────────
export const AIDashboard = () => {
    const { data: summary, isLoading, refetch } = useAIDashboardSummary();
    const [selectedWard, setSelectedWard] = React.useState(null);
    const alertColors = {
        Red: 'text-red-400 border-red-500/50 bg-red-500/10',
        Orange: 'text-orange-400 border-orange-500/50 bg-orange-500/10',
        Yellow: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
        Green: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64 text-slate-400", children: _jsxs("div", { className: "flex flex-col items-center space-y-3", children: [_jsx(Brain, { className: "h-8 w-8 animate-pulse text-teal-400" }), _jsx("span", { className: "text-xs font-mono", children: "XGBoost Inference Engine Loading..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-xl bg-teal-500/10 border border-teal-500/30", children: _jsx(Brain, { className: "h-5 w-5 text-teal-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-lg text-white", children: "AI Flood Intelligence Engine" }), _jsx("span", { className: "text-xs font-mono text-slate-400", children: "XGBoost + A* Routing \u2022 15 Wards Active \u2022 Visakhapatnam GVMC" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("div", { className: `flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${alertColors[summary?.overall_alert_level || 'Green']}`, children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-current animate-pulse" }), _jsxs("span", { children: ["ALERT: ", summary?.overall_alert_level] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => refetch(), leftIcon: _jsx(RefreshCw, { className: "h-3.5 w-3.5" }), children: "Refresh" })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                    { label: 'Critical Wards', value: summary?.critical_wards ?? 0, icon: _jsx(AlertTriangle, { className: "h-4 w-4" }), color: 'text-red-400 bg-red-500/10 border-red-500/30' },
                    { label: 'High Risk Wards', value: summary?.high_risk_wards ?? 0, icon: _jsx(TrendingUp, { className: "h-4 w-4" }), color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
                    { label: 'Avg Risk Score', value: `${summary?.average_risk_score ?? 0}`, icon: _jsx(Target, { className: "h-4 w-4" }), color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                    { label: 'Safe Wards', value: summary?.safe_wards ?? 0, icon: _jsx(Shield, { className: "h-4 w-4" }), color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                ].map((m, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 }, className: `p-4 rounded-xl border ${m.color} flex flex-col space-y-2`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [m.icon, _jsx("span", { className: "text-2xl font-extrabold font-mono", children: m.value })] }), _jsx("span", { className: "text-xs font-mono text-slate-400", children: m.label })] }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [_jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-xs font-mono text-slate-400 uppercase font-bold", children: "Ward Risk Scores (Click to Inspect)" }), _jsx(Badge, { variant: "secondary", children: summary?.model_status })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[480px] overflow-y-auto pr-1", children: (summary?.ward_predictions ?? []).map((ward) => (_jsx(WardRiskCard, { ward: ward, onClick: () => setSelectedWard(ward) }, ward.ward_number))) })] }), _jsx("div", { className: "lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 min-h-[480px]", children: selectedWard ? (_jsx(PredictionPanel, { ward: selectedWard, onClose: () => setSelectedWard(null) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-slate-400 space-y-3", children: [_jsx(Brain, { className: "h-12 w-12 text-slate-600" }), _jsxs("span", { className: "text-sm font-mono text-center", children: ["Select a ward card to view", _jsx("br", {}), "XGBoost predictions, SHAP explanations,", _jsx("br", {}), "shelter recommendations & A* routes"] }), _jsxs("div", { className: "flex items-center space-x-1.5 text-xs font-mono text-teal-400 animate-pulse", children: [_jsx(Activity, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "AI Engine Active \u2022 15 Ward Models Running" })] })] })) })] }), summary?.top_risk_ward && (_jsxs("div", { className: `p-4 rounded-xl border ${ALERT_BG['Red']} flex items-center justify-between`, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-red-400 animate-pulse" }), _jsxs("div", { children: [_jsxs("span", { className: "font-bold text-sm text-white", children: ["Highest Risk: ", summary.top_risk_ward.ward_name, " (Ward #", summary.top_risk_ward.ward_number, ")"] }), _jsxs("div", { className: "text-xs font-mono text-red-300 mt-0.5", children: ["Risk Score: ", summary.top_risk_ward.risk_score.toFixed(1), " | \uD83C\uDF27 ", summary.top_risk_ward.rainfall_mm_hr, " mm/h | \uD83D\uDCA7 ", summary.top_risk_ward.water_level_cm, " cm"] })] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedWard(summary.top_risk_ward), children: "Inspect \u2192" })] }))] }));
};
//# sourceMappingURL=ai-dashboard.js.map