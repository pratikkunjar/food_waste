import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, Lock, Info } from 'lucide-react';

const statusIcon = (s: string) => {
  if (s === 'PASS') return <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />;
  if (s === 'FAIL') return <XCircle size={16} className="text-red-500 shrink-0" />;
  return <AlertTriangle size={16} className="text-[#d97706] shrink-0" />;
};

export const RiskAssessmentPage: React.FC = () => {
  const { currentSurplus, currentRisk, currentTrustToken, navigateTo } = useApp();
  const eligible = currentRisk.isEligibleForRedistribution;
  const score = currentRisk.riskScore;
  const riskColor = eligible ? '#16a34a' : score < 60 ? '#d97706' : '#dc2626';
  const riskBg = eligible ? '#f0fdf4' : score < 60 ? '#fffbeb' : '#fef2f2';
  const riskBorder = eligible ? '#bbf7d0' : score < 60 ? '#fde68a' : '#fecaca';

  const factors = [
    { label: 'Time Window Check', metric: currentRisk.timeFactor.metric, status: currentRisk.timeFactor.status, msg: currentRisk.timeFactor.message },
    { label: 'Thermal Holding Sensor', metric: currentRisk.tempFactor.metric, status: currentRisk.tempFactor.status, msg: currentRisk.tempFactor.message },
    { label: 'Dish Biological Category', metric: currentRisk.categoryFactor.metric, status: currentRisk.categoryFactor.status, msg: currentRisk.categoryFactor.message },
    { label: 'Visual Signal Analysis', metric: currentRisk.cvFactor.metric, status: currentRisk.cvFactor.status, msg: currentRisk.cvFactor.message, photo: currentSurplus.photoUrl },
    { label: 'Kitchen Supervisor Gate', metric: 'Physical sign-off', status: currentRisk.humanGate.status === 'PASS' ? 'PASS' : 'WARN', msg: currentRisk.humanGate.message },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-7">
        <div className="fade-up">
          <p className="step-indicator">02 / Risk Engine</p>
          <h1 className="page-title">Layered Safety Defense</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            4-layer AI multi-modal evaluation before any surplus food leaves the kitchen.
          </p>
        </div>

        {/* Score Card */}
        <div
          className="fade-up-d1 card p-7 bg-white border border-[#e2e8e4] relative"
          style={{
            borderLeft: `4px solid ${riskColor}`,
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1">
                OVERALL RISK LEVEL
              </p>
              <p
                className="font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight"
                style={{ color: riskColor }}
              >
                {currentRisk.overallRisk.replace('_', ' / ')}
              </p>
            </div>

            <div
              className="p-3 px-5 rounded-2xl text-right"
              style={{ background: riskBg, border: `1.5px solid ${riskBorder}` }}
            >
              <p
                className="font-['Outfit'] font-black text-3xl sm:text-4xl leading-none"
                style={{ color: riskColor }}
              >
                {score}<span className="text-xs font-normal text-slate-500">/100</span>
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                Risk Index
              </p>
            </div>
          </div>

          {/* Score progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200 mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                background: `linear-gradient(90deg, #16a34a, ${riskColor})`,
              }}
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {currentRisk.summary}
          </p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-3">
            <Info size={12} className="text-[#16a34a]" /> Prototype algorithmic decision support · adheres to FSSAI Good Samaritan safety norms.
          </p>
        </div>

        {/* Defense Layers List */}
        <div className="fade-up-d2 space-y-3">
          <p className="font-['Outfit'] font-black text-base text-[#0d2e20]">
            Individual Layer Breakdown
          </p>
          {factors.map((f, i) => (
            <div
              key={i}
              className="card p-4 bg-white border border-[#e2e8e4] flex items-start gap-3.5"
            >
              {statusIcon(f.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-[#0d2e20]">{f.label}</p>
                  <span
                    className={`tag text-[10px] ${
                      f.status === 'PASS' ? 'tag-green' : f.status === 'FAIL' ? 'tag-red' : 'tag-amber'
                    }`}
                  >
                    {f.status}
                  </span>
                </div>
                <p className={`text-xs font-bold ${
                  f.status === 'PASS' ? 'text-[#16a34a]' : f.status === 'FAIL' ? 'text-red-600' : 'text-amber-700'
                }`}>
                  {f.metric}
                </p>
                <p className="text-xs text-slate-500 mt-1">{f.msg}</p>
                {f.photo && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img src={f.photo} alt="Food optical scan" className="w-16 h-12 rounded-lg object-cover border" />
                    <div className="text-[11px] text-slate-500 font-medium">
                      Captured food photo · Processed by Optical Inspection
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Token or Recovery Block */}
        <div className="fade-up-d3">
          {eligible ? (
            <div className="card p-6 bg-[#f0fdf4] border border-[#bbf7d0] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#16a34a]">
                    <Lock size={15} />
                  </div>
                  <div>
                    <h3 className="font-['Outfit'] font-bold text-sm text-[#0d2e20]">
                      Cryptographic Trust Token Issued
                    </h3>
                    <p className="text-[11px] text-[#15803d] font-mono font-bold">
                      {currentTrustToken.tokenId}
                    </p>
                  </div>
                </div>
                <span className="tag tag-green">Verified</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                HMAC-SHA256 signature guarantees food preparation time, holding temperature, and mess supervisor sign-off cannot be tampered with.
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => navigateTo('matching')}
                  className="btn-primary"
                >
                  Proceed to Receiver Matching <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-6 bg-[#fffbeb] border border-[#fde68a] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#d97706]">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h3 className="font-['Outfit'] font-bold text-sm text-[#92400e]">
                      Human Redistribution Blocked by AI
                    </h3>
                    <p className="text-[11px] text-amber-700">
                      Redirecting to Licensed Animal Feed & Composting
                    </p>
                  </div>
                </div>
                <span className="tag tag-amber">High Risk</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AnnaDhara safeguards vulnerable communities from bacterial food contamination. 100% of this batch will be diverted to Kamdhenu Gaushala cattle shelter.
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => navigateTo('recovery')}
                  className="btn-amber"
                >
                  View Green Recovery Pathway <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
