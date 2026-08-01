import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, Input, Select, useToast } from '@floodguard/ui';
import { useCreateReport } from '@/hooks/use-api-queries';
import { MOCK_WARDS } from '@/data/mockData';
export const SubmitReportModal = ({ isOpen, onClose }) => {
    const createReportMutation = useCreateReport();
    const { toast } = useToast();
    const [title, setTitle] = React.useState('');
    const [wardName, setWardName] = React.useState(MOCK_WARDS[0].name);
    const [description, setDescription] = React.useState('');
    const [waterDepthCm, setWaterDepthCm] = React.useState(45);
    const [severity, setSeverity] = React.useState('High');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createReportMutation.mutateAsync({
                ward_name: wardName,
                title,
                description,
                severity,
                water_depth_cm: Number(waterDepthCm),
                lat: 17.6868,
                lng: 83.2185,
            });
            toast({
                title: 'Report Submitted to Database',
                message: 'Your crowdsourced flood report has been registered in PostgreSQL DB.',
                type: 'success',
            });
            onClose();
        }
        catch (err) {
            const errorObj = err;
            toast({
                title: 'Submission Failed',
                message: errorObj.response?.data?.detail || 'Failed to submit report.',
                type: 'error',
            });
        }
    };
    return (_jsxs(Dialog, { isOpen: isOpen, onClose: onClose, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Submit Crowdsourced Flood Incident Report" }), _jsx(DialogDescription, { children: "Report active waterlogging or hazards to the GVMC Flood Command Center database." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Report Title" }), _jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Submerged Underpass near Gajuwaka Junction", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Municipal Ward" }), _jsx(Select, { value: wardName, onChange: (e) => setWardName(e.target.value), children: MOCK_WARDS.map((w) => (_jsxs("option", { value: w.name, children: [w.name, " (Ward #", w.number, ")"] }, w.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Severity Level" }), _jsxs(Select, { value: severity, onChange: (e) => setSeverity(e.target.value), children: [_jsx("option", { value: "Low", children: "Low (Water on curbs)" }), _jsx("option", { value: "Medium", children: "Medium (Roads covered)" }), _jsx("option", { value: "High", children: "High (Knee-deep water)" }), _jsx("option", { value: "Critical", children: "Critical (Submerged vehicles)" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Estimated Water Depth (cm)" }), _jsx(Input, { type: "number", value: waterDepthCm, onChange: (e) => setWaterDepthCm(Number(e.target.value)), placeholder: "45", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Detailed Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full rounded-md border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "Provide landmark details, trapped vehicles, or power line hazards...", required: true })] }), _jsxs(DialogFooter, { className: "pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "danger", isLoading: createReportMutation.isPending, children: "Submit Report to DB" })] })] })] }));
};
//# sourceMappingURL=submit-report-modal.js.map