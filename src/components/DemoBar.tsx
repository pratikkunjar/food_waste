import React from 'react';
import { useApp } from '../context/AppContext';
import { PlayCircle, ShieldAlert, RotateCcw, Sparkles } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { demoMode, loadSafeDemo, loadHighRiskDemo, resetDemo } = useApp();
  return (
    <div
      style={{
        background: '#091c14',
        borderBottom: '1px solid rgba(52, 211, 153, 0.15)',
        padding: '9px 20px',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
          <Sparkles size={12} className="text-[#f59e0b]" />
          <span>Interactive Prototype Simulation Controls:</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={loadSafeDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              border: demoMode === 'safe' ? '1.5px solid #34d399' : '1px solid rgba(255, 255, 255, 0.12)',
              background: demoMode === 'safe' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: demoMode === 'safe' ? '#6ee7b7' : '#cbd5e1',
              transition: 'all 0.15s ease',
            }}
          >
            <PlayCircle size={13} className={demoMode === 'safe' ? 'text-[#34d399]' : 'text-slate-400'} />
            Scenario A (Safe Redistribution)
          </button>
          <button
            onClick={loadHighRiskDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              border: demoMode === 'high-risk' ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
              background: demoMode === 'high-risk' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: demoMode === 'high-risk' ? '#fcd34d' : '#cbd5e1',
              transition: 'all 0.15s ease',
            }}
          >
            <ShieldAlert size={13} className={demoMode === 'high-risk' ? 'text-[#f59e0b]' : 'text-slate-400'} />
            Scenario B (Unsafe Safeguard)
          </button>
          <button
            onClick={resetDemo}
            title="Reset to default"
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
