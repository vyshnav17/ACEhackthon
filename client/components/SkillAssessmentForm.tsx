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
    const [customRole, setCustomRole] = useState('');
    const [isCustomRole, setIsCustomRole] = useState(false);

    useEffect(() => {
        api.get('/jobs').then(data => setJobs(data));
    }, []);

    const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'custom') {
            setSelectedJob(null);
            setIsCustomRole(true);
            setSkillsMap({});
        } else {
            const job = jobs.find(j => j.id === value);
            setSelectedJob(job);
            setIsCustomRole(false);
            setCustomRole('');
            setSkillsMap({});
        }
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
                if (isCustomRole && customRole) {
                    formData.append('jobRole', customRole);
                } else if (selectedJob) {
                    formData.append('jobRole', selectedJob.title);
                }
                if (user?.id) formData.append('userId', user.id);

                // Use fetch directly for FormData to avoid header issues in wrapper
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/assessments/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }, // Add auth if needed
                    body: formData
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Upload failed raw:", errorText);
                    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
                }

                result = await res.json();

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
        <div className="bento-card p-8 h-full">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-[#111111] flex items-center gap-3 tracking-tighter uppercase">
                        Analysis
                    </h2>
                    <p className="text-[#495057] mt-1 font-medium">Define your target trajectory.</p>
                </div>

                {/* Modern Toggle */}
                <div className="flex bento-gray p-1 rounded-xl border self-start">
                    <button
                        onClick={() => setMode('manual')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'manual' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#ADB5BD] hover:text-[#495057]'}`}
                    >
                        Manual
                    </button>
                    <button
                        onClick={() => setMode('resume')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'resume' ? 'bg-brand-primary text-white shadow-md' : 'text-[#ADB5BD] hover:text-[#495057]'}`}
                    >
                        Resume
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <label className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest block mb-2">Target Role</label>
                <div className="space-y-4">
                    <div className="relative group/select">
                        <select
                            className="w-full p-4 pl-5 pr-16 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-[#111111] appearance-none cursor-pointer transition-all hover:bg-[#EEF2F7] text-lg font-bold tracking-tight"
                            onChange={handleJobSelect}
                            value={isCustomRole ? 'custom' : (selectedJob?.id || "")}
                        >
                            <option value="" className="text-[#ADB5BD]">General Analysis (AI Decides)</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                            <option value="custom" className="font-bold">✨ Type Custom Role...</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#ADB5BD] group-hover/select:text-[#111111] transition-colors">
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {/* Custom Role Input */}
                    {isCustomRole && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <input
                                type="text"
                                placeholder="e.g. Graphic Designer, Chef..."
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                className="w-full p-4 bg-white border-2 border-brand-primary rounded-xl outline-none text-[#111111] placeholder-[#ADB5BD] font-bold"
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* RESUME UPLOAD MODE */}
            {mode === 'resume' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bento-indigo border rounded-2xl p-10 text-center hover:border-brand-primary transition-all group cursor-pointer relative">
                        <input
                            type="file"
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E9ECEF] group-hover:scale-105 transition-transform duration-300">
                                {resumeFile ? <FileText className="text-green-600" size={24} /> : <Upload className="text-brand-primary" size={24} />}
                            </div>
                            <div className="space-y-1">
                                {resumeFile ? (
                                    <>
                                        <p className="font-bold text-[#111111]">{resumeFile.name}</p>
                                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Ready to analyze</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-[#111111]">Select Resume</p>
                                        <p className="text-[#ADB5BD] text-xs">PDF or TXT (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !resumeFile}
                        className="mt-8 w-full py-5 bg-[#111111] text-white rounded-xl font-black text-lg hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Now'}
                    </button>
                </div>
            )}

            {/* MANUAL MODE */}
            {mode === 'manual' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    {!selectedJob ? (
                        <div className="text-center p-12 text-[#ADB5BD] bg-[#F8F9FA] rounded-2xl border border-[#E9ECEF] border-dashed">
                            <p className="font-bold text-sm">Select a role to verify skills manually.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-sm font-black mb-6 text-[#111111] uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-4 bg-brand-primary rounded-full" />
                                Skill Verification
                            </h3>
                            <div className="space-y-4">
                                {['Technical', 'Tools', 'Soft', 'Portfolio'].map(cat => (
                                    <div key={cat} className="p-4 rounded-xl border bento-blue">
                                        <h4 className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-4">{cat}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedJob.skills.filter((s: any) => s.category === cat).map((s: any) => (
                                                <label key={s.name} className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all border ${skillsMap[s.name] ? 'bg-brand-primary/5 border-brand-primary/20' : 'bg-[#F8F9FA] border-transparent hover:border-[#E9ECEF]'}`}>
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${skillsMap[s.name] ? 'bg-brand-primary text-white' : 'bg-white border border-[#DEE2E6]'}`}>
                                                        {skillsMap[s.name] && <Check size={10} strokeWidth={4} />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!skillsMap[s.name]}
                                                        onChange={() => handleSkillToggle(s.name)}
                                                        className="hidden"
                                                    />
                                                    <span className={`text-xs font-bold ${skillsMap[s.name] ? 'text-[#111111]' : 'text-[#495057]'}`}>{s.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="mt-8 w-full py-5 bg-[#111111] text-white rounded-xl font-black text-lg hover:bg-black transition-all disabled:opacity-30"
                            >
                                {loading ? 'Processing...' : 'Generate Report'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
