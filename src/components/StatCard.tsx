import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  highlightColor?: 'emerald' | 'amber' | 'blue' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  trendPositive = true,
  highlightColor = 'emerald'
}) => {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[highlightColor]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
          {value}
        </div>
        {(subValue || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-semibold ${
                  trendPositive ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {trend}
              </span>
            )}
            {subValue && <span className="text-slate-400">{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
