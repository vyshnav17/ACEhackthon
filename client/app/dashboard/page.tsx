"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import SkillAssessmentForm from '../../components/SkillAssessmentForm';
import { SkillRadar } from '../../components/SkillRadar';
import MockInterviewModal from '../../components/MockInterviewModal';
import { CheckCircle2, AlertCircle, ArrowRight, Trophy, Sparkles, Youtube, ExternalLink, Copy, Download, TrendingUp, Map, LayoutDashboard, User, LogOut, History as HistoryIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { useReactToPrint } from 'react-to-print';
import { ResumeTemplate } from '../../components/ResumeTemplate';
import { MarketPulse } from '../../components/MarketPulse';
import { JobPortal } from '../../components/JobPortal';
import { HistorySidebar } from '../../components/HistorySidebar';
import { History } from 'lucide-react';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [result, setResult] = useState<any>(null);
    const [showForm, setShowForm] = useState(true);
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [greeting, setGreeting] = useState('');

    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Optimized_Resume_${result?.role || 'JobReady'}`,
    });

    // Dynamic Greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    // Helper for circular progress
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = result ? circumference - (result.score / 100) * circumference : circumference;

    const radarLabels = ['Technical', 'Tools', 'Soft', 'Portfolio'];
    const getChartData = () => {
        if (!result) return [0, 0, 0, 0];

        // Use Real AI Scores
        if (result.skill_scores) {
            return [
                result.skill_scores.technical || 50,
                result.skill_scores.tools || 50,
                result.skill_scores.soft || 50,
                result.skill_scores.portfolio || 50
            ];
        }

        return [result.score, Math.min(100, result.score + 10), Math.min(100, result.score + 5), Math.min(100, result.score - 5)];
    };

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={20} className="text-brand-accent animate-pulse" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background relative pt-24 pb-12 overflow-hidden selection:bg-brand-primary selection:text-white">
            <Navbar />

            <main className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h1 className="text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-2">
                            DASHBOARD
                        </h1>
                        <p className="text-[#495057] font-medium text-lg">
                            Elevating your career trajectory with precision AI.
                        </p>
                    </div>

                    <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="px-4 py-3 bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#E9ECEF] rounded-xl text-[#495057] font-medium transition-all flex items-center gap-2"
                        >
                            <History size={18} />
                        </button>

                        {result && !showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="group px-6 py-3 bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#E9ECEF] rounded-xl text-[#495057] font-medium transition-all flex items-center gap-2"
                            >
                                <Sparkles size={18} className="text-brand-accent group-hover:rotate-12 transition-transform" />
                                New Assessment
                            </button>
                        )}
                    </div>
                </div>

                <HistorySidebar
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                    onSelect={(res) => {
                        setResult(res);
                        setShowForm(false);
                        setShowHistory(false);
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Input or Score Card */}
                    <div className="lg:col-span-4 space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        {showForm ? (
                            <div className="bento-card bento-blue bento-card-hover p-8 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Sparkles size={120} />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/10">
                                            <TrendingUp size={12} /> Live Analysis
                                        </div>
                                        <h2 className="text-3xl font-black text-[#111111] mb-4 tracking-tight leading-none uppercase">
                                            Resume Tailor
                                        </h2>
                                        <p className="text-[#495057] mb-8 leading-relaxed max-w-md">
                                            Optimize your professional profile for specific industry requirements using our high-precision AI engine.
                                        </p>
                                    </div>
                                    <SkillAssessmentForm onComplete={(res) => {
                                        setResult(res);
                                        setShowForm(false);
                                    }} />
                                </div>
                            </div>
                        ) : (
                            <div className="bento-card bento-card-hover p-8 relative overflow-hidden group h-full">
                                {/* Score Circle */}
                                <div className="flex flex-col items-center justify-center py-8 relative">
                                    <div className="relative w-48 h-48">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#E9ECEF]" />
                                            <circle
                                                cx="96" cy="96" r={radius}
                                                stroke="currentColor" strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={progressOffset}
                                                strokeLinecap="round"
                                                className="text-brand-primary transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black text-[#111111]">{result.score}</span>
                                            <span className="text-xs text-brand-primary uppercase tracking-wider font-bold mt-1">Ready</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-[#111111] mt-6 mb-1 text-center">{result.role}</h3>
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-100 px-3 py-1 rounded-full border border-green-200">
                                        <CheckCircle2 size={14} /> Analysis Complete
                                    </div>
                                </div>

                                <div className="space-y-4 mt-4">
                                    <button
                                        onClick={() => setIsInterviewOpen(true)}
                                        className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-white font-bold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <Trophy className="group-hover/btn:animate-bounce" size={20} />
                                        Start Mock Interview
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Skill Radar Mini-View */}
                        {result && !showForm && (
                            <div className="bento-card p-6 rounded-3xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <h4 className="font-bold text-[#ADB5BD] text-xs uppercase tracking-widest mb-4">Skill Balancer</h4>
                                <div className="h-[200px] w-full flex justify-center">
                                    <SkillRadar data={getChartData()} labels={radarLabels} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Content Feed */}
                    <div className="lg:col-span-8 space-y-6">
                        {!result ? (
                            <div className="bento-gray p-12 rounded-3xl border-dashed border-2 flex flex-col items-center justify-center text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <Sparkles className="text-brand-primary" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111111] mb-2">Awaiting Assessment</h3>
                                <p className="text-[#495057] max-w-md">Select your target role on the left to activate the AI analysis engine.</p>
                            </div>
                        ) : (
                            <>
                                {/* Market Ticker */}
                                {result.market_analysis && (
                                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                        <MarketPulse data={result.market_analysis} role={result.role} />
                                    </div>
                                )}

                                {/* Job Portal */}
                                {result.role && (
                                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Recommended Jobs</h2>
                                            <span className="text-[10px] font-bold text-[#495057] bg-[#E9ECEF] px-2 py-1 rounded border border-[#DEE2E6] uppercase tracking-widest">AI Curated</span>
                                        </div>
                                        <JobPortal role={result.role} skills={result.skills_found || []} />
                                    </div>
                                )}

                                {/* Resume Tailor */}
                                {result.tailoring && (
                                    <div className="bento-card p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <h3 className="font-black text-2xl text-[#111111] flex items-center gap-3 uppercase tracking-tight">
                                                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                                                    <Sparkles size={20} />
                                                </div>
                                                Resume Smart-Tailor
                                            </h3>
                                            <div className="flex gap-2">
                                                {result.tailoring.full_resume_data && (
                                                    <button onClick={() => handlePrint()} className="px-4 py-2 bg-[#F8F9FA] hover:bg-[#E9ECEF] rounded-lg text-sm text-[#495057] font-bold border border-[#E9ECEF] transition-all flex items-center gap-2">
                                                        <Download size={14} /> PDF
                                                    </button>
                                                )}
                                                <button onClick={() => navigator.clipboard.writeText(result.tailoring.optimized_summary)} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                                    <Copy size={14} /> Copy
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest pl-1">Original Summary</div>
                                                <div className="p-5 rounded-xl bento-gray border text-[#495057] text-sm italic leading-relaxed h-full">
                                                    "{result.tailoring.current_summary}"
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest pl-1 flex items-center gap-2">
                                                    ATS Optimized
                                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] uppercase font-bold">High Match</span>
                                                </div>
                                                <div className="p-5 rounded-xl bg-white border border-brand-primary/20 text-[#111111] text-sm leading-relaxed h-full relative overflow-hidden">
                                                    "{result.tailoring.optimized_summary}"
                                                </div>
                                            </div>
                                        </div>

                                        {result.tailoring.full_resume_data && (
                                            <div style={{ display: 'none' }}>
                                                <ResumeTemplate ref={componentRef} data={result.tailoring.full_resume_data} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Roadmap Link Card */}
                                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                                    <div className="bento-card bento-card-hover p-10 relative overflow-hidden ring-1 ring-brand-primary/10 bg-gradient-to-br from-white to-[#F8F9FA]">
                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="text-center md:text-left">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                                    Strategy Ready
                                                </div>
                                                <h4 className="text-3xl font-black text-[#111111] mb-2 tracking-tight uppercase leading-none">Your Career Path <br />is Optimized</h4>
                                                <p className="text-[#495057] max-w-lg font-medium">
                                                    We've engineered a step-by-step learning trajectory tailored to your identified skill gaps.
                                                </p>
                                            </div>
                                            <a
                                                href={`/roadmap?id=${result.id}`}
                                                className="px-8 py-4 bg-[#111111] text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-black/10 group/rd"
                                            >
                                                Launch Roadmap <ArrowRight size={20} className="group-hover/rd:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <MockInterviewModal
                                    isOpen={isInterviewOpen}
                                    onClose={() => setIsInterviewOpen(false)}
                                    jobRole={result?.role || 'Software Engineer'}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
