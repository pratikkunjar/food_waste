import React, { useState } from 'react';
import { FoodPassport } from '../types';
import { CheckCircle2, ShieldCheck, KeyRound, Sparkles, AlertCircle, Thermometer } from 'lucide-react';

interface VerificationCardProps {
  passport: FoodPassport;
  onVerifyOtp: (otp: string) => boolean;
  onProceedToPassport: () => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  passport,
  onVerifyOtp,
  onProceedToPassport
}) => {
  const [enteredOtp, setEnteredOtp] = useState(passport.verificationOtp || '492810');
  const [tempChecked, setTempChecked] = useState(true);
  const [packagingChecked, setPackagingChecked] = useState(true);
  const [supervisorSigned, setSupervisorSigned] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(passport.isOtpVerified);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempChecked || !packagingChecked || !supervisorSigned) {
      setErrorMessage('Please complete all 3 physical safety handover checklist items first.');
      return;
    }

    const success = onVerifyOtp(enteredOtp);
    if (success) {
      setVerificationSuccess(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid handover code. Please check with logistics driver.');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Layered Human + Digital Handover Gate
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            Mutual Pickup Verification & Handover Sign-off
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Kitchen staff and transport volunteer verify food quantity, container seals, and thermal temperature.
          </p>
        </div>

        {verificationSuccess && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Handover Legally Verified
          </span>
        )}
      </div>

      {/* Handover Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Checklist 1: Temp */}
        <label
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            tempChecked
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="w-5 h-5 text-emerald-400" />
            <input
              type="checkbox"
              checked={tempChecked}
              onChange={(e) => setTempChecked(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <p className="text-sm font-bold text-white">Temperature Check</p>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed {passport.surplus.temperatureCelsius}°C holding condition at dispatch.
          </p>
        </label>

        {/* Checklist 2: Packaging */}
        <label
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            packagingChecked
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <input
              type="checkbox"
              checked={packagingChecked}
              onChange={(e) => setPackagingChecked(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <p className="text-sm font-bold text-white">Food-Grade Packaging</p>
          <p className="text-xs text-slate-400 mt-1">
            Clean insulated containers with tamper-evident seal verified.
          </p>
        </label>

        {/* Checklist 3: Supervisor Sign */}
        <label
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            supervisorSigned
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <input
              type="checkbox"
              checked={supervisorSigned}
              onChange={(e) => setSupervisorSigned(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <p className="text-sm font-bold text-white">Supervisor Sensory Sign-off</p>
          <p className="text-xs text-slate-400 mt-1">
            Odor, visual appearance, and hygiene sensory check cleared.
          </p>
        </label>
      </div>

      {/* OTP Section */}
      <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 max-w-xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <KeyRound className="w-6 h-6" />
        </div>

        <div>
          <h4 className="text-lg font-bold text-white">Mutual Handover OTP</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            The receiver driver ({passport.matchedReceiver?.contactPerson || 'Logistics Coordinator'}) presents this code upon arrival at {passport.surplus.sourceKitchen}.
          </p>
        </div>

        {/* Highlighted OTP Display */}
        <div className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 font-mono text-2xl tracking-[0.3em] font-extrabold text-emerald-400 shadow-inner">
          {passport.verificationOtp}
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              maxLength={6}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono text-base font-bold text-white tracking-widest focus:outline-none focus:border-emerald-500 w-48"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
              Verify OTP
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 flex items-center justify-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMessage}
            </p>
          )}
        </form>

        {verificationSuccess && (
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onProceedToPassport}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate & View Digital Food Passport</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
