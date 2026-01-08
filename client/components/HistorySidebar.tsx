import React, { useEffect, useState } from 'react';
import { History, ChevronRight, Calculator, FileText, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface HistoryItem {
    id: string;
    role: string; // or roleId
    date: string;
    score: number;
    type?: string;
    data?: any; // Full result
}

interface Props {
    onSelect: (result: any) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const HistorySidebar: React.FC<Props> = ({ onSelect, isOpen, onClose }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user?.id) {
            setLoading(true);
            api.get(`/assessments/history/${user.id}`)
                .then(data => {
                    // Sort by date desc
                    const sorted = (data as any[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setHistory(sorted);
                })
                .catch(err => console.error("Failed to load history", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user?.id]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-[#E9ECEF] shadow-2xl z-50 transform transition-transform duration-300 animate-in slide-in-from-right">
            <div className="p-6 border-b border-[#F8F9FA] flex justify-between items-center">
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-brand-primary" />
                    Archive
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-xl text-[#ADB5BD] hover:text-[#111111] transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] space-y-3">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        No previous assessments found.
                    </div>
                ) : (
                    history.map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.data) onSelect(item.data);
                                else alert("Legacy data format - cannot reload full report.");
                            }}
                            className="group p-4 rounded-xl border border-[#E9ECEF] hover:border-brand-primary/40 bg-white hover:bg-[#F8F9FA] transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-xs font-black text-[#111111] uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                                    {item.role || 'General Assessment'}
                                </div>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.score >= 70 ? 'bg-green-50 text-green-700' : 'bg-brand-primary/5 text-brand-primary'}`}>
                                    {item.score}%
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest">
                                {item.type === 'resume_analysis' ? <FileText size={10} /> : <Calculator size={10} />}
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                <ChevronRight size={14} className="text-brand-primary" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
