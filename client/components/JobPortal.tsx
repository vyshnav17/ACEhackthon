import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary_range: string;
    posted_time: string;
    match_score: number;
    matching_skills: string[];
    missing_skills: string[];
    reason: string;
}

interface Props {
    role: string;
    skills: string[];
}

export const JobPortal: React.FC<Props> = ({ role, skills }) => {
    const [location, setLocation] = useState('Bengaluru, India');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        console.log("JobPortal: Searching for", { role, location, skills });
        if (!role) {
            setError("Role is missing. Please analyze a resume first.");
            return;
        }
        setLoading(true);
        setSearched(true);
        setError(null);
        try {
            const res = await api.post('/jobs', { role, location, skills });
            console.log("JobPortal Response:", res);

            // Fix: res is the data object itself (from api.ts res.json())
            if (res && res.jobs) {
                setJobs(res.jobs);
            } else if (res && res.error) {
                setError(res.error);
            } else {
                setJobs([]); // No jobs found case
            }
        } catch (error: any) {
            console.error("Failed to fetch jobs", error);
            setError(error.message || "Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-search on mount if role exists
    useEffect(() => {
        if (role && !searched) {
            handleSearch();
        }
    }, [role]);

    const handleApply = (job: Job) => {
        // Construct deep link to Google Jobs
        const query = `${job.title} ${job.company} ${job.location} jobs`;
        const url = `https://www.google.com/search?ibp=htl;jobs&q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E9ECEF] flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="flex-1 w-full relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ADB5BD]" size={18} />
                    <input
                        type="text"
                        value={role}
                        readOnly
                        className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl py-3 pl-12 pr-4 text-[#495057] font-bold text-sm cursor-not-allowed"
                    />
                </div>
                <div className="flex-1 w-full relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-primary" size={18} />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location..."
                        className="w-full bg-white border border-[#E9ECEF] rounded-xl py-3 pl-12 pr-4 text-[#111111] font-bold text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-[#111111] hover:bg-black text-white rounded-xl font-black text-sm transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Search size={16} />}
                    Scan
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bento-card p-6 flex flex-col md:flex-row gap-6 relative group">

                        {/* Match Score Badge */}
                        <div className="bento-gray px-3 py-1.5 rounded-lg font-black text-[10px] flex items-center gap-2 uppercase tracking-widest text-[#495057] self-start border md:absolute md:top-6 md:right-6">
                            Match Score:
                            <span className={job.match_score > 80 ? "text-green-600" : "text-brand-primary"}>{job.match_score}%</span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 flex-1">
                            {/* Logo Placeholder */}
                            <div className="w-16 h-16 rounded-2xl bento-gray border flex items-center justify-center text-xl font-black text-[#ADB5BD] uppercase shrink-0">
                                {job.company.substring(0, 2)}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-black text-[#111111] mb-1 group-hover:text-brand-primary transition-colors tracking-tight uppercase">{job.title}</h3>
                                <div className="text-[11px] font-bold text-[#495057] mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 uppercase tracking-wider">
                                    <span className="text-[#111111]">{job.company}</span>
                                    <span className="w-1 h-1 bg-[#DEE2E6] rounded-full"></span>
                                    <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                                    <span className="w-1 h-1 bg-[#DEE2E6] rounded-full"></span>
                                    <span className="text-brand-primary">{job.salary_range}</span>
                                    <span className="w-1 h-1 bg-[#DEE2E6] rounded-full"></span>
                                    <span className="text-[#ADB5BD]">{job.posted_time}</span>
                                </div>

                                {/* Skills Analysis */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.matching_skills.slice(0, 3).map((s, i) => (
                                        <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-black uppercase tracking-widest border border-green-100">
                                            <CheckCircle size={10} /> {s}
                                        </span>
                                    ))}
                                    {job.missing_skills.length > 0 && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-red-100">
                                            <AlertCircle size={10} /> {job.missing_skills[0]}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-[#495057] font-bold leading-relaxed bento-emerald p-4 rounded-xl border border-l-4 border-l-brand-primary">
                                    {job.reason}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={() => handleApply(job)}
                                    className="w-full md:w-auto px-8 py-3 bg-[#F8F9FA] hover:bg-[#111111] hover:text-white border border-[#E9ECEF] rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Apply
                                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
