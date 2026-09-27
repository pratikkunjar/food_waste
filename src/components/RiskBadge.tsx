import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, size = 'md' }) => {
  const configs = {
    LOW: {
      label: 'LOW RISK',
      sublabel: 'Eligible for Redistribution',
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      badgeColor: 'bg-emerald-500',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      sublabel: 'Eligible with Rapid Window',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      badgeColor: 'bg-amber-500',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    HIGH_UNCERTAIN: {
      label: 'HIGH / UNCERTAIN RISK',
      sublabel: 'Recovery Pathway Diverted',
      color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      badgeColor: 'bg-rose-500',
      icon: <ShieldAlert className="w-4 h-4" />
    }
  };

  const config = configs[level] || configs.LOW;

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.badgeColor} animate-pulse`} />
        {config.label}
        {score !== undefined && <span className="opacity-80">({score}/100)</span>}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-3 flex items-center justify-between ${config.color}`}>
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-slate-900/60">{config.icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide">{config.label}</span>
            <span className={`w-2 h-2 rounded-full ${config.badgeColor} animate-ping`} />
          </div>
          <p className="text-xs opacity-90">{config.sublabel}</p>
        </div>
      </div>
      {score !== undefined && (
        <div className="text-right">
          <div className="text-lg font-black font-mono">{score}/100</div>
          <span className="text-[10px] uppercase tracking-wider opacity-75">Risk Index</span>
        </div>
      )}
    </div>
  );
};
