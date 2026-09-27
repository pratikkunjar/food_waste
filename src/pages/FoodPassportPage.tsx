import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Truck, Leaf, Droplets, BarChart3, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const FoodPassportPage: React.FC = () => {
  const { currentPassport, markPickupDispatched, markRedistributionComplete, navigateTo, loadSafeDemo } = useApp();
  const [qrOpen, setQrOpen] = useState(false);

  if (!currentPassport) return (
    <div className="min-h-[60vh] bg-[#f8faf9] flex items-center justify-center p-4">
      <div className="card p-8 text-center max-w-md bg-white border border-[#e2e8e4]">
        <p className="text-slate-500 text-sm">No active passport generated yet.</p>
        <button onClick={loadSafeDemo} className="btn-primary mt-4">
          Load Safe Demo Scenario
        </button>
      </div>
    </div>
  );

  const p = currentPassport;
  const done = p.redistributionCompleted;
  const stages = p.timeline.map(e => ({ label: e.stage, done: e.completed, active: e.active }));

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-7">
        <div className="fade-up">
          <p className="step-indicator">05 / Digital Audit</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="page-title">Digital Food Passport</h1>
              <p className="text-[#15803d] text-xs sm:text-sm mt-1 font-mono font-bold">
                {p.passportId}
              </p>
            </div>
            <span className={`tag ${done ? 'tag-green' : 'tag-amber'}`}>
              {done ? '✓ Delivered & Closed' : '• In Transit / Active'}
            </span>
          </div>
        </div>

        {/* Passport Details Card */}
        <div className="fade-up-d1 card p-7 bg-white border border-[#e2e8e4] space-y-6">
          <div className="grid sm:grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Food Item</p>
              <p className="text-[#0d2e20] font-bold text-base">{p.surplus.foodType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Net Volume</p>
              <p className="text-[#0d2e20] font-bold text-base">{p.surplus.quantity} {p.surplus.quantityUnit}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Source Facility</p>
              <p className="text-slate-700 font-semibold">{p.surplus.sourceKitchen}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Matched Receiver</p>
              <p className="text-slate-700 font-semibold">{p.matchedReceiver?.name || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Trust Token</p>
              <p className="text-[#16a34a] font-mono text-xs font-bold">{p.trustToken.tokenId}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Risk Category</p>
              <span className={`tag text-[10px] ${p.riskAssessment.overallRisk === 'LOW' ? 'tag-green' : 'tag-amber'}`}>
                {p.riskAssessment.overallRisk} RISK
              </span>
            </div>
          </div>

          {/* Environmental metrics */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-[#16a34a]">
              <Leaf size={16} />
              <span className="font-bold">~{p.co2SavedKg} kg CO₂e</span>
              <span className="text-slate-400 text-xs">saved</span>
            </div>
            <div className="flex items-center gap-2 text-[#0284c7]">
              <Droplets size={16} />
              <span className="font-bold">~{p.waterSavedLiters.toLocaleString()} L</span>
              <span className="text-slate-400 text-xs">water saved</span>
            </div>
            <div className="flex items-center gap-2 text-[#b45309]">
              <ShieldCheck size={16} />
              <span className="font-bold">FSSAI Compliant</span>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="fade-up-d2 card p-6 bg-white border border-[#e2e8e4] flex flex-col sm:flex-row items-center gap-6">
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="p-3 bg-white rounded-2xl cursor-pointer hover:scale-105 transition-transform shadow-md shrink-0 border border-slate-200"
          >
            <QRCodeSVG value={p.qrValue} size={100} level="M" />
          </button>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="font-['Outfit'] font-black text-base text-[#0d2e20]">
                Cryptographic Audit QR Code
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                Tap to Expand
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recipients, transport volunteers, and health inspectors scan this code to confirm chain-of-custody.
            </p>
            <p className="text-[11px] text-[#16a34a] mt-2 font-mono font-bold">
              annadhara.in/verify/{p.passportId}
            </p>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="fade-up-d3 card p-6 bg-white border border-[#e2e8e4] space-y-4">
          <p className="font-['Outfit'] font-black text-base text-[#0d2e20]">
            Dispatch & Custody Journey
          </p>
          <div className="space-y-3.5">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    s.done
                      ? 'border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]'
                      : s.active
                      ? 'border-[#f59e0b] bg-[#fffbeb] text-[#f59e0b] animate-pulse'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {s.done ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-[#f59e0b]' : 'bg-slate-300'}`} />
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    s.done ? 'text-[#0d2e20]' : s.active ? 'text-[#b45309]' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        {!done && (
          <div className="fade-up-d3 flex flex-wrap gap-3 justify-end pt-2">
            {!p.pickupCompleted && (
              <button onClick={markPickupDispatched} className="btn-secondary text-xs">
                <Truck size={14} /> Mark Vehicle In-Transit
              </button>
            )}
            <button onClick={markRedistributionComplete} className="btn-primary text-xs">
              <CheckCircle2 size={15} /> Mark Delivered to NGO
            </button>
          </div>
        )}

        {done && (
          <div className="fade-up card p-4 px-6 flex items-center justify-between gap-4 bg-[#f0fdf4] border border-[#bbf7d0]">
            <div className="flex items-center gap-2 text-[#15803d] font-bold text-sm">
              <CheckCircle2 size={18} /> Redistribution Complete — Impact Tracked
            </div>
            <button
              onClick={() => navigateTo('impact')}
              className="btn-primary text-xs"
            >
              <BarChart3 size={13} /> View Real-Time Analytics <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* QR Modal */}
        {qrOpen && (
          <div
            onClick={() => setQrOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="card p-7 text-center max-w-xs w-full bg-white border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="p-3 bg-white border border-slate-200 rounded-2xl mx-auto inline-block shadow-sm">
                <QRCodeSVG value={p.qrValue} size={180} level="H" />
              </div>
              <p className="font-['Outfit'] font-black text-[#0d2e20] text-base">{p.passportId}</p>
              <p className="text-xs text-slate-500">
                {p.surplus.foodType} · {p.surplus.quantity} meals
              </p>
              <button
                onClick={() => setQrOpen(false)}
                className="btn-secondary w-full text-xs"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
