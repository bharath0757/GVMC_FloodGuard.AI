import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, Input, Select, useToast } from '@floodguard/ui';
import { useAuth } from '@/context/auth-context';
export const AuthModal = ({ isOpen, onClose }) => {
    const { login, register, isLoading } = useAuth();
    const { toast } = useToast();
    const [mode, setMode] = React.useState('login');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [role, setRole] = React.useState('citizen');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'login') {
                await login(email, password);
                toast({
                    title: 'Authentication Successful',
                    message: 'Logged in to FloodGuard AI Command Platform.',
                    type: 'success',
                });
            }
            else {
                await register(email, password, fullName, role);
                toast({
                    title: 'Account Created',
                    message: `Registered new ${role} account successfully.`,
                    type: 'success',
                });
            }
            onClose();
        }
        catch (err) {
            const errorObj = err;
            toast({
                title: 'Authentication Failed',
                message: errorObj.response?.data?.detail || 'Invalid credentials or request error.',
                type: 'error',
            });
        }
    };
    return (_jsxs(Dialog, { isOpen: isOpen, onClose: onClose, children: [_jsxs(DialogHeader, { children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("img", { src: "/logo.png", alt: "FloodGuard Logo", className: "h-10 w-auto object-contain rounded-lg border border-slate-700 bg-slate-900 p-1 shrink-0" }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-base font-bold", children: mode === 'login' ? 'Sign In to FloodGuard AI' : 'Register Citizen / Officer Account' }), _jsx("span", { className: "text-[10px] font-mono text-teal-400 block uppercase", children: "GVMC Visakhapatnam \u2022 Predictive Data Platform" })] })] }), _jsx(DialogDescription, { children: mode === 'login'
                            ? 'Enter your credentials to access live flood telemetry and emergency dispatch.'
                            : 'Create an account to submit crowdsourced flood reports and track risk advisories.' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [mode === 'register' && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Full Name" }), _jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "e.g. Ramesh Varma", required: true })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Email Address" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "name@example.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), mode === 'register' && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Account Role" }), _jsxs(Select, { value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "citizen", children: "Citizen User" }), _jsx("option", { value: "government", children: "Government Authority / Officer" })] })] })), _jsxs(DialogFooter, { className: "pt-4 flex items-center justify-between", children: [_jsx("button", { type: "button", onClick: () => setMode(mode === 'login' ? 'register' : 'login'), className: "text-xs text-teal-400 hover:underline", children: mode === 'login' ? "Don't have an account? Register" : 'Already registered? Login' }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", isLoading: isLoading, children: mode === 'login' ? 'Sign In' : 'Create Account' })] })] })] })] }));
};
//# sourceMappingURL=auth-modal.js.map