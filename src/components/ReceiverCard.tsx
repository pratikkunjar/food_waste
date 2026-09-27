import React from 'react';
import { Receiver } from '../types';
import { MapPin, Truck, CheckCircle2, ShieldCheck, Star, Users } from 'lucide-react';

interface ReceiverCardProps {
  receiver: Receiver;
  isSelected?: boolean;
  onSelect: (receiver: Receiver) => void;
  requiredQuantity?: number;
}

export const ReceiverCard: React.FC<ReceiverCardProps> = ({
  receiver,
  isSelected = false,
  onSelect,
  requiredQuantity = 40
}) => {
  const isCapacitySufficient = receiver.capacityMeals >= requiredQuantity;

  return (
    <div
      onClick={() => onSelect(receiver)}
      className={`glass-panel rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500 shadow-xl shadow-emerald-950/30'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
          SELECTED MATCH
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-white font-['Outfit']">{receiver.name}</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{receiver.distanceKm} km away</span>
            <span className="text-slate-600">•</span>
            <span className="truncate">{receiver.address}</span>
          </p>
        </div>

        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300 shrink-0">
          {receiver.type}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-800/80 text-xs text-center">
        <div className="bg-slate-900/60 rounded-xl p-2">
          <span className="text-slate-400 block text-[10px] uppercase">Capacity</span>
          <span
            className={`font-bold ${
              isCapacitySufficient ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {receiver.capacityMeals} meals
          </span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2">
          <span className="text-slate-400 block text-[10px] uppercase">Acceptance</span>
          <span className="font-bold text-white">{receiver.acceptanceRate}%</span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2">
          <span className="text-slate-400 block text-[10px] uppercase">Rating</span>
          <span className="font-bold text-amber-400 flex items-center justify-center gap-0.5">
            <Star className="w-3 h-3 fill-amber-400" />
            {receiver.rating}
          </span>
        </div>
      </div>

      {/* Pickup & Verification Details */}
      <div className="space-y-1.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            Pickup: <strong className="text-white">{receiver.hasPickup ? 'Available' : 'Self-Dispatch'}</strong>
            {receiver.vehicleType && <span className="text-slate-400"> ({receiver.vehicleType})</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] text-slate-400">
            Reg: {receiver.fssaiOrDarpanId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            POC: {receiver.contactPerson} ({receiver.contactPhone})
          </span>
        </div>
      </div>

      {/* Button */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(receiver);
          }}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isSelected
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-200 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isSelected ? 'Matched Receiver Selected' : 'Select This Receiver'}</span>
        </button>
      </div>
    </div>
  );
};
