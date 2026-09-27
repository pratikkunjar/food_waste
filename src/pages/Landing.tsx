import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  Play,
  ArrowRight,
  ShieldCheck,
  Users,
  QrCode,
  Recycle,
  Sparkles,
  TrendingUp,
  Leaf,
  UtensilsCrossed,
  Building2,
  CloudSun,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { navigateTo, loadSafeDemo, loadHighRiskDemo, currentSurplus } = useApp();

  const workflowSteps = [
    {
      id: 'report',
      num: '1',
      title: 'Report',
      sub: 'Voice or simple form',
      icon: <Mic size={18} className="text-emerald-700" />,
      action: () => navigateTo('report'),
    },
    {
      id: 'extract',
      num: '2',
      title: 'Extract',
      sub: 'AI analyzes details',
      icon: <Sparkles size={18} className="text-emerald-700" />,
      action: () => navigateTo('report'),
    },
    {
      id: 'assess',
      num: '3',
      title: 'Assess',
      sub: 'Risk & safety check',
      icon: <ShieldCheck size={18} className="text-emerald-700" />,
      action: () => navigateTo('risk'),
    },
    {
      id: 'match',
      num: '4',
      title: 'Match',
      sub: 'Find verified receivers',
      icon: <Users size={18} className="text-emerald-700" />,
      action: () => navigateTo('matching'),
    },
    {
      id: 'verify',
      num: '5',
      title: 'Verify',
      sub: 'Human + system',
      icon: <CheckCircle2 size={18} className="text-emerald-700" />,
      action: () => navigateTo('verification'),
    },
    {
      id: 'passport',
      num: '6',
      title: 'Passport',
      sub: 'Digital food passport',
      icon: <QrCode size={18} className="text-emerald-700" />,
      action: () => navigateTo('passport'),
    },
    {
      id: 'recovery',
      num: '7',
      title: 'Rescue / Recover',
      sub: 'Redistribute or recover',
      icon: <Leaf size={18} className="text-emerald-700" />,
      action: () => navigateTo('recovery'),
    },
    {
      id: 'track',
      num: '8',
      title: 'Track',
      sub: 'Real impact',
      icon: <TrendingUp size={18} className="text-emerald-700" />,
      action: () => navigateTo('impact'),
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-[#071912]">
      {/* ══════════════════════════════════════════════════════
          HERO SECTION — EXACT MATCH TO USER'S MOCKUP
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative w-full flex flex-col justify-between overflow-hidden"
        style={{ background: '#071912', minHeight: '75vh' }}
      >
        {/* Full Hero Photo */}
        <img
          src="/hero-bg.jpg"
          alt="Children receiving food"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: '40% 25%',
          }}
        />

        {/* Gradient — dark on left for text, fades right to reveal photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,16,10,0.92) 0%, rgba(4,16,10,0.80) 30%, rgba(4,16,10,0.30) 60%, rgba(4,16,10,0.05) 100%)',
          }}
        />

        {/* Hero Top Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Amber Horizontal Bar + Eyebrow */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-8 h-[2.5px] bg-[#f59e0b] rounded-full inline-block"></span>
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#fcd34d] uppercase font-['Outfit']">
                FOOD RESCUE / AI POWERED / SUSTAINABLE FUTURE
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Outfit'] font-black text-3xl sm:text-5xl lg:text-[3.4rem] text-white leading-[1.08] tracking-[-0.035em] mb-5">
              Turn institutional<br />
              food surplus into<br />
              <span className="text-[#6ee7b7]">verified rescue and</span><br />
              <span className="text-[#6ee7b7]">recovery.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base font-normal max-w-lg mb-8 leading-relaxed">
              AI-powered. Traceable. Impact driven.<br />
              Because good food deserves a second journey.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateTo('report')}
                className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#d97706] hover:to-[#f59e0b] text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full flex items-center gap-2 shadow-2xl hover:scale-105 transition-all cursor-pointer border-none"
              >
                <Mic size={17} className="text-slate-950" />
                Report Food Surplus →
              </button>

              <button
                onClick={() => navigateTo('dashboard')}
                className="bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/25 text-white font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Play size={11} fill="white" className="text-white ml-0.5" />
                </div>
                See How It Works
              </button>
            </div>
          </div>

          {/* Floating Organic Green Badge on Right */}
          <div className="hidden lg:flex absolute right-12 bottom-16 items-center gap-3 bg-[#0d2a1d]/85 border border-emerald-500/40 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl">
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 flex items-center justify-center">
              <Leaf size={16} className="text-[#6ee7b7]" />
            </div>
            <div className="text-left font-['Lora'] italic leading-tight">
              <p className="text-xs font-semibold text-white">Less Food Waste</p>
              <p className="text-xs text-[#6ee7b7]">More Hope</p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            ORGANIC CURVED WHITE WAVE WORKFLOW RIBBON
        ══════════════════════════════════════════════════════ */}
        <div className="relative z-20 w-full mt-auto">
          {/* Smooth SVG Wave Boundary */}
          <div className="w-full overflow-hidden leading-none -mb-[1px]">
            <svg
              viewBox="0 0 1440 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-10 sm:h-14 lg:h-16 block preserve-3d"
            >
              <path
                d="M0 34C280 62 520 8 760 30C1000 52 1220 12 1440 34V64H0V34Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          {/* Pure White Workflow Ribbon Bar */}
          <div className="bg-white py-5 px-4 sm:px-6 shadow-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <div className="flex items-center justify-between min-w-[920px] gap-2">
                {workflowSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    {/* Workflow Step Item */}
                    <div
                      onClick={step.action}
                      className="flex flex-col items-center text-center cursor-pointer group px-2 py-1 rounded-xl hover:bg-emerald-50/70 transition-all flex-1"
                    >
                      {/* Round Icon Badge */}
                      <div className="w-10 h-10 rounded-full bg-[#f1f5f3] group-hover:bg-[#dcfce7] border border-slate-200 group-hover:border-[#86efac] flex items-center justify-center mb-2 shadow-xs transition-colors">
                        {step.icon}
                      </div>

                      {/* Title */}
                      <p className="font-['Outfit'] font-bold text-xs sm:text-[13px] text-[#0e1726] group-hover:text-[#16a34a] transition-colors leading-tight">
                        {step.title}
                      </p>

                      {/* Subtitle */}
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 whitespace-nowrap">
                        {step.sub}
                      </p>
                    </div>

                    {/* Arrow Divider between steps */}
                    {idx < workflowSteps.length - 1 && (
                      <span className="text-slate-300 font-light text-xs select-none px-0.5">
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            DEEP FOREST GREEN BOTTOM STATS RIBBON
        ══════════════════════════════════════════════════════ */}
        <div
          className="relative z-20 w-full py-5 px-4 sm:px-8 border-t border-emerald-900/40"
          style={{
            background: 'linear-gradient(180deg, #071912 0%, #05140e 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Tagline Left */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <Leaf size={18} className="text-[#6ee7b7]" />
              </div>
              <p className="font-['Lora'] italic text-sm sm:text-base text-emerald-100 font-normal tracking-wide">
                Good food. Less waste. A healthier planet.
              </p>
            </div>

            {/* Metrics Right */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 sm:gap-8">
              {/* Stat 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#6ee7b7]">
                  <UtensilsCrossed size={16} />
                </div>
                <div className="text-left">
                  <p className="font-['Outfit'] font-black text-white text-base leading-none tracking-tight">
                    1.2M+
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Meals Rescued</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#6ee7b7]">
                  <Building2 size={16} />
                </div>
                <div className="text-left">
                  <p className="font-['Outfit'] font-black text-white text-base leading-none tracking-tight">
                    320+
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Institutions</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#6ee7b7]">
                  <CloudSun size={16} />
                </div>
                <div className="text-left">
                  <p className="font-['Outfit'] font-black text-white text-base leading-none tracking-tight">
                    580+ tons
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">CO₂e Reduced</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#6ee7b7]">
                  <HeartHandshake size={16} />
                </div>
                <div className="text-left">
                  <p className="font-['Outfit'] font-black text-white text-base leading-none tracking-tight">
                    1,800+
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">People Reached</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INTERACTIVE PROTOTYPE SECTION — READY FOR JUDGES
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Interactive Prototype Simulation
            </span>
            <h2 className="font-['Outfit'] font-black text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight">
              Test Real Institutional Kitchen Scenarios
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Judges can click either scenario to watch AnnaDhara calculate AI risk scores, generate cryptographic trust tokens, and route surplus food.
            </p>
          </div>

          {/* 2 Scenario Cards for Judges */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Safe Scenario */}
            <div
              onClick={loadSafeDemo}
              className="card p-6 bg-white border border-emerald-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Scenario A
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Safe Surplus Redistribution
                  </h3>
                  <p className="text-xs text-slate-500">40 Veg Meals · Fresh & Hot Held</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Dinner prepared at 7:30 PM, hot container holding at 62°C. AI gives <strong>PASS</strong> rating, matches nearby Robin Hood Army receiver, and issues a tamper-evident Food Passport.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600">
                <span>Run Safe Scenario Flow →</span>
                <span className="text-slate-400 font-normal">Risk Index: 18/100</span>
              </div>
            </div>

            {/* High-Risk Scenario */}
            <div
              onClick={loadHighRiskDemo}
              className="card p-6 bg-white border border-amber-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Scenario B
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                    Unsafe Surplus Safeguard
                  </h3>
                  <p className="text-xs text-slate-500">65 Sambar Rice · Ambient Abuse</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Lunch rice left at room temperature (33°C) for 4.5+ hours. AI <strong>BLOCKS</strong> human redistribution to prevent food poisoning and automatically diverts to Kamdhenu Gaushala animal feed.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-amber-600">
                <span>Run Safeguard Recovery Flow →</span>
                <span className="text-slate-400 font-normal">Risk Index: 88/100</span>
              </div>
            </div>
          </div>

          {/* 3 Core Architecture Pillars */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Mic size={20} />
              </div>
              <h4 className="font-['Outfit'] font-bold text-base text-slate-900">
                Voice-First Indian Kitchen Intake
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mess staff simply speak into the phone in Hindi or regional languages. Whisper & Gemini AI automatically extract dish names, counts, and thermal logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-['Outfit'] font-bold text-base text-slate-900">
                4-Layer Safety Defense Shield
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates time-since-prep, holding temperature, dish category bacterial risk, and physical supervisor sign-off before issuing an HMAC cryptographic token.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Recycle size={20} />
              </div>
              <h4 className="font-['Outfit'] font-bold text-base text-slate-900">
                Zero-Landfill Circular Routing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If food fails safety standards, it is never thrown into landfills. AnnaDhara routes it to licensed cattle shelters, biogas plants, or campus compost units.
              </p>
            </div>
          </div>

          {/* Bottom Callout banner */}
          <div className="rounded-2xl p-8 bg-gradient-to-r from-emerald-900 to-[#071912] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="font-['Outfit'] font-extrabold text-2xl text-white">
                Ready to explore the full interactive dashboard?
              </h3>
              <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                Inspect active surplus tickets, receiver geo-matching, QR-code verification, and verified environmental impact metrics.
              </p>
            </div>
            <button
              onClick={() => navigateTo('dashboard')}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer border-none"
            >
              Open Live Dashboard
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
