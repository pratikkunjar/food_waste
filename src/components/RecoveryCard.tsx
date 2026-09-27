import React, { useState } from 'react';
import { SurplusReport, RiskAssessment, TrustToken } from '../types';
import { IMAGES } from '../data/imageConfig';
import { ImageWithFallback } from './ImageWithFallback';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface RecoveryCardProps {
  surplus: SurplusReport;
  risk: RiskAssessment;
  token: TrustToken;
  onProcessRecovery: (pathway: 'ANIMAL_FEED' | 'COMPOSTING') => void;
}

export const RecoveryCard: React.FC<RecoveryCardProps> = ({
  surplus,
  risk,
  token,
  onProcessRecovery
}) => {
  const [selectedPathway, setSelectedPathway] = useState<'ANIMAL_FEED' | 'COMPOSTING'>(
    risk.recommendedPathway === 'COMPOSTING' ? 'COMPOSTING' : 'ANIMAL_FEED'
  );
  const [isProcessed, setIsProcessed] = useState(false);

  const handleConfirm = () => {
    setIsProcessed(true);
    onProcessRecovery(selectedPathway);
  };

  return (
    <div className="space-y-6">
      {/* High Risk Halt Alert */}
      <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 p-5 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-rose-300 font-['Outfit']">
              Redistribution Blocked: Layered Food Safety Guard Active
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
              NON-REDISTRIBUTABLE
            </span>
          </div>
          <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
            The surplus batch (<strong className="text-white">{surplus.foodType}</strong>, {surplus.quantity} {surplus.quantityUnit}) was prepared at {surplus.preparedTime} and held at {surplus.temperatureCelsius}°C ({surplus.storageCondition}), violating critical safe holding parameters.
          </p>
          <p className="text-xs text-slate-300 mt-2">
            <strong>AnnaDhara Safeguard: </strong> Unsafe food is NEVER forced to human receivers. Instead, it is seamlessly diverted to verified green recovery pathways so zero surplus goes to landfill.
          </p>
        </div>
      </div>

      {/* Branching Pathways Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pathway 1: Animal Feed */}
        <div
          onClick={() => setSelectedPathway('ANIMAL_FEED')}
          className={`glass-panel rounded-2xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            selectedPathway === 'ANIMAL_FEED'
              ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500 shadow-xl shadow-amber-950/30'
              : 'border-slate-800 hover:border-slate-700 opacity-80'
          }`}
        >
          <div>
            <div className="h-44 rounded-xl overflow-hidden mb-4 bg-slate-950">
              <ImageWithFallback
                src={IMAGES.animalRecovery.url}
                alt={IMAGES.animalRecovery.alt}
                credit={IMAGES.animalRecovery.credit}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-white font-['Outfit']">
                Pathway A: Licensed Animal Feed
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Safe Herbivore Fodder
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Diverts safe vegetarian grains, rice, and cooked lentils to licensed gaushalas (cattle sanctuaries) and animal welfare partners.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <p><strong>Permitted:</strong> Clean vegetarian food, dal, boiled grains, rotis.</p>
              <p><strong>Strict Restriction:</strong> Zero non-veg, zero plastics, zero excessive pungent spices.</p>
              <p><strong>Partner:</strong> Kamdhenu Gaushala & Animal Welfare Trust (5.2 km away).</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-400">
              {selectedPathway === 'ANIMAL_FEED' ? '✓ Selected Recovery Pathway' : 'Click to Select'}
            </span>
            <span className="text-[10px] text-slate-500">AWBI Licensed</span>
          </div>
        </div>

        {/* Pathway 2: Campus Aerobic Composting */}
        <div
          onClick={() => setSelectedPathway('COMPOSTING')}
          className={`glass-panel rounded-2xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            selectedPathway === 'COMPOSTING'
              ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500 shadow-xl shadow-emerald-950/30'
              : 'border-slate-800 hover:border-slate-700 opacity-80'
          }`}
        >
          <div>
            <div className="h-44 rounded-xl overflow-hidden mb-4 bg-slate-950">
              <ImageWithFallback
                src={IMAGES.composting.url}
                alt={IMAGES.composting.alt}
                credit={IMAGES.composting.credit}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-white font-['Outfit']">
                Pathway B: Campus Aerobic Composting
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Bio-Nutrient Soil Regeneration
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Converts spoiled gravies, stale batters, or high-risk wet surplus into rich organic compost for university botanical gardens.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <p><strong>Process:</strong> High-temperature aerobic microbial breakdown.</p>
              <p><strong>Landfill Avoidance:</strong> 100% organic matter recycled on-campus.</p>
              <p><strong>Partner:</strong> Campus Bio-Composting Unit (Green Cell - 0.8 km away).</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400">
              {selectedPathway === 'COMPOSTING' ? '✓ Selected Recovery Pathway' : 'Click to Select'}
            </span>
            <span className="text-[10px] text-slate-500">Zero Direct Landfill</span>
          </div>
        </div>
      </div>

      {/* Confirmation & Recovery Receipt Generator */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-4">
        {!isProcessed ? (
          <div>
            <h4 className="text-base font-bold text-white">
              Dispatch to {selectedPathway === 'ANIMAL_FEED' ? 'Licensed Animal Feed' : 'Campus Bio-Composting'}
            </h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
              Issue an immutable Green Diversion Receipt linking Trust Token #{token.tokenId} to this recovery facility.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs shadow-xl shadow-amber-950/40 transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>Authorize Green Recovery Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-sm text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Green Recovery Diversion Logged & Certified!</span>
            </div>
            <p className="text-slate-300">
              {surplus.quantity} {surplus.quantityUnit} successfully diverted to{' '}
              {selectedPathway === 'ANIMAL_FEED' ? 'Kamdhenu Gaushala' : 'Campus Composting Unit 2'}. Zero food entered landfill.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Receipt: REC-DIV-{token.tokenId}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Impact Updated in Sustainability Dashboard
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
