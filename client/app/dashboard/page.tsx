"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import SkillAssessmentForm from '../../components/SkillAssessmentForm';
import { SkillRadar } from '../../components/SkillRadar';
import { CheckCircle2, AlertCircle, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [result, setResult] = useState<any>(null);
    const [showForm, setShowForm] = useState(true);

    // Categories for radar chart
    const radarLabels = ['Technical', 'Tools', 'Soft', 'Portfolio'];

    // Helper to process result for chart
    const getChartData = () => {
        if (!result) return [0, 0, 0, 0];
        // This is a simplification.
        return [
            result.score,
            Math.min(100, result.score + 10),
            Math.min(100, result.score + 5),
            Math.min(100, result.score - 5)
        ];
    };

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen relative pb-12">

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-32 left-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <div className="container mx-auto p-6 max-w-7xl pt-24 relative z-10">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            Dashboard <span className="text-base font-normal px-3 py-1 bg-white/10 rounded-full text-brand-accent">Beta</span>
                        </h1>
                        <p className="text-gray-400">Track your career readiness & skill evolution</p>
                    </div>
                    {result && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-brand-accent font-medium transition-all"
                        >
                            + New Assessment
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Col: Actions / Input */}
                    <div className="lg:col-span-4 space-y-6">
                        {showForm ? (
                            <SkillAssessmentForm onComplete={(res) => {
                                setResult(res);
                                setShowForm(false);
                            }} />
                        ) : (
                            <div className="glass p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={100} className="text-brand-accent rotate-12" />
                                </div>
                                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-6">Current Role Analysis</h3>
                                <div className="text-3xl font-bold text-white mb-4">{result.role}</div>

                                <div className="relative inline-block mb-4">
                                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                                        {result.score}
                                    </div>
                                    <span className="text-2xl font-bold text-gray-500 absolute top-2 -right-6">%</span>
                                </div>

                                <p className="text-gray-400 text-sm">Overall Readiness Score</p>

                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                        <CheckCircle2 size={16} /> <span>Analysis Complete</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Results */}
                    <div className="lg:col-span-8 space-y-6">
                        {!result ? (
                            <div className="glass p-16 rounded-3xl border border-white/10 border-dashed text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full mb-6 animate-float">
                                    <Sparkles className="text-brand-primary" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Ready to launch your career?</h3>
                                <p className="text-gray-400 max-w-md mx-auto">Select a target job role on the left to instantly analyze your skills and get a personalized roadmap.</p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
                                {/* Charts & High Level */}
                                <div className="glass p-6 rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-white">Skill Profile Visualization</h3>
                                    </div>
                                    <div className="h-[300px] w-full flex justify-center items-center">
                                        <SkillRadar data={getChartData()} labels={radarLabels} />
                                    </div>
                                </div>

                                {/* Roadmap */}
                                <div className="glass p-8 rounded-2xl border border-white/10">
                                    <h3 className="font-bold text-2xl text-white mb-8 flex items-center gap-3">
                                        <span className="w-1 h-8 bg-brand-secondary rounded-full"></span>
                                        Personalized Roadmap
                                    </h3>
                                    <div className="relative border-l-2 border-white/10 ml-3 space-y-12 pb-4">
                                        {result.roadmap.map((module: any, idx: number) => (
                                            <div key={idx} className="ml-10 relative group">
                                                <span className="absolute -left-[51px] bg-slate-900 border-2 border-brand-primary text-brand-primary rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-shadow">
                                                    {module.module}
                                                </span>
                                                <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                    <h4 className="text-xl font-bold text-white mb-2">{module.title}</h4>
                                                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">{module.description}</p>

                                                    <ul className="space-y-3">
                                                        {module.items.map((item: string) => (
                                                            <li key={item} className="flex items-start gap-3 text-gray-300">
                                                                <ArrowRight size={16} className="mt-1 text-brand-secondary min-w-[16px]" />
                                                                <span className="font-medium text-sm">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
