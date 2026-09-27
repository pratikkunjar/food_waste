import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Truck, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MatchingPage: React.FC = () => {
  const { currentSurplus, availableReceivers, matchedReceiver, selectReceiver, navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-7">
        <div className="fade-up">
          <p className="step-indicator">03 / Allocation</p>
          <h1 className="page-title">Verified Receivers</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Matching <strong className="text-slate-900">{currentSurplus.quantity} meals</strong> with nearby vetted community organizations.
          </p>
        </div>

        <div className="fade-up-d1 space-y-3.5">
          {availableReceivers.map((r, i) => {
            const selected = matchedReceiver?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => selectReceiver(r)}
                className={`card p-5 cursor-pointer transition-all duration-200 ${
                  selected
                    ? 'bg-[#f0fdf4] border-[#86efac] shadow-md shadow-emerald-900/5'
                    : 'bg-white border-[#e2e8e4] hover:border-[#86efac]'
                }`}
                style={{
                  borderLeft: selected ? '4px solid #16a34a' : '4px solid transparent',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {selected && <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />}
                      <h3 className="font-['Outfit'] font-extrabold text-base text-[#0d2e20] tracking-tight truncate">
                        {r.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#16a34a]" /> {r.distanceKm} km away
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Truck size={12} className="text-slate-500" /> {r.vehicleType || 'Insulated Van'}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                        <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]" /> {r.rating} / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className="font-['Outfit'] font-black text-xl tracking-tight leading-none"
                      style={{
                        color: r.capacityMeals >= currentSurplus.quantity ? '#16a34a' : '#d97706',
                      }}
                    >
                      {r.capacityMeals}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      capacity
                    </p>
                    <span
                      className={`tag mt-2 ${
                        r.type.toLowerCase().includes('ngo') || r.type.toLowerCase().includes('food bank')
                          ? 'tag-green'
                          : r.type.toLowerCase().includes('shelter') || r.type.toLowerCase().includes('home')
                          ? 'tag-blue'
                          : 'tag-teal'
                      }`}
                    >
                      {r.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {matchedReceiver && (
          <div className="fade-up flex justify-end pt-2">
            <button
              onClick={() => navigateTo('verification')}
              className="btn-primary"
            >
              Confirm Handover to {matchedReceiver.name} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
