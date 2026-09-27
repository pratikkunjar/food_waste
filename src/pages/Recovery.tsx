import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle2, Recycle } from 'lucide-react';
import { IMAGES } from '../data/imageConfig';

export const RecoveryPage: React.FC = () => {
  const { currentSurplus, currentRisk, currentTrustToken, markRecoveryProcessed } = useApp();
  const [selected, setSelected] = React.useState<'ANIMAL_FEED' | 'COMPOSTING'>(
    currentRisk.recommendedPathway === 'COMPOSTING' ? 'COMPOSTING' : 'ANIMAL_FEED'
  );
  const [processed, setProcessed] = React.useState(false);

  const options = [
    {
      key: 'ANIMAL_FEED' as const,
      title: 'Licensed Cattle & Animal Feed',
      sub: 'Kamdhenu Gaushala · 5.2 km away',
      img: IMAGES.animalRecovery.url,
      note: 'Clean vegetarian food, boiled grains, and dal eligible. Strict zero-plastic and zero-packaging protocols.',
      tagColor: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
    },
    {
      key: 'COMPOSTING' as const,
      title: 'Campus Aerobic Composting',
      sub: 'Green Cell Unit 2 · 0.8 km away',
      img: IMAGES.composting.url,
      note: 'Aerobic in-vessel composter converts organic food waste into rich soil nitrogen within 35–45 days.',
      tagColor: '#16a34a',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
    },
  ];

  const handleConfirm = () => {
    setProcessed(true);
    markRecoveryProcessed(selected);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-7">
        <div className="fade-up">
          <p className="step-indicator">Safeguard Branch · Circular Recovery</p>
          <h1 className="page-title">Circular Recovery Hub</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Unsafe surplus → verified green pathways. Zero landfill, always.
          </p>
        </div>

        {/* Alert Banner */}
        <div className="fade-up-d1 card p-5 bg-[#fffbeb] border border-[#fde68a] flex items-start gap-3.5">
          <ShieldAlert size={18} className="text-[#d97706] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[#92400e]">Human Redistribution Blocked by Safety Engine</p>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {currentSurplus.quantity} {currentSurplus.quantityUnit} of <strong className="text-slate-900">{currentSurplus.foodType}</strong> held at {currentSurplus.temperatureCelsius}°C — violates safe biological limits. AnnaDhara prevents contaminated food from reaching communities.
            </p>
            {currentSurplus.visualSignal === 'WARNING' && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium flex items-center gap-2">
                <span className="font-bold text-red-700">🚨 Optical Defect Flag:</span>
                <span>{currentSurplus.visualSignalNotes || 'Biological anomalies / foreign matter detected during CV camera scan'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pathway Cards */}
        <div className="fade-up-d2 grid sm:grid-cols-2 gap-5">
          {options.map(o => {
            const isSelected = selected === o.key;
            return (
              <div
                key={o.key}
                onClick={() => setSelected(o.key)}
                className={`card cursor-pointer overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'border-[#86efac] shadow-lg shadow-emerald-950/10'
                    : 'border-[#e2e8e4] hover:border-[#86efac]'
                }`}
                style={{
                  background: isSelected ? o.bgColor : '#ffffff',
                  borderLeft: `4px solid ${isSelected ? o.tagColor : 'transparent'}`,
                }}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={o.img}
                    alt={o.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm"
                      style={{
                        background: '#ffffff',
                        color: o.tagColor,
                        border: `1.5px solid ${o.borderColor}`,
                      }}
                    >
                      Selected ✓
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-['Outfit'] font-black text-base text-[#0d2e20]">
                      {o.title}
                    </h3>
                    {isSelected && <CheckCircle2 size={16} style={{ color: o.tagColor }} />}
                  </div>
                  <p className="text-xs font-semibold text-[#16a34a]">{o.sub}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{o.note}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!processed ? (
          <div className="fade-up-d3 flex justify-end pt-2">
            <button onClick={handleConfirm} className="btn-amber">
              <Recycle size={16} /> Authorize Green Recovery Pathway
            </button>
          </div>
        ) : (
          <div className="fade-up card p-5 bg-[#f0fdf4] border border-[#bbf7d0] flex items-center gap-3.5">
            <CheckCircle2 size={20} className="text-[#16a34a] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#14532d]">Recovery Logged & Certified</p>
              <p className="text-xs text-slate-700 mt-0.5">
                {currentSurplus.quantity} {currentSurplus.quantityUnit} → {selected === 'ANIMAL_FEED' ? 'Kamdhenu Gaushala' : 'Campus Green Composting'} · Receipt: <span className="font-mono text-[#15803d] font-bold">REC-DIV-{currentTrustToken.tokenId}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
