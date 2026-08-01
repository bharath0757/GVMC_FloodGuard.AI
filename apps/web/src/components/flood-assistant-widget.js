import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { Button, Badge } from '@floodguard/ui';
import { useAssistantQuery, useAssistantSuggestions } from '@/hooks/use-citizen-queries';
export const FloodAssistantWidget = ({ isOpen, onClose }) => {
    const { data: suggestionsData } = useAssistantSuggestions();
    const assistantMutation = useAssistantQuery();
    const [inputQuery, setInputQuery] = React.useState('');
    const [messages, setMessages] = React.useState([
        {
            id: 'msg-welcome',
            sender: 'assistant',
            text: '👋 **Hello! I am FloodGuard AI Assistant.**\nConnected live to Visakhapatnam GVMC telemetry & XGBoost models.\n\nAsk me anything about area safety, nearest shelters, road blockages, or emergency precautions!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const messagesEndRef = React.useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    React.useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);
    const handleSend = (queryText) => {
        if (!queryText.trim() || assistantMutation.isPending)
            return;
        const userMsg = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: queryText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputQuery('');
        assistantMutation.mutate({ query: queryText }, {
            onSuccess: (data) => {
                const assistantMsg = {
                    id: `asst-${Date.now()}`,
                    sender: 'assistant',
                    text: data.response_text,
                    cards: data.cards,
                    actions: data.suggested_actions,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prev) => [...prev, assistantMsg]);
            },
            onError: () => {
                const errorMsg = {
                    id: `err-${Date.now()}`,
                    sender: 'assistant',
                    text: '⚠️ Unable to reach AI Assistant server. Please verify your connection.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prev) => [...prev, errorMsg]);
            },
        });
    };
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "w-full max-w-2xl h-[650px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden", children: [_jsxs("div", { className: "p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20", children: _jsx(Bot, { className: "h-5 w-5 text-white" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-sm text-white flex items-center gap-1.5", children: ["FloodGuard AI Assistant ", _jsx(Sparkles, { className: "h-3.5 w-3.5 text-teal-400" })] }), _jsx("span", { className: "text-[10px] font-mono text-slate-400", children: "Visakhapatnam Telemetry \u2022 XGBoost & A* Connected" })] })] }), _jsx("button", { onClick: onClose, className: "p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40", children: [messages.map((msg) => (_jsxs("div", { className: `flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`, children: [_jsx("div", { className: `max-w-[85%] rounded-2xl p-3.5 text-xs font-mono leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-teal-600 text-white rounded-tr-none'
                                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'}`, children: msg.text }), msg.cards && msg.cards.length > 0 && (_jsx("div", { className: "mt-2 w-[85%] space-y-2", children: msg.cards.map((card, idx) => {
                                            const d = card.data;
                                            return (_jsxs("div", { className: "p-3 rounded-xl border border-teal-500/30 bg-teal-950/20 text-xs font-mono", children: [_jsx("span", { className: "text-[10px] uppercase font-bold text-teal-400 block mb-1", children: card.title }), card.type === 'risk_card' && (_jsxs("div", { className: "space-y-1 text-slate-300", children: [_jsxs("div", { children: ["Score: ", _jsxs("span", { className: "font-bold text-red-400", children: [d.risk_score, "/100"] }), " (", d.risk_category, ")"] }), _jsxs("div", { children: ["Alert Level: ", _jsx(Badge, { variant: "destructive", children: d.alert_color })] })] })), card.type === 'shelter_card' && (_jsxs("div", { className: "space-y-1 text-slate-300", children: [_jsxs("div", { children: ["Primary: ", _jsx("span", { className: "font-bold text-emerald-400", children: d.primary_shelter?.name })] }), _jsxs("div", { children: ["Available: ", d.primary_shelter?.available_capacity, " free spaces"] })] }))] }, idx));
                                        }) })), msg.actions && msg.actions.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-1.5 max-w-[85%]", children: msg.actions.map((act, idx) => (_jsxs("button", { onClick: () => handleSend(act.query), className: "px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-mono border border-slate-700 transition-colors", children: [act.label, " \u2192"] }, idx))) })), _jsx("span", { className: "text-[9px] font-mono text-slate-500 mt-1 px-1", children: msg.timestamp })] }, msg.id))), assistantMutation.isPending && (_jsxs("div", { className: "flex items-center space-x-2 text-xs font-mono text-teal-400 bg-slate-900 border border-slate-800 p-3 rounded-xl w-fit", children: [_jsx(Sparkles, { className: "h-4 w-4 animate-spin" }), _jsx("span", { children: "Analysing flood telemetry & computing recommendations..." })] })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar", children: [_jsx("span", { className: "text-[10px] font-mono text-slate-400 px-2 shrink-0", children: "Quick Queries:" }), (suggestionsData?.suggestions || []).map((sugg, idx) => (_jsx("button", { onClick: () => handleSend(sugg.query), className: "shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-800 whitespace-nowrap transition-colors", children: sugg.label }, idx)))] }), _jsxs("form", { onSubmit: (e) => {
                            e.preventDefault();
                            handleSend(inputQuery);
                        }, className: "p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2", children: [_jsx("input", { type: "text", value: inputQuery, onChange: (e) => setInputQuery(e.target.value), placeholder: "Ask about flood risks, shelters, or safety...", className: "flex-1 h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500" }), _jsx(Button, { type: "submit", size: "sm", variant: "secondary", disabled: !inputQuery.trim() || assistantMutation.isPending, rightIcon: _jsx(Send, { className: "h-3.5 w-3.5" }), children: "Send" })] })] }) }) }));
};
//# sourceMappingURL=flood-assistant-widget.js.map