import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { Button, Badge } from '@floodguard/ui';
import {
  useAssistantQuery,
  useAssistantSuggestions,
} from '@/hooks/use-citizen-queries';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  cards?: Array<{ type: string; title: string; data: Record<string, unknown> }>;
  actions?: Array<{ label: string; query: string }>;
  timestamp: string;
}

export const FloodAssistantWidget: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { data: suggestionsData } = useAssistantSuggestions();
  const assistantMutation = useAssistantQuery();

  const [inputQuery, setInputQuery] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: '👋 **Hello! I am FloodGuard AI Assistant.**\nConnected live to Visakhapatnam GVMC telemetry & XGBoost models.\n\nAsk me anything about area safety, nearest shelters, road blockages, or emergency precautions!',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
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
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
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
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        },
        onError: () => {
          const errorMsg: Message = {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: '⚠️ Unable to reach AI Assistant server. Please verify your connection.',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="flex h-[650px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-white">
                  FloodGuard AI Assistant{' '}
                  <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  Visakhapatnam Telemetry • XGBoost & A* Connected
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-950/40 p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 font-mono text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'rounded-tr-none bg-teal-600 text-white'
                      : 'whitespace-pre-line rounded-tl-none border border-slate-800 bg-slate-900 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Render Cards if attached */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="mt-2 w-[85%] space-y-2">
                    {msg.cards.map((card, idx) => {
                      const d = card.data as {
                        risk_score?: number;
                        risk_category?: string;
                        alert_color?: string;
                        primary_shelter?: {
                          name?: string;
                          available_capacity?: number;
                        };
                      };
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-3 font-mono text-xs"
                        >
                          <span className="mb-1 block text-[10px] font-bold uppercase text-teal-400">
                            {card.title}
                          </span>
                          {card.type === 'risk_card' && (
                            <div className="space-y-1 text-slate-300">
                              <div>
                                Score:{' '}
                                <span className="font-bold text-red-400">
                                  {d.risk_score}/100
                                </span>{' '}
                                ({d.risk_category})
                              </div>
                              <div>
                                Alert Level:{' '}
                                <Badge variant="destructive">
                                  {d.alert_color}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {card.type === 'shelter_card' && (
                            <div className="space-y-1 text-slate-300">
                              <div>
                                Primary:{' '}
                                <span className="font-bold text-emerald-400">
                                  {d.primary_shelter?.name}
                                </span>
                              </div>
                              <div>
                                Available:{' '}
                                {d.primary_shelter?.available_capacity} free
                                spaces
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex max-w-[85%] flex-wrap gap-1.5">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(act.query)}
                        className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-[10px] text-teal-300 transition-colors hover:bg-slate-700"
                      >
                        {act.label} →
                      </button>
                    ))}
                  </div>
                )}

                <span className="mt-1 px-1 font-mono text-[9px] text-slate-500">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {assistantMutation.isPending && (
              <div className="flex w-fit items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-teal-400">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>
                  Analysing flood telemetry & computing recommendations...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-t border-slate-800 bg-slate-950 p-2">
            <span className="shrink-0 px-2 font-mono text-[10px] text-slate-400">
              Quick Queries:
            </span>
            {(suggestionsData?.suggestions || []).map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sugg.query)}
                className="shrink-0 whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[10px] text-slate-300 transition-colors hover:bg-slate-800"
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
            className="flex items-center space-x-2 border-t border-slate-800 bg-slate-900 p-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about flood risks, shelters, or safety..."
              className="h-10 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
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
