import React from 'react';
import { ArrowRight, Youtube, ExternalLink } from 'lucide-react';

interface Props {
    roadmap: any[];
}

export const RoadmapView: React.FC<Props> = ({ roadmap }) => {
    if (!roadmap || roadmap.length === 0) return null;

    return (
        <div className="relative border-l border-[#E9ECEF] ml-3 space-y-12 pb-4">
            {roadmap.map((module: any, idx: number) => (
                <div key={idx} className="ml-10 relative group">
                    <span className="absolute -left-[53px] bg-[#111111] text-white rounded-xl w-10 h-10 flex items-center justify-center font-black shadow-sm group-hover:bg-brand-primary transition-colors duration-300">
                        {String(module.module).padStart(2, '0')}
                    </span>
                    <div className="bento-indigo p-8 rounded-3xl border hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.05)] transition-all">
                        <h4 className="text-2xl font-black text-[#111111] mb-2 uppercase tracking-tight">{module.title}</h4>
                        <p className="text-[10px] font-black text-[#111111] uppercase tracking-[0.3em] mb-8 opacity-40 leading-relaxed font-mono">{module.description}</p>

                        {module.youtube_url && (
                            <a
                                href={module.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] hover:bg-[#111111] border border-[#DEE2E6] text-[#495057] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-8 group/yt"
                            >
                                <Youtube size={14} className="text-[#FF0000]" />
                                Tutorial Access
                                <ExternalLink size={12} className="opacity-50 group-hover/yt:opacity-100 transition-opacity" />
                            </a>
                        )}

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {module.items.map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-[#111111] bg-white p-3 rounded-xl border border-[#E9ECEF]">
                                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                                    <span className="text-[11px] font-black uppercase tracking-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};
