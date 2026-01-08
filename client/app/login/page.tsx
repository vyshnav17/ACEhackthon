"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.token) {
                login(res.token, res.user);
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="min-h-screen relative pt-24 pb-12 bg-[#F8F9FA] flex items-center justify-center">
            <Navbar />

            <div className="bg-white p-10 rounded-3xl w-full max-w-md relative z-10 border border-[#E9ECEF] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-3 text-[#111111] uppercase tracking-tighter">Enter</h1>
                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-[0.3em]">Access Command Center</p>
                </div>

                {error && <div className="p-4 mb-8 text-red-600 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-center uppercase tracking-widest leading-relaxed">System: {error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-[#111111] mb-2 uppercase tracking-widest">Email Identity</label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full px-5 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none text-[#111111] placeholder-[#ADB5BD] font-bold text-sm transition-all"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-black text-[#111111] uppercase tracking-widest">Passcode</label>
                            <a href="#" className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Reset</a>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                className="w-full px-5 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none text-[#111111] placeholder-[#ADB5BD] font-bold text-sm transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className="w-full py-4 bg-[#111111] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2">
                        Verify <ArrowRight size={16} />
                    </button>

                    <div className="text-center mt-10">
                        <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest">
                            New Applicant? <Link href="/register" className="text-brand-primary hover:underline">Apply Now</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
