import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle2, HelpCircle, Eye, RefreshCw } from 'lucide-react';
import { IMAGES } from '../data/imageConfig';
import { analyzeFoodVisualSignal, CVAnalysisResult } from '../services/cvService';
import { VisualSignal } from '../types';

interface CVInspectionCardProps {
  currentPhotoUrl?: string;
  initialSignal?: VisualSignal;
  onSignalUpdated: (signal: VisualSignal, notes: string) => void;
}

export const CVInspectionCard: React.FC<CVInspectionCardProps> = ({
  currentPhotoUrl = IMAGES.freshMeals.url,
  initialSignal = 'PASSED',
  onSignalUpdated
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentPhotoUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult>({
    signal: initialSignal,
    confidenceScore: 92,
    detectedAttributes: [
      'Active thermal vapor/steam detected',
      'Homogeneous consistency in lentils & rice',
      'Zero macroscopic discoloration'
    ],
    riskIndicators: [],
    disclaimer: 'Visual risk signal only. Does NOT establish microbial safety.',
    notes: 'No obvious optical defects or macroscopic signs of thermal degradation detected.'
  });

  const handleRunAnalysis = async (url: string) => {
    setSelectedImage(url);
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodVisualSignal(url, 'Cooked Food');
      setAnalysisResult(result);
      onSignalUpdated(result.signal, result.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleRunAnalysis(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <h4 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            Computer Vision Visual Risk Signal
          </h4>
          <p className="text-xs text-slate-400">
            Automated photographic surface signal analysis to detect visible steam, discolouration, or phase separation.
          </p>
        </div>

        {/* Status Indicator */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            analysisResult.signal === 'PASSED'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : analysisResult.signal === 'WARNING'
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }`}
        >
          {analysisResult.signal === 'PASSED' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : analysisResult.signal === 'WARNING' ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <HelpCircle className="w-3.5 h-3.5" />
          )}
          Visual Signal: {analysisResult.signal}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image Preview & Switcher */}
        <div>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
            <img
              src={selectedImage}
              alt="Food inspection photograph"
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-xs text-emerald-400">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                <span>Running optical anomaly detection...</span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-[10px] text-slate-300 font-mono">
              Live Inspection Frame
            </div>
          </div>

          {/* Quick Preset Samples & File Upload */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => handleRunAnalysis(IMAGES.freshMeals.url)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-xs hover:bg-emerald-900/50"
            >
              Test Fresh Sample (Pass)
            </button>

            <button
              type="button"
              onClick={() => handleRunAnalysis(IMAGES.cvInspectionQuestionable.url)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs hover:bg-rose-900/50"
            >
              Test Stagnant Sample (Warning)
            </button>
          </div>
        </div>

        {/* Right: Detected Attributes & Stat */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Optical Confidence Index</span>
              <span className="font-mono font-bold text-white">{analysisResult.confidenceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  analysisResult.signal === 'PASSED'
                    ? 'bg-emerald-500 w-[92%]'
                    : analysisResult.signal === 'WARNING'
                    ? 'bg-rose-500 w-[84%]'
                    : 'bg-amber-500 w-[62%]'
                }`}
              />
            </div>

            <div className="mt-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                Detected Optical Attributes
              </span>
              <ul className="space-y-1.5 text-xs">
                {analysisResult.detectedAttributes.map((attr, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{attr}</span>
                  </li>
                ))}
                {analysisResult.riskIndicators.map((risk, idx) => (
                  <li key={`risk-${idx}`} className="flex items-start gap-2 text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mandatory Safety Rule Alert */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Rule of Truth: </strong>
              Computer vision provides a <em>visual risk signal</em> only. Microbial safety requires time-temperature discipline and supervisor verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
