import React, { useState } from 'react';
import { FoodPassport } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
  Leaf,
  Droplets,
  ExternalLink
} from 'lucide-react';
import { Timeline } from './Timeline';
import { RiskBadge } from './RiskBadge';

interface FoodPassportCardProps {
  passport: FoodPassport;
  onDispatchPickup: () => void;
  onCompleteRedistribution: () => void;
}

export const FoodPassportCard: React.FC<FoodPassportCardProps> = ({
  passport,
  onDispatchPickup,
  onCompleteRedistribution
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const isRedistributed = passport.outcome === 'REDISTRIBUTED' || passport.redistributionCompleted;
  const isPickedUp = passport.pickupCompleted;

  return (
    <div className="space-y-6">
      {/* Passport Certificate Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl shadow-emerald-950/40 overflow-hidden">
        {/* Decorative Watermarks & Header */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-600/30">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-400">
                <QrCode className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                  FOOD PASSPORT
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  SIH 2026 VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Passport ID: <span className="text-emerald-400 font-bold">{passport.passportId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge
              level={passport.riskAssessment.overallRisk}
              score={passport.riskAssessment.riskScore}
              size="sm"
            />
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print Passport"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => alert(`Public verification URL copied: https://annadhara.in/passport/${passport.passportId}`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Share Verification Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Core Passport Info & QR Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          {/* Left: Food & Kitchen Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800">
                <span className="text-slate-400 block mb-1 uppercase font-semibold text-[10px]">
                  Food Batch Details
                </span>
                <p className="text-base font-bold text-white">{passport.surplus.foodType}</p>
                <p className="text-emerald-400 font-semibold mt-1">
                  {passport.surplus.quantity} {passport.surplus.quantityUnit} ({passport.surplus.category})
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800">
                <span className="text-slate-400 block mb-1 uppercase font-semibold text-[10px]">
                  Institutional Source
                </span>
                <p className="text-base font-bold text-white">{passport.surplus.sourceKitchen}</p>
                <p className="text-slate-400 mt-1">{passport.surplus.location}</p>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800">
                <span className="text-slate-400 block mb-1 uppercase font-semibold text-[10px]">
                  Matched Receiver
                </span>
                <p className="text-base font-bold text-white">
                  {passport.matchedReceiver?.name || 'Asha Community Kitchen'}
                </p>
                <p className="text-slate-400 mt-1">
                  Type: {passport.matchedReceiver?.type} | {passport.matchedReceiver?.distanceKm} km away
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800">
                <span className="text-slate-400 block mb-1 uppercase font-semibold text-[10px]">
                  Safety & Trust Anchor
                </span>
                <p className="text-sm font-bold text-white font-mono">
                  Trust Token: {passport.trustToken.tokenId}
                </p>
                <p className="text-emerald-400 mt-1 font-mono text-[11px] truncate">
                  Digest: {passport.trustToken.hash.slice(0, 16)}...
                </p>
              </div>
            </div>

            {/* Environmental Impact Savings Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/20 flex flex-wrap items-center justify-around gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">CO2 Emissions Avoided</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    ~{passport.co2SavedKg} kg CO₂e
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Virtual Water Saved</span>
                  <span className="text-lg font-black text-teal-300 font-mono">
                    ~{passport.waterSavedLiters.toLocaleString()} Litres
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive QR Code */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div
              onClick={() => setShowQrModal(true)}
              className="p-3 bg-white rounded-2xl shadow-xl shadow-black/60 cursor-pointer hover:scale-105 transition-transform"
            >
              <QRCodeSVG
                value={passport.qrValue}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-xs font-bold text-white mt-3">Scan to Verify Food Passport</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instant public verification for receivers & audit inspectors
            </p>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <span>View Full Passport Modal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Audit Timeline Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                End-to-End Verifiable Journey Timeline
              </h4>
              <p className="text-xs text-slate-400">
                Immutable trace of cooking, reporting, risk scoring, mutual handover, and community plate delivery.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
              Traceability Audit Trail
            </span>
          </div>

          <Timeline events={passport.timeline} />
        </div>

        {/* Live Operational Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Operational State: </span>
            <strong className="text-white">
              {isRedistributed
                ? 'Delivery Completed & Logged'
                : isPickedUp
                ? 'In-Transit via EV Van'
                : 'Verified & Awaiting Dispatch'}
            </strong>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isPickedUp && !isRedistributed && (
              <button
                type="button"
                onClick={onDispatchPickup}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Mark Insulated Vehicle Dispatched</span>
              </button>
            )}

            {!isRedistributed ? (
              <button
                type="button"
                onClick={onCompleteRedistribution}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Dignified Nourishment Delivered</span>
              </button>
            ) : (
              <div className="px-5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Full Rescue Lifecycle Complete! Impact Recorded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal Pop-up */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-sm w-full rounded-3xl p-6 border border-emerald-500/40 text-center space-y-4 shadow-2xl"
          >
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              <QRCodeSVG value={passport.qrValue} size={200} level="H" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Digital Food Passport</h4>
            <p className="text-xs text-slate-400 font-mono">{passport.passportId}</p>
            <div className="text-left text-xs bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1">
              <p><strong>Item:</strong> {passport.surplus.foodType}</p>
              <p><strong>Quantity:</strong> {passport.surplus.quantity} {passport.surplus.quantityUnit}</p>
              <p><strong>Source:</strong> {passport.surplus.sourceKitchen}</p>
              <p><strong>Trust Token:</strong> {passport.trustToken.tokenId}</p>
              <p className="text-emerald-400"><strong>Status:</strong> Verified Safe</p>
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Close Passport
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
