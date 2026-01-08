import React from 'react';
import { TrendingUp, MapPin, DollarSign, Activity, Zap } from 'lucide-react';

interface MarketData {
    salary_range: { min: number; max: number; currency: string };
    growth_rate: string;
    demand_trend: string;
    top_hubs: string[];
    hot_skills_2026: string[];
}

interface Props {
    data: MarketData;
    role: string;
}

export const MarketPulse: React.FC<Props> = ({ data, role }) => {
    // Determine color based on trend
    const trendColor = data.demand_trend === 'High' ? 'text-green-600' : 'text-blue-600';

    // Format Currency Helper
    const formatCurrency = (val: number, currency: string) => {
        if (currency === 'INR') {
            return `₹${(val / 100000).toFixed(1)}L`;
        }
        return `$${(val / 1000).toFixed(0)}k`;
    };

    return (
        <div className="w-full mb-6">
            <div className="bento-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="flex items-center gap-2 text-2xl font-black text-[#111111] uppercase tracking-tight">
                        Market Intelligence
                    </h3>
                    <span className="text-[10px] font-black text-[#ADB5BD] px-2 py-1 bg-[#F8F9FA] rounded border border-[#E9ECEF] uppercase tracking-widest">
                        {data.salary_range.currency === 'INR' ? '2026 INDIA' : '2026 GLOBAL'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Salary Range */}
                    <div className="bento-blue rounded-2xl p-6 border relative overflow-hidden group transition-all">
                        <div className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-1">Target Yield</div>
                        <div className="text-[#111111] text-3xl font-black tracking-tight mb-4">
                            {formatCurrency(data.salary_range.min, data.salary_range.currency)} <span className="text-[#ADB5BD] text-xl font-medium">-</span> {formatCurrency(data.salary_range.max, data.salary_range.currency)}
                        </div>
                        {/* Visual Bar */}
                        <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden flex">
                            <div className="h-full bg-brand-primary w-[70%] opacity-80"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-[#ADB5BD] mt-2 font-black tracking-widest uppercase">
                            <span>Floor</span>
                            <span>Cap</span>
                        </div>
                    </div>

                    {/* Classification & Hubs */}
                    <div className="bento-gray rounded-2xl p-6 border flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-1">Market Volatility</div>
                            <div className={`text-2xl font-black flex items-center gap-2 uppercase tracking-tight ${trendColor}`}>
                                {data.demand_trend}
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#F8F9FA]">
                            <div className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-3 flex items-center gap-1">
                                Top Hiring Hubs
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(data.top_hubs || []).slice(0, 2).map((hub, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-[#E9ECEF] px-2.5 py-1.5 rounded text-[#495057] uppercase tracking-widest">
                                        {hub}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hot Skills */}
                    <div className="bg-[#111111] rounded-2xl p-6 relative overflow-hidden">
                        <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Core Catalysts</div>
                        <div className="flex flex-wrap gap-2">
                            {(data.hot_skills_2026 || []).map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-tight">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
