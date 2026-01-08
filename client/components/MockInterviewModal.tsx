import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Cpu, Sparkles, MessageSquare } from 'lucide-react';

interface MockInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobRole: string;
    resumeSummary?: string; // Optional context
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    feedback?: string;
    rating?: number;
}

export default function MockInterviewModal({ isOpen, onClose, jobRole, resumeSummary }: MockInterviewModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            startInterview();
        }
    }, [isOpen]);

    const startInterview = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: [],
                    context: { role: jobRole, resumeSummary: resumeSummary || "Candidate" }
                })
            });
            const data = await res.json();
            setMessages([{ role: 'assistant', content: data.message }]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            // Prepare history for AI (exclude local feedback/ratings)
            const cleanHistory = messages.concat({ role: 'user', content: userMsg }).map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('http://localhost:5000/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: cleanHistory,
                    context: { role: jobRole, resumeSummary }
                })
            });

            const data = await res.json();

            // Add Feedback Message (if any) then the Question
            if (data.feedback) {
                // We merge feedback into the previous user message implicitly in UI or add strictly
                // ideally, we want to show feedback RIGHT AFTER user message. 
                // Currently just appending AI response which might contain both is cleaner in logic, 
                // but let's store it in the assistant message for display card.
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message,
                feedback: data.feedback,
                rating: data.rating
            }]);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl h-[650px] rounded-3xl border border-[#E9ECEF] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-[#F8F9FA] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#111111] rounded-2xl flex items-center justify-center text-white shadow-sm">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#111111] uppercase tracking-tighter">AI Interviewer</h3>
                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">{jobRole}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-xl transition-colors text-[#ADB5BD] hover:text-[#111111]">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8F9FA]/30">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-[10px] uppercase ${msg.role === 'assistant' ? 'bg-[#111111] text-white' : 'bg-brand-primary text-white shadow-sm'}`}>
                                {msg.role === 'assistant' ? 'AI' : 'YOU'}
                            </div>

                            <div className={`flex flex-col gap-2 max-w-[85%]`}>
                                {/* FEEDBACK CARD */}
                                {msg.role === 'assistant' && msg.feedback && (
                                    <div className="bg-white border border-[#E9ECEF] p-4 rounded-2xl shadow-sm mb-2 animate-in slide-in-from-top-1 duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                <Sparkles size={12} />
                                                <span>Performance Match</span>
                                            </div>
                                            <span className="text-lg font-black text-[#111111]">{msg.rating}/10</span>
                                        </div>
                                        <p className="text-xs text-[#495057] font-medium leading-relaxed">{msg.feedback}</p>
                                    </div>
                                )}

                                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] ${msg.role === 'user'
                                    ? 'bg-[#111111] text-white rounded-tr-none'
                                    : 'bg-white text-[#111111] border border-[#E9ECEF] rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl flex items-center justify-center text-[#ADB5BD]">
                                <Cpu size={16} className="animate-spin" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#E9ECEF] flex items-center gap-2 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-[#F8F9FA]">
                    <div className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="State your answer with precision..."
                            className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl py-4 pl-6 pr-14 text-[#111111] font-bold text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 disabled:opacity-30 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
