"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="container mx-auto glass rounded-2xl px-6 py-3 flex justify-between items-center transition-all duration-300">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2 group">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-shadow duration-300">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <span className="text-gradient">JobReady.AI</span>
                </Link>

                <div className="flex gap-6 items-center">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                <LayoutDashboard size={18} />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <span className="flex items-center gap-2 text-gray-400 text-sm font-medium border-l border-white/10 pl-6">
                                <User size={18} />
                                {user.name}
                            </span>
                            <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors ml-2">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
                            <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-medium text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
