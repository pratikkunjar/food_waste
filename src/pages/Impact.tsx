import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Droplets, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { impactStats } = useApp();
  const max = Math.max(...impactStats.monthlyRescueData.map(d => d.rescuedMeals));

  const metrics = [
    { label: 'Meals Rescued', value: impactStats.mealsRescued.toLocaleString(), unit: 'Total plates served', icon: <CheckCircle2 size={20} />, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'CO₂ Avoided', value: `${(impactStats.co2AvoidedKg / 1000).toFixed(1)} MT`, unit: 'Carbon offset', icon: <Leaf size={20} />, color: '#0284c7', bg: '#eff6ff', border: '#bfdbfe' },
    { label: 'Water Conserved', value: `${Math.round(impactStats.waterSavedLitres / 1000)}K L`, unit: 'Litres saved', icon: <Droplets size={20} />, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { label: 'Eat Right Score', value: `${impactStats.eatRightScore}`, unit: '/100 · FSSAI A+', icon: <Award size={20} />, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  ];

  const splits = [
    { label: 'Human Redistribution', pct: 78, color: '#16a34a' },
    { label: 'Licensed Animal Feed', pct: 14, color: '#d97706' },
    { label: 'Campus Aerobic Composting', pct: 8, color: '#0284c7' },
    { label: 'Direct Landfill', pct: 0, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="fade-up">
          <p className="step-indicator">06 / Analytics</p>
          <h1 className="page-title">Sustainability Analytics</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time environmental ledger — audited plate rescues & carbon offsets.
          </p>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 fade-up-d1">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="card-3d p-6 rounded-2xl bg-white border border-[#e2e8e4] relative"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: m.bg,
                  border: `1.5px solid ${m.border}`,
                  color: m.color,
                }}
              >
                {m.icon}
              </div>
              <p className="font-['Outfit'] font-black text-2xl sm:text-3xl text-[#0d2e20] tracking-tight leading-none">
                {m.value}
              </p>
              <p className="text-xs font-bold text-slate-600 mt-2">{m.label}</p>
              <p className="text-[11px] font-semibold mt-0.5" style={{ color: m.color }}>{m.unit}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart Card */}
        <div className="fade-up-d2 card p-7 rounded-2xl bg-white border border-[#e2e8e4]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-['Outfit'] font-black text-lg text-[#0d2e20]">Monthly Rescued Meals</h3>
              <p className="text-xs text-slate-400 mt-0.5">Redistributed meals across campus canteens and messes</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1 rounded-full">
              <TrendingUp size={13} /> +23% YoY
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {impactStats.monthlyRescueData.map((d, i) => {
              const pct = (d.rescuedMeals / max) * 100;
              const isLast = i === impactStats.monthlyRescueData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group">
                  <div className="w-full bg-slate-100 rounded-t-lg h-36 flex items-end justify-center p-1">
                    <div
                      title={`${d.rescuedMeals} meals`}
                      className={`w-full rounded-t-md transition-all duration-700 group-hover:brightness-95 ${
                        isLast
                          ? 'bg-gradient-to-t from-[#15803d] to-[#22c55e] shadow-sm'
                          : 'bg-slate-300'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${isLast ? 'text-[#16a34a] font-extrabold' : 'text-slate-400'}`}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recovery Split Card */}
        <div className="fade-up-d3 card p-7 rounded-2xl bg-white border border-[#e2e8e4] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-['Outfit'] font-black text-lg text-[#0d2e20]">Circularity Distribution</h3>
            <span className="text-xs text-[#16a34a] font-bold">100% Zero-Landfill Guarantee</span>
          </div>

          <div className="space-y-4">
            {splits.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5">
                  <span className="text-slate-700">{s.label}</span>
                  <span className="font-['Outfit'] font-extrabold" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      background: s.color,
                      width: `${s.pct}%`,
                      opacity: s.pct === 0 ? 0.2 : 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
            <CheckCircle2 size={18} className="text-[#16a34a] shrink-0" />
            <p className="text-xs text-[#14532d] font-semibold">
              Zero direct landfill events across all recorded hostel mess audit cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
