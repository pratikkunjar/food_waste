import React from 'react';
import { TimelineEvent } from '../types';
import { CheckCircle2, Clock, CircleDot } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {events.map((event, index) => {
        return (
          <div key={index} className="relative flex items-start gap-4 group">
            {/* Step Icon Indicator */}
            <div className="absolute -left-6 mt-1 flex items-center justify-center">
              {event.completed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : event.active ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300 animate-pulse">
                  <CircleDot className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  <Clock className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* Event Content */}
            <div
              className={`p-3.5 rounded-xl border transition-all w-full text-xs ${
                event.completed
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : event.active
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-900/30 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span
                  className={`font-bold font-['Outfit'] text-sm ${
                    event.completed
                      ? 'text-white'
                      : event.active
                      ? 'text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  {event.title}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{event.timestamp}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">{event.description}</p>
              <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5">
                <span>Verified by:</span>
                <strong className="text-slate-400">{event.actor}</strong>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
