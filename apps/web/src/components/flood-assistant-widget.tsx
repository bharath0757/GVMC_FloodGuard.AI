import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { Button, Badge } from '@floodguard/ui';
import { useAssistantQuery, useAssistantSuggestions } from '@/hooks/use-citizen-queries';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  cards?: any[];
  actions?: Array<{ label: string; query: string }>;
  timestamp: string;
}

export const FloodAssistantWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data: suggestionsData } = useAssistantSuggestions();
  const assistantMutation = useAssistantQuery();

  const [inputQuery, setInputQuery] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: '👋 **Hello! I am FloodGuard AI Assistant.**\nConnected live to Visakhapatnam GVMC telemetry & XGBoost models.\n\nAsk me anything about area safety, nearest shelters, road blockages, or emergency precautions!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (queryText: string) => {
    if (!queryText.trim() || assistantMutation.isPending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    assistantMutation.mutate(
      { query: queryText },
      {
        onSuccess: (data) => {
          const assistantMsg: Message = {
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
          const errorMsg: Message = {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: '⚠️ Unable to reach AI Assistant server. Please verify your connection.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl h-[650px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  FloodGuard AI Assistant <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Visakhapatnam Telemetry • XGBoost & A* Connected
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-mono leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Render Cards if attached */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="mt-2 w-[85%] space-y-2">
                    {msg.cards.map((card, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-teal-500/30 bg-teal-950/20 text-xs font-mono">
                        <span className="text-[10px] uppercase font-bold text-teal-400 block mb-1">{card.title}</span>
                        {card.type === 'risk_card' && (
                          <div className="space-y-1 text-slate-300">
                            <div>Score: <span className="font-bold text-red-400">{card.data.risk_score}/100</span> ({card.data.risk_category})</div>
                            <div>Alert Level: <Badge variant="destructive">{card.data.alert_color}</Badge></div>
                          </div>
                        )}
                        {card.type === 'shelter_card' && (
                          <div className="space-y-1 text-slate-300">
                            <div>Primary: <span className="font-bold text-emerald-400">{card.data.primary_shelter?.name}</span></div>
                            <div>Available: {card.data.primary_shelter?.available_capacity} free spaces</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(act.query)}
                        className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-mono border border-slate-700 transition-colors"
                      >
                        {act.label} →
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {assistantMutation.isPending && (
              <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 bg-slate-900 border border-slate-800 p-3 rounded-xl w-fit">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Analysing flood telemetry & computing recommendations...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono text-slate-400 px-2 shrink-0">Quick Queries:</span>
            {(suggestionsData?.suggestions || []).map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sugg.query)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-800 whitespace-nowrap transition-colors"
              >
                {sugg.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about flood risks, shelters, or safety..."
              className="flex-1 h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={!inputQuery.trim() || assistantMutation.isPending}
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
