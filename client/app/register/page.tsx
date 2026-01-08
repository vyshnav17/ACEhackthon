"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { name, email, password });
            if (res.token) {
                login(res.token, res.user);
            } else {
                setError(res.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="min-h-screen relative pt-24 pb-12 overflow-hidden flex items-center justify-center">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            </div>

            <Navbar />

            <div className="glass p-8 rounded-2xl w-full max-w-md relative z-10 border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary mb-4 shadow-lg shadow-brand-primary/30">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Create Account</h1>
                    <p className="text-gray-400">Join thousands of job seekers improving their skills</p>
                </div>

                {error && <div className="p-3 mb-6 text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none text-white placeholder-gray-500 transition-all"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none text-white placeholder-gray-500 transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none text-white placeholder-gray-500 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className="w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-bold shadow-lg hover:shadow-brand-primary/25 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
                        Create Account <ArrowRight size={18} />
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-400">
                            Already have an account? <Link href="/login" className="text-brand-accent hover:text-white font-medium transition-colors">Login instead</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
