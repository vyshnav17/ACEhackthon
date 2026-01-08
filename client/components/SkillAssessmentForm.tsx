"use client";
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Check, ChevronDown, Briefcase, FileText, Upload, X } from 'lucide-react';

export default function SkillAssessmentForm({ onComplete }: { onComplete: (result: any) => void }) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [skillsMap, setSkillsMap] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Resume State
    const [mode, setMode] = useState<'manual' | 'resume'>('manual');
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    useEffect(() => {
        api.get('/jobs').then(data => setJobs(data));
    }, []);

    const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const job = jobs.find(j => j.id === e.target.value);
        setSelectedJob(job);
        setSkillsMap({});
    };

    const handleSkillToggle = (skillName: string) => {
        setSkillsMap(prev => ({ ...prev, [skillName]: !prev[skillName] }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let result;

            if (mode === 'resume' && resumeFile) {
                // Resume Upload Flow
                const formData = new FormData();
                formData.append('resume', resumeFile);
                if (selectedJob) formData.append('jobRole', selectedJob.title);

                // Use fetch directly for FormData to avoid header issues in wrapper
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/assessments/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }, // Add auth if needed
                    body: formData
                });
                result = await res.json();

                if (!res.ok) throw new Error(result.message || result.error || 'Upload failed');

            } else {
                // Manual Checkbox Flow
                const selectedSkills = Object.keys(skillsMap).filter(k => skillsMap[k]);
                result = await api.post('/assessments/calculate', {
                    roleId: selectedJob?.id,
                    skills: selectedSkills,
                    userId: user?.id
                });
            }

            onComplete(result);
        } catch (err: any) {
            console.error(err);
            alert(`Analysis Failed: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[40px] pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="text-brand-accent" /> Start New Assessment
                </h2>

                {/* Mode Switcher */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setMode('manual')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'manual' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Manual Check
                    </button>
                    <button
                        onClick={() => setMode('resume')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'resume' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Upload Resume
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Target Job Role (Optional)</label>
                <div className="relative">
                    <select
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none text-white appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                        onChange={handleJobSelect}
                        defaultValue=""
                    >
                        <option value="" className="bg-slate-900 text-gray-400">General Analysis (No specific role)</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id} className="bg-slate-900 text-white">{job.title}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* RESUME UPLOAD MODE */}
            {mode === 'resume' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors group cursor-pointer relative">
                        <input
                            type="file"
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                {resumeFile ? <FileText className="text-brand-primary" size={32} /> : <Upload className="text-brand-primary" size={32} />}
                            </div>
                            <div>
                                {resumeFile ? (
                                    <>
                                        <p className="font-bold text-white text-lg">{resumeFile.name}</p>
                                        <p className="text-sm text-green-400 mt-1">Ready to analyze</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-white text-lg">Drop your resume here</p>
                                        <p className="text-gray-400 text-sm mt-1">Supports PDF or TXT (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !resumeFile}
                        className="mt-8 w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-brand-primary/25 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing with Groq AI...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Analyze Resume Impact <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* MANUAL MODE */}
            {mode === 'manual' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    {!selectedJob ? (
                        <div className="text-center p-8 text-gray-500">
                            Please select a job role above to verify your skills manually.
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold mb-4 text-brand-primary">Verify your skills:</h3>
                            <div className="space-y-6">
                                {['Technical', 'Tools', 'Soft', 'Portfolio'].map(cat => (
                                    <div key={cat} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">{cat}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedJob.skills.filter((s: any) => s.category === cat).map((s: any) => (
                                                <label key={s.name} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${skillsMap[s.name] ? 'bg-brand-primary/20 border-brand-primary/30' : 'hover:bg-white/5 border-transparent'}`}>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${skillsMap[s.name] ? 'bg-brand-primary text-white' : 'bg-white/10 text-transparent'}`}>
                                                        <Check size={14} />
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!skillsMap[s.name]}
                                                        onChange={() => handleSkillToggle(s.name)}
                                                        className="hidden" // Hiding default checkbox
                                                    />
                                                    <span className="text-sm text-gray-200 select-none">{s.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="mt-8 w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-brand-primary/25 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Calculating Score...
                                    </span>
                                ) : 'Generate Compatibility Report'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
