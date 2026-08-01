import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, CheckCircle2, X } from 'lucide-react';
import { Button, Badge } from '@floodguard/ui';
import { useVerifyReport, useResolveReport } from '@/hooks/use-citizen-queries';
export const GovernmentVerificationModal = ({ report, isOpen, onClose }) => {
    const verifyMutation = useVerifyReport();
    const resolveMutation = useResolveReport();
    const [priority, setPriority] = React.useState('P1');
    const [notes, setNotes] = React.useState('');
    React.useEffect(() => {
        if (report) {
            setPriority(report.priority || 'P1');
            setNotes(report.internal_notes || '');
        }
    }, [report]);
    if (!isOpen || !report)
        return null;
    const handleVerify = (status) => {
        verifyMutation.mutate({
            report_id: report.id,
            status,
            priority,
            internal_notes: notes,
        }, {
            onSuccess: () => {
                onClose();
            },
        });
    };
    const handleResolve = (resolutionStatus) => {
        resolveMutation.mutate({
            report_id: report.id,
            resolution_status: resolutionStatus,
            internal_notes: notes,
        }, {
            onSuccess: () => {
                onClose();
            },
        });
    };
    return (_jsx(AnimatePresence, { children: _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(ShieldCheck, { className: "h-5 w-5 text-teal-400" }), _jsx("h3", { className: "font-bold text-sm text-white", children: "Government Authority Verification" })] }), _jsx("button", { onClick: onClose, className: "p-1 text-slate-400 hover:text-white rounded-lg", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "p-4 space-y-4 max-h-[500px] overflow-y-auto", children: [_jsxs("div", { className: "p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs font-mono", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-white text-sm", children: report.title }), _jsx(Badge, { variant: report.severity === 'Critical' ? 'destructive' : 'warning', children: report.severity })] }), _jsxs("div", { className: "text-slate-400", children: ["Ward: ", _jsx("span", { className: "text-slate-200", children: report.ward_name }), " \u2022 Reported by ", _jsx("span", { className: "text-slate-200", children: report.reporter_name })] }), _jsx("div", { className: "text-slate-300 font-sans text-xs bg-slate-900 p-2 rounded-lg", children: report.description }), _jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-400 pt-1", children: [_jsxs("span", { children: ["Water Depth: ", _jsxs("strong", { className: "text-teal-400", children: [report.water_depth_cm, " cm"] })] }), _jsxs("span", { children: ["Current Status: ", _jsx("strong", { className: "text-amber-400", children: report.status })] })] })] }), report.ai_analysis && (_jsxs("div", { className: "p-3 rounded-xl border border-teal-500/30 bg-teal-950/20 text-xs font-mono space-y-1", children: [_jsx("span", { className: "text-[10px] font-bold text-teal-400 uppercase", children: "AI Hazard Analysis" }), _jsxs("div", { className: "text-slate-300", children: ["Category: ", _jsx("strong", { children: report.ai_analysis.category })] }), _jsxs("div", { className: "text-slate-300", children: ["Suggested Priority: ", _jsx("strong", { children: report.ai_analysis.suggested_priority })] }), _jsxs("div", { className: "text-slate-300", children: ["Confidence: ", _jsxs("strong", { children: [((report.ai_confidence || 0.9) * 100).toFixed(0), "%"] })] })] })), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-mono text-slate-400 font-bold block", children: "Assign Response Priority:" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: ['P0', 'P1', 'P2', 'P3'].map((p) => (_jsxs("button", { type: "button", onClick: () => setPriority(p), className: `py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${priority === p
                                                ? p === 'P0' ? 'bg-red-500 text-white border-red-400' : 'bg-teal-500 text-white border-teal-400'
                                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`, children: [p, " ", p === 'P0' ? '(Critical)' : p === 'P1' ? '(High)' : ''] }, p))) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-mono text-slate-400 font-bold block", children: "Internal Dispatch Notes:" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "e.g. Dispatched NDRF Squad #2 with 2 water pumps...", rows: 3, className: "w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500" })] })] }), _jsxs("div", { className: "p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "danger", size: "sm", onClick: () => handleVerify('Rejected'), disabled: verifyMutation.isPending, leftIcon: _jsx(XCircle, { className: "h-3.5 w-3.5" }), children: "Reject" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleResolve('Resolved'), disabled: resolveMutation.isPending, leftIcon: _jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), children: "Mark Resolved" })] }), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => handleVerify('Verified'), disabled: verifyMutation.isPending, leftIcon: _jsx(ShieldCheck, { className: "h-3.5 w-3.5" }), children: "Verify & Issue Alert" })] })] }) }) }));
};
//# sourceMappingURL=government-verification-modal.js.map