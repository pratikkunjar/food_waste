import React from 'react';
import { TrustToken, SurplusReport, RiskAssessment } from '../types';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Fingerprint, Lock, Info, ShieldAlert } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface TrustTokenCardProps {
  token: TrustToken;
  surplus: SurplusReport;
  risk: RiskAssessment;
}

export const TrustTokenCard: React.FC<TrustTokenCardProps> = ({ token, surplus, risk }) => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 overflow-hidden">
      {/* Decorative background grid and watermark */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-4 right-4 opacity-10">
        <Fingerprint className="w-32 h-32 text-emerald-400" />
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                TRUST TOKEN
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                PROTOTYPE DEFENSE RECORD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Token ID: <span className="text-emerald-400 font-bold">{token.tokenId}</span>
            </p>
          </div>
        </div>

        <RiskBadge level={risk.overallRisk} score={risk.riskScore} size="sm" />
      </div>

      {/* Core Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6 text-xs">
        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800">
          <span className="text-slate-400 block mb-1">Food Item & Quantity</span>
          <p className="text-sm font-semibold text-white">{surplus.foodType}</p>
          <p className="text-emerald-400 font-bold mt-0.5">
            {surplus.quantity} {surplus.quantityUnit} ({surplus.category})
          </p>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800">
          <span className="text-slate-400 block mb-1">Source & Kitchen</span>
          <p className="text-sm font-semibold text-white">{surplus.sourceKitchen}</p>
          <p className="text-slate-400 mt-0.5">{surplus.location}</p>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800">
          <span className="text-slate-400 block mb-1">Time & Thermal Holding</span>
          <p className="text-sm font-semibold text-white">
            Cooked: {surplus.preparedTime} | Reported: {surplus.reportedTime}
          </p>
          <p className="text-emerald-300 mt-0.5">
            Temp: {surplus.temperatureCelsius}°C ({surplus.storageCondition})
          </p>
        </div>
      </div>

      {/* Layered Defense Checks Status */}
      <div className="border-t border-slate-800/80 pt-5">
        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Layered Food Safety Defense Verification Status
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Time Check */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex items-start gap-2.5">
            {risk.timeFactor.status === 'PASS' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : risk.timeFactor.status === 'WARN' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-200">Time Window</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{risk.timeFactor.metric}</p>
              <span
                className={`inline-block text-[10px] mt-1 font-medium ${
                  risk.timeFactor.status === 'PASS'
                    ? 'text-emerald-400'
                    : risk.timeFactor.status === 'WARN'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {risk.timeFactor.status === 'PASS' ? 'Passed' : risk.timeFactor.status === 'WARN' ? 'Warning' : 'Violation'}
              </span>
            </div>
          </div>

          {/* Temperature Check */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex items-start gap-2.5">
            {risk.tempFactor.status === 'PASS' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : risk.tempFactor.status === 'WARN' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-200">Thermal Integrity</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{risk.tempFactor.metric}</p>
              <span
                className={`inline-block text-[10px] mt-1 font-medium ${
                  risk.tempFactor.status === 'PASS'
                    ? 'text-emerald-400'
                    : risk.tempFactor.status === 'WARN'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {risk.tempFactor.status === 'PASS' ? 'Passed (>60°C)' : risk.tempFactor.status === 'WARN' ? 'Caution' : 'Danger Zone'}
              </span>
            </div>
          </div>

          {/* CV Signal Check */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex items-start gap-2.5">
            {risk.cvFactor.status === 'PASS' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : risk.cvFactor.status === 'FAIL' ? (
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-200">CV Visual Signal</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{risk.cvFactor.metric}</p>
              <span className={`inline-block text-[10px] mt-1 font-medium ${
                risk.cvFactor.status === 'PASS' ? 'text-emerald-400' : risk.cvFactor.status === 'FAIL' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {risk.cvFactor.status === 'PASS' ? 'Photo Verified Clean' : risk.cvFactor.status === 'FAIL' ? 'Defects Detected' : 'Scan Skipped (No Photo)'}
              </span>
            </div>
          </div>

          {/* Human Gate */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">Human Sensory Gate</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{risk.humanGate.verifiedBy || 'Supervisor'}</p>
              <span className="inline-block text-[10px] mt-1 text-emerald-400 font-medium">
                Signed at Kitchen
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Hash & Mandatory Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="font-mono flex items-center gap-1.5 text-slate-400 truncate">
          <Fingerprint className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Digest: {token.hash}</span>
          <span className="text-slate-600">({token.tamperProofProof})</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Issued: {new Date(token.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Statutory Clarification Alert */}
      <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">Note:</strong> An evidence-backed prototype record used to support redistribution decisions and traceability. Not an official government food safety certificate.
        </p>
      </div>
    </div>
  );
};
