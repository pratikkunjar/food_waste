import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, Utensils, TrendingUp, Leaf, Droplets, Building2 } from 'lucide-react';

/* ─────────────────────────────────────────────────
   HOOK: count-up number animation
───────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, started = false) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, started]);

  return value;
}

/* ─────────────────────────────────────────────────
   RIPPLE BUTTON
───────────────────────────────────────────────── */
function RippleButton({
  children, onClick, className, style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${x}px;top:${y}px;border-radius:50%;
      background:rgba(255,255,255,0.35);transform:scale(0);
      animation:ripple-burst 0.55s ease-out forwards;pointer-events:none;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.();
  };

  return (
    <button ref={ref} onClick={handleClick} className={className} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────
   PROGRESS RING (for Eat Right Score)
───────────────────────────────────────────────── */
function ProgressRing({ value, max = 100, color = '#16a34a', size = 44 }: {
  value: number; max?: number; color?: string; size?: number;
}) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={5} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────── */
export const Dashboard: React.FC = () => {
  const { navigateTo, currentSurplus, currentRisk, surplusHistory, impactStats } = useApp();
  const isSafe = currentRisk.isEligibleForRedistribution;
  const riskColor = isSafe ? '#16a34a' : '#d97706';
  const riskBg = isSafe ? '#f0fdf4' : '#fffbeb';
  const riskBorder = isSafe ? '#bbf7d0' : '#fde68a';

  // count-up trigger
  const [counting, setCounting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCounting(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const meals   = useCountUp(impactStats.mealsRescued, 1600, counting);
  const co2     = useCountUp(Math.round(impactStats.co2AvoidedKg / 100) / 10, 1400, counting); // tenths
  const water   = useCountUp(Math.round(impactStats.waterSavedLitres / 1000), 1500, counting);
  const score   = useCountUp(impactStats.eatRightScore, 1200, counting);

  const stats = [
    {
      label: 'Meals Rescued',
      displayValue: meals.toLocaleString(),
      rawValue: impactStats.mealsRescued,
      sub: 'All time plates',
      icon: <Leaf size={18} className="text-[#16a34a]" />,
      bg: '#f0fdf4', border: '#bbf7d0', numColor: '#0d2e20',
      isScore: false,
    },
    {
      label: 'CO₂ Saved',
      displayValue: `${(impactStats.co2AvoidedKg / 1000).toFixed(1)} MT`,
      rawValue: Math.round(impactStats.co2AvoidedKg / 1000),
      sub: 'Carbon offset',
      icon: <TrendingUp size={18} className="text-[#0284c7]" />,
      bg: '#eff6ff', border: '#bfdbfe', numColor: '#0d2e20',
      isScore: false,
    },
    {
      label: 'Water Conserved',
      displayValue: `${water}K L`,
      rawValue: Math.round(impactStats.waterSavedLitres / 1000),
      sub: 'Freshwater saved',
      icon: <Droplets size={18} className="text-[#7c3aed]" />,
      bg: '#f5f3ff', border: '#ddd6fe', numColor: '#0d2e20',
      isScore: false,
    },
    {
      label: 'Eat Right Score',
      displayValue: `${score}`,
      rawValue: impactStats.eatRightScore,
      sub: '/100 · FSSAI A+',
      icon: <ShieldCheck size={18} className="text-[#d97706]" />,
      bg: '#fffbeb', border: '#fde68a', numColor: '#0d2e20',
      isScore: true,
    },
  ];

  // bar chart
  const maxBar = Math.max(...impactStats.monthlyRescueData.map(m => m.rescuedMeals));

  return (
    <>
      {/* Ripple keyframe injected once */}
      <style>{`
        @keyframes ripple-burst {
          to { transform: scale(4); opacity: 0; }
        }
        @keyframes barRise {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .stat-card {
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease;
        }
        .stat-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 22px 44px rgba(16,80,40,0.13);
        }
        .stat-card .green-line {
          transition: width 0.45s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.3s ease;
        }
        .stat-card:hover .green-line {
          width: 100% !important;
          background: #15803d !important;
        }
        .stat-card .card-icon {
          transition: transform 0.3s ease;
        }
        .stat-card:hover .card-icon {
          transform: scale(1.18) rotate(-6deg);
        }
        .bar-col {
          transform-origin: bottom;
          animation: barRise 0.65s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .table-row-anim {
          animation: rowSlideIn 0.4s ease both;
        }
      `}</style>

      <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="fade-up flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-0.5 bg-[#f59e0b] rounded-full inline-block" />
                <span className="text-[11px] font-bold tracking-[0.18em] text-[#d97706] uppercase font-['Outfit']">
                  LIVE MONITORING
                </span>
              </div>
              <h1 className="font-['Outfit'] font-black text-3xl sm:text-4xl text-[#0d2e20] tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                North Campus Mess Complex · updated just now
              </p>
            </div>

            <div className="flex items-center gap-3">
              <RippleButton
                onClick={() => navigateTo('report')}
                className="btn-primary text-xs flex items-center gap-2"
              >
                <Utensils size={14} />
                + Report New Surplus
              </RippleButton>
            </div>
          </div>

          {/* 4 Stat Tiles */}
          <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 fade-up-d1">
            {stats.map((s, i) => (
              <div
                key={i}
                className="stat-card p-6 rounded-2xl bg-white border border-[#e2e8e4] relative overflow-hidden"
              >
                {/* Green bottom line — expands on hover */}
                <div
                  className="green-line absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
                  style={{ width: '50%', background: '#86efac' }}
                />

                {/* Icon */}
                <div
                  className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  {s.icon}
                </div>

                {/* Value — progress ring for score card */}
                {s.isScore ? (
                  <div className="flex items-center gap-3">
                    <ProgressRing value={counting ? s.rawValue : 0} color="#d97706" size={44} />
                    <p
                      className="font-['Outfit'] text-2xl sm:text-3xl font-black tracking-tight leading-none"
                      style={{ color: s.numColor }}
                    >
                      {s.displayValue}
                    </p>
                  </div>
                ) : (
                  <p
                    className="font-['Outfit'] text-2xl sm:text-3xl font-black tracking-tight leading-none"
                    style={{ color: s.numColor }}
                  >
                    {i === 0 ? meals.toLocaleString()
                      : i === 1 ? `${(impactStats.co2AvoidedKg / 1000).toFixed(1)} MT`
                      : `${water}K L`}
                  </p>
                )}

                <p className="text-xs font-bold text-slate-600 mt-2">{s.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Active Pipeline + Bar Chart */}
          <div className="grid lg:grid-cols-3 gap-6 fade-up-d2">
            {/* Active surplus card */}
            <div
              className="card lg:col-span-2 p-6 sm:p-7 rounded-2xl bg-white border border-[#e2e8e4] relative space-y-6"
              style={{ borderLeft: `4px solid ${isSafe ? '#16a34a' : '#f59e0b'}` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="live-dot" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#16a34a]">
                      ACTIVE PIPELINE
                    </span>
                  </div>
                  <h2 className="font-['Outfit'] font-black text-xl sm:text-2xl text-[#0d2e20]">
                    {currentSurplus.foodType}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building2 size={13} className="text-[#f59e0b]" />
                    {currentSurplus.sourceKitchen} · Logged at {currentSurplus.reportedTime}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ background: riskBg, color: riskColor, border: `1px solid ${riskBorder}` }}
                  >
                    {currentRisk.overallRisk.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    AI Risk Index: <strong className="text-slate-700">{currentRisk.riskScore}/100</strong>
                  </p>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Quantity</p>
                  <p className="font-['Outfit'] font-extrabold text-lg text-[#0d2e20] mt-1">
                    {currentSurplus.quantity} <span className="text-xs font-normal text-slate-500">meals</span>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Prepared Time</p>
                  <p className="font-['Outfit'] font-extrabold text-lg text-[#0d2e20] mt-1">
                    {currentSurplus.preparedTime}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Holding Temp</p>
                  <p className="font-['Outfit'] font-extrabold text-lg text-[#16a34a] mt-1">
                    {currentSurplus.temperatureCelsius}°C
                  </p>
                </div>
              </div>

              {/* Animated risk bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-slate-600">AI Safety Score Progression</span>
                  <span style={{ color: riskColor }}>
                    {isSafe ? 'Eligible for Human Redistribution' : 'Diverted to Green Recovery'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${currentRisk.riskScore}%`,
                      background: `linear-gradient(90deg, #16a34a, ${riskColor})`,
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-500">
                  {isSafe ? (
                    <span>Matched receiver ready for pickup gate OTP verification</span>
                  ) : (
                    <span className="text-amber-700 font-semibold">Bypassed human route → Auto-routed to Gaushala Feed</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <RippleButton
                    onClick={() => navigateTo('risk')}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    Inspect Risk Factors
                  </RippleButton>
                  <RippleButton
                    onClick={() => navigateTo(isSafe ? 'matching' : 'recovery')}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    {isSafe ? 'Go to Receiver Match' : 'View Green Recovery'} →
                  </RippleButton>
                </div>
              </div>
            </div>

            {/* Monthly Rescues Bar Chart */}
            <div className="card p-6 rounded-2xl bg-white border border-[#e2e8e4] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Outfit'] font-extrabold text-base text-[#0d2e20]">Monthly Rescues</h3>
                  <span className="text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">
                    +23% YoY
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Meals saved across North &amp; South Campus messes</p>

                {/* Animated bars */}
                <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
                  {impactStats.monthlyRescueData.map((d, i) => {
                    const heightPct = Math.round((d.rescuedMeals / maxBar) * 100);
                    const isCurrent = i === impactStats.monthlyRescueData.length - 1;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end justify-center p-1 overflow-hidden">
                          <div
                            className={`bar-col w-full rounded-t-md transition-all duration-300 group-hover:brightness-90 ${
                              isCurrent
                                ? 'bg-gradient-to-t from-[#15803d] to-[#22c55e] shadow-sm'
                                : 'bg-slate-300 group-hover:bg-slate-400'
                            }`}
                            style={{
                              height: `${heightPct}%`,
                              animationDelay: `${i * 80}ms`,
                            }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>This Month: <strong className="text-slate-800">4,500 meals</strong></span>
                <RippleButton
                  onClick={() => navigateTo('impact')}
                  className="text-[#16a34a] hover:text-[#14532d] font-bold bg-transparent border-none cursor-pointer"
                >
                  Full Analytics →
                </RippleButton>
              </div>
            </div>
          </div>

          {/* Recent Surplus Table */}
          <div className="card p-6 rounded-2xl bg-white border border-[#e2e8e4] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Outfit'] font-black text-lg text-[#0d2e20]">Recent Surplus Dispatches</h3>
                <p className="text-xs text-slate-400 mt-0.5">Audit log of institutional kitchen batches and outcomes</p>
              </div>
              <span className="text-xs text-[#16a34a] font-bold font-mono">100% Zero-Landfill</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Batch ID / Dish</th>
                    <th className="py-3 px-3">Facility</th>
                    <th className="py-3 px-3">Quantity</th>
                    <th className="py-3 px-3">Temp / Storage</th>
                    <th className="py-3 px-3">Risk Assessment</th>
                    <th className="py-3 px-3 text-right">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {surplusHistory.map((row, idx) => (
                    <tr
                      key={row.id}
                      className="table-row-anim hover:bg-[#f0fdf4] transition-colors"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800">{row.foodType}</p>
                        <p className="text-[10px] font-mono text-slate-400">{row.id}</p>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{row.sourceKitchen}</td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-[#16a34a]">{row.quantity}</span> {row.quantityUnit}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {row.temperatureCelsius}°C · {row.storageCondition}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="tag tag-green">PASSED</span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-[#16a34a]">
                        Robin Hood Army
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
