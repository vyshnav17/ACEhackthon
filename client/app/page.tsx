"use client";
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { ArrowRight, Target, BarChart, BookOpen, ChevronRight, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      {/* Hero */}
      <section className="relative pt-40 pb-32">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-primary/30 mb-8 animate-float">
            <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-xs font-medium text-brand-accent tracking-wider uppercase">Hackathon Ready v1.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
            Bridge the Gap to <br />
            <span className="text-gradient">Your</span> <span className="relative inline-block">
              <span className="text-gradient">Dream Job</span>
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-secondary opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Leverage AI to analyze your skills against real industry standards. Detect gaps, get a readiness score, and receive a personalized roadmap to hireability.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/register" className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3">
              Get Your Store <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-4 glass text-gray-200 rounded-xl font-bold text-lg hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" /> Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why <span className="text-gradient">JobReady.AI?</span></h2>
            <p className="text-gray-400">Advanced analysis for career acceleration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-all duration-500 border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <Target className="text-brand-primary w-24 h-24 -mr-8 -mt-8 rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              <div className="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">Skill Gap Detection</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Compare your skills against thousands of job descriptions (JDs) to pinpoint exactly what you're missing for your target role.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-all duration-500 border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <BarChart className="text-brand-secondary w-24 h-24 -mr-8 -mt-8 rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              <div className="w-14 h-14 bg-brand-secondary/20 rounded-2xl flex items-center justify-center text-brand-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">Readiness Score</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Get a quantifiable 0-100 score representing your technical, tool-stack, and portfolio employability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-all duration-500 border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <BookOpen className="text-brand-accent w-24 h-24 -mr-8 -mt-8 rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              <div className="w-14 h-14 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">AI Roadmap</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Receive a dynamic, step-by-step learning path curated to fill your specific gaps in the shortest time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
