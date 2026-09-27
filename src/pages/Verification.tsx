import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, KeyRound, ArrowRight, Thermometer, Package, ShieldCheck } from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { currentPassport, verifyHandoverOtp, navigateTo } = useApp();
  const [otp, setOtp] = useState(currentPassport?.verificationOtp || '');
  const [verified, setVerified] = useState(currentPassport?.isOtpVerified || false);
  const [error, setError] = useState('');
  const [checks, setChecks] = useState({ temp: true, pack: true, supervisor: true });

  if (!currentPassport) return (
    <div className="min-h-[60vh] bg-[#f8faf9] flex items-center justify-center p-4">
      <div className="card p-8 text-center max-w-md bg-white border border-[#e2e8e4]">
        <p className="text-slate-500 text-sm">No active passport found. Please report food surplus first.</p>
        <button onClick={() => navigateTo('report')} className="btn-primary mt-4">
          Report Surplus
        </button>
      </div>
    </div>
  );

  const allChecked = checks.temp && checks.pack && checks.supervisor;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked) { setError('Please complete all 3 physical safety checks before handover.'); return; }
    const ok = verifyHandoverOtp(otp);
    if (ok) { setVerified(true); setError(''); }
    else setError('Invalid OTP. Please cross-check with the transport volunteer.');
  };

  const checklist = [
    { key: 'temp', icon: <Thermometer size={18} className="text-[#16a34a]" />, label: 'Temperature Audited', sub: `${currentPassport.surplus.temperatureCelsius}°C holding temp recorded at dispatch` },
    { key: 'pack', icon: <Package size={18} className="text-[#16a34a]" />, label: 'Sealed & Hygienic Packaging', sub: 'Tamper-evident food grade containers with lid locks' },
    { key: 'supervisor', icon: <ShieldCheck size={18} className="text-[#16a34a]" />, label: 'Kitchen Incharge Sign-off', sub: 'Visual appearance & aroma protocol passed' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-7">
        <div className="fade-up">
          <p className="step-indicator">04 / Verification Gate</p>
          <h1 className="page-title">Handover Sign-off</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Physical safety checklist + cryptographic OTP check before food exits the kitchen.
          </p>
        </div>

        {/* Safety checklist */}
        <div className="fade-up-d1 space-y-3">
          <p className="font-['Outfit'] font-black text-base text-[#0d2e20]">
            Dispatch Safety Checklist
          </p>
          {checklist.map(c => {
            const isChecked = checks[c.key as keyof typeof checks];
            return (
              <label
                key={c.key}
                className={`card p-4 flex items-center gap-4 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#f0fdf4] border-[#86efac]'
                    : 'bg-white border-[#e2e8e4] opacity-80'
                }`}
                style={{
                  borderLeft: isChecked ? '4px solid #16a34a' : '4px solid #e2e8e4',
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#bbf7d0] flex items-center justify-center shrink-0 shadow-xs">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#0d2e20]">{c.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.sub}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e => setChecks(p => ({ ...p, [c.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                />
              </label>
            );
          })}
        </div>

        {/* OTP Section */}
        <div className="fade-up-d2 card p-8 text-center bg-white border border-[#e2e8e4]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-[#16a34a]">
            <KeyRound size={24} />
          </div>

          <h3 className="font-['Outfit'] font-extrabold text-lg text-[#0d2e20]">
            Mutual Handover Security Code
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            Driver or transport volunteer presents this dynamic code at kitchen gate
          </p>

          {/* Show OTP */}
          <div className="inline-block font-mono text-3xl tracking-[0.3em] font-black text-[#15803d] bg-[#f0fdf4] px-8 py-3.5 rounded-2xl border-2 border-dashed border-[#86efac] mb-6 shadow-xs">
            {currentPassport.verificationOtp}
          </div>

          {!verified ? (
            <form onSubmit={handleVerify} className="max-w-xs mx-auto space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input-field text-center font-mono tracking-widest text-base font-bold"
                />
                <button type="submit" className="btn-primary shrink-0 px-5">
                  Verify
                </button>
              </div>
              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
            </form>
          ) : (
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-2 text-[#15803d] font-bold text-sm bg-[#f0fdf4] p-3 rounded-xl border border-[#bbf7d0]">
                <CheckCircle2 size={18} /> Verified & Legally Dispatched
              </div>
              <button
                type="button"
                onClick={() => navigateTo('passport')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                View Digital Food Passport <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
