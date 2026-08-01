import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, RefreshCw, UserCheck } from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@floodguard/ui';
import { useReports } from '@/hooks/use-api-queries';
import { useAIDashboardSummary } from '@/hooks/use-ai-queries';
import { GovernmentVerificationModal } from '@/components/government-verification-modal';
export const GovernmentDashboardTab = () => {
    const { data: rawReports = [], refetch } = useReports();
    const { data: aiSummary } = useAIDashboardSummary();
    const [selectedReport, setSelectedReport] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const reports = rawReports.map((r) => ({
        id: r.id || 'rep-default',
        user_id: r.user_id || '00000000-0000-0000-0000-000000000001',
        reporter_name: r.reporter_name || 'Citizen',
        ward_name: r.ward_name || r.ward || 'Gajuwaka',
        title: r.title || 'Incident Report',
        description: r.description || 'Reported inundation',
        severity: r.severity || 'Medium',
        status: r.status || 'Pending',
        priority: r.priority || 'P2',
        resolution_status: r.resolution_status || 'Unresolved',
        water_depth_cm: r.water_depth_cm ?? 30,
        lat: r.lat ?? 17.685,
        lng: r.lng ?? 83.21,
        image_url: r.image_url,
        ai_labels: r.ai_labels || ['Waterlogging'],
        ai_confidence: r.ai_confidence ?? 0.9,
        ai_analysis: r.ai_analysis,
        internal_notes: r.internal_notes,
        verified_by: r.verified_by,
        verified_at: r.verified_at,
        upvotes: r.upvotes ?? 1,
        created_at: r.created_at || new Date().toISOString(),
    }));
    const pendingReports = reports.filter((r) => r.status === 'Pending');
    const verifiedReports = reports.filter((r) => r.status === 'Verified');
    const resolvedReports = reports.filter((r) => r.status === 'Resolved' || r.resolution_status === 'Resolved');
    const handleOpenVerify = (rep) => {
        setSelectedReport(rep);
        setModalOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(GovernmentVerificationModal, { report: selectedReport, isOpen: modalOpen, onClose: () => {
                    setModalOpen(false);
                    refetch();
                } }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-lg font-bold text-white flex items-center gap-2", children: ["GVMC Flood Emergency Command Center ", _jsx(Badge, { variant: "risk_critical", children: "OFFICER DASHBOARD" })] }), _jsx("span", { className: "text-xs font-mono text-slate-400", children: "Realtime Incident Verification \u2022 Priority Dispatch \u2022 Shelter Capacity Monitoring" })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => refetch(), leftIcon: _jsx(RefreshCw, { className: "h-3.5 w-3.5" }), children: "Refresh Queue" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-amber-400", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { className: "text-2xl font-extrabold font-mono", children: pendingReports.length })] }), _jsx("span", { className: "text-xs font-mono text-slate-300", children: "Pending Verification" })] }), _jsxs("div", { className: "p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-emerald-400", children: [_jsx(ShieldCheck, { className: "h-4 w-4" }), _jsx("span", { className: "text-2xl font-extrabold font-mono", children: verifiedReports.length })] }), _jsx("span", { className: "text-xs font-mono text-slate-300", children: "Verified & Active" })] }), _jsxs("div", { className: "p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-red-400", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx("span", { className: "text-2xl font-extrabold font-mono", children: aiSummary?.critical_wards ?? 3 })] }), _jsx("span", { className: "text-xs font-mono text-slate-300", children: "Critical Wards (P0)" })] }), _jsxs("div", { className: "p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-cyan-400", children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), _jsx("span", { className: "text-2xl font-extrabold font-mono", children: resolvedReports.length })] }), _jsx("span", { className: "text-xs font-mono text-slate-300", children: "Incidents Resolved" })] })] }), _jsxs(Card, { className: "border-slate-800 bg-slate-900/60", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-base text-white", children: "Pending Citizen Reports Verification Queue" }), _jsx("span", { className: "text-xs font-mono text-slate-400", children: "Review AI suggested priority, inspect photos, & dispatch rescue units" })] }), _jsxs(Badge, { variant: "warning", children: [pendingReports.length, " Awaiting Action"] })] }), _jsx(CardContent, { children: pendingReports.length === 0 ? (_jsx("div", { className: "p-6 text-center text-xs font-mono text-slate-400", children: "\u2705 All citizen reports verified! No pending verification requests." })) : (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "border-slate-800 text-xs font-mono", children: [_jsx(TableHead, { children: "Ward / Reporter" }), _jsx(TableHead, { children: "Incident Title" }), _jsx(TableHead, { children: "Severity" }), _jsx(TableHead, { children: "Water Depth" }), _jsx(TableHead, { children: "Suggested Priority" }), _jsx(TableHead, { className: "text-right", children: "Action" })] }) }), _jsx(TableBody, { children: pendingReports.map((rep) => (_jsxs(TableRow, { className: "border-slate-800 text-xs font-mono", children: [_jsxs(TableCell, { children: [_jsx("div", { className: "font-bold text-white", children: rep.ward_name }), _jsx("div", { className: "text-[10px] text-slate-400", children: rep.reporter_name })] }), _jsxs(TableCell, { children: [_jsx("div", { className: "text-slate-200 truncate max-w-xs", children: rep.title }), _jsx("div", { className: "text-[10px] text-slate-500 truncate max-w-xs", children: rep.description })] }), _jsx(TableCell, { children: _jsx(Badge, { variant: rep.severity === 'Critical' ? 'destructive' : 'warning', children: rep.severity }) }), _jsxs(TableCell, { className: "text-teal-400 font-bold", children: [rep.water_depth_cm, " cm"] }), _jsx(TableCell, { children: _jsx("span", { className: "px-2 py-0.5 rounded bg-slate-800 font-bold text-amber-400 border border-slate-700", children: rep.priority || 'P1' }) }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { size: "sm", variant: "secondary", onClick: () => handleOpenVerify(rep), leftIcon: _jsx(UserCheck, { className: "h-3.5 w-3.5" }), children: "Verify / Review" }) })] }, rep.id))) })] })) })] }), _jsxs(Card, { className: "border-slate-800 bg-slate-900/60", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "text-base text-white", children: ["Verified Incidents & Active Dispatches (", verifiedReports.length, ")"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: verifiedReports.map((rep) => (_jsxs("div", { className: "p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs font-mono", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-white text-sm", children: rep.title }), _jsx(Badge, { variant: "secondary", children: rep.priority })] }), _jsxs("div", { className: "text-slate-400", children: ["Ward: ", _jsx("span", { className: "text-slate-200", children: rep.ward_name }), " | Depth: ", _jsxs("span", { className: "text-teal-400", children: [rep.water_depth_cm, " cm"] })] }), rep.internal_notes && (_jsxs("div", { className: "p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-teal-300", children: ["\uD83D\uDCAC ", rep.internal_notes] })), _jsxs("div", { className: "flex items-center justify-between text-[10px] text-slate-500 pt-1", children: [_jsxs("span", { children: ["Verified by: ", rep.verified_by || 'Officer Suresh'] }), _jsx("button", { onClick: () => handleOpenVerify(rep), className: "text-teal-400 hover:underline", children: "Edit Notes / Resolve \u2192" })] })] }, rep.id))) }) })] })] }));
};
//# sourceMappingURL=government-dashboard-tab.js.map