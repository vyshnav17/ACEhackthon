"use client";
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { ArrowRight, Target, BarChart, BookOpen, ChevronRight, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative bg-[#F8F9FA]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-48 pb-32">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-[#E9ECEF] shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
            Intelligence Platform v1.0
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-[#111111] uppercase">
            Quantify Your <br />
            <span className="text-brand-primary underline decoration-8 decoration-brand-primary/10">Readiness</span>
          </h1>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ADB5BD] mb-12 max-w-lg mx-auto leading-relaxed">
            AI-driven gap analysis against real-world industry benchmarks. Execute your career pivot with mathematical precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="group px-10 py-5 bg-[#111111] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 transition-all duration-300 flex items-center gap-3">
              Commence Scan <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-10 py-5 bg-white border border-[#E9ECEF] text-[#495057] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#F8F9FA] transition-all flex items-center gap-2 shadow-sm">
              Member Access
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white border-t border-[#F8F9FA]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 uppercase">
            <h2 className="text-4xl font-black text-[#111111] tracking-tighter">Architecture</h2>
            <p className="text-[10px] font-black text-[#ADB5BD] tracking-[0.3em] mt-2">Functional Modules</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F8F9FA] p-10 rounded-[2.5rem] border border-[#E9ECEF] hover:border-brand-primary/30 transition-all duration-500 group">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black mb-4 text-[#111111] uppercase tracking-tight leading-none">Gap Analysis</h3>
              <p className="text-[11px] font-bold text-[#495057] leading-relaxed uppercase tracking-wider opacity-60">
                Precision mapping of user skillsets against real-time market data to isolate technical deficits.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8F9FA] p-10 rounded-[2.5rem] border border-[#E9ECEF] hover:border-brand-primary/30 transition-all duration-500 group">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BarChart size={24} />
              </div>
              <h3 className="text-xl font-black mb-4 text-[#111111] uppercase tracking-tight leading-none">Metrics Engine</h3>
              <p className="text-[11px] font-bold text-[#495057] leading-relaxed uppercase tracking-wider opacity-60">
                Quantifiable readiness vectors providing a transparent view of current hireability index.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8F9FA] p-10 rounded-[2.5rem] border border-[#E9ECEF] hover:border-brand-primary/30 transition-all duration-500 group">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-black mb-4 text-[#111111] uppercase tracking-tight leading-none">Dynamic Path</h3>
              <p className="text-[11px] font-bold text-[#495057] leading-relaxed uppercase tracking-wider opacity-60">
                AI-curated learning trajectories designed to bridge gaps with maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
