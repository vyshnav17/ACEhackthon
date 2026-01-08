"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import { RoadmapView } from '../../components/RoadmapView';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function RoadmapPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/assessments/${id}`)
            .then((res: any) => {
                // If the response is the DB record, the actual AI result is in `data` field.
                // If it's a direct calc response (unlikely for GET /:id), it might be direct.
                // Based on assessments.js, it returns `result` which is `resultsDb.findById`.
                // The DB record structure is { id, userId, role, ..., data: { ...aiResult } }
                setData(res.data || res);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#E9ECEF] border-t-brand-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!data || !data.roadmap) return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center text-[#111111]">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Roadmap Not Found</h2>
            <button onClick={() => router.push('/dashboard')} className="text-brand-primary font-black uppercase tracking-widest text-sm hover:underline">Return to Dashboard</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] relative">
            <Navbar />

            <Navbar />

            <div className="container mx-auto p-6 max-w-4xl pt-28 relative z-10">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-[#ADB5BD] hover:text-[#111111] mb-8 transition-colors group font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#E9ECEF] shadow-sm">
                        <Sparkles size={12} className="text-brand-primary" /> Intelligence Report
                    </div>
                    <h1 className="text-6xl font-black text-[#111111] mb-4 uppercase tracking-tighter leading-none">Curriculum</h1>
                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-[0.3em]">Specialization: <span className="text-brand-primary">{data.role}</span></p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <RoadmapView roadmap={data.roadmap} />
                </div>
            </div>
        </div>
    );
}
