"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="container mx-auto bg-white/80 backdrop-blur-md border border-[#E9ECEF] rounded-xl px-6 py-4 flex justify-between items-center shadow-sm">
                <Link href="/" className="text-xl font-black flex items-center gap-2 group tracking-tighter">
                    <div className="bg-brand-primary p-2 rounded-lg">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <span className="text-[#111111]">JOBREADY.AI</span>
                </Link>

                <div className="flex gap-6 items-center">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-2 text-[#495057] hover:text-[#111111] transition-colors font-semibold text-sm">
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <span className="flex items-center gap-2 text-[#ADB5BD] text-sm font-medium border-l border-[#E9ECEF] pl-6">
                                <User size={18} />
                                {user.name}
                            </span>
                            <button onClick={logout} className="flex items-center gap-2 text-[#ADB5BD] hover:text-red-500 transition-colors ml-2">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-[#495057] hover:text-[#111111] transition-colors">Login</Link>
                            <Link href="/register" className="px-6 py-2.5 bg-[#111111] text-white rounded-lg font-bold text-sm hover:bg-black transition-all">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
