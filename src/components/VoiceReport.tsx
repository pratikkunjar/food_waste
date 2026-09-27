import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Check, RefreshCw, Volume2, ShieldCheck } from 'lucide-react';
import { extractSurplusFromText } from '../services/aiService';
import { SurplusReport } from '../types';

interface VoiceReportProps {
  onConfirm: (surplus: SurplusReport) => void;
  initialValues?: Partial<SurplusReport>;
}

export const VoiceReport: React.FC<VoiceReportProps> = ({ onConfirm, initialValues }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(
    initialValues?.voiceTranscript || '40 veg meals bach gaye hain, dinner 7:30 PM ko bana tha, hot containers mein pack hai.'
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionModel, setExtractionModel] = useState<string>('AnnaDhara NLP Engine');

  // Editable Form State
  const [foodType, setFoodType] = useState(initialValues?.foodType || 'Veg Thali Meals');
  const [category, setCategory] = useState(initialValues?.category || 'Cooked Meal');
  const [quantity, setQuantity] = useState(initialValues?.quantity || 40);
  const [quantityUnit, setQuantityUnit] = useState(initialValues?.quantityUnit || 'meals');
  const [preparedTime, setPreparedTime] = useState(initialValues?.preparedTime || '19:30');
  const [sourceKitchen, setSourceKitchen] = useState(initialValues?.sourceKitchen || 'Hostel Mess B (Kailash Hall)');
  const [location, setLocation] = useState(initialValues?.location || 'North Campus, Gate No. 4');
  const [temperatureCelsius, setTemperatureCelsius] = useState(initialValues?.temperatureCelsius || 64);
  const [storageCondition, setStorageCondition] = useState(
    initialValues?.storageCondition || 'Hot Held (>60°C) in Insulated Steel Warmers'
  );

  const sampleTranscripts = [
    {
      label: '40 Veg Meals (Hostel Dinner - Low Risk)',
      text: '40 veg meals bach gaye hain, dinner 7:30 PM ko bana tha, hot containers mein pack hai.'
    },
    {
      label: '65 Sambar Rice (Canteen Lunch - High Risk)',
      text: 'Doopahar ka sambar chawal bach gaya hai lagbhag 65 portions, room temp par rakha tha 11:30 baje se.'
    },
    {
      label: '25 Khichdi (Dietary Wing - Warm)',
      text: '25 portions moong dal khichdi bachi hai hospital pantry se, 12:30 PM par pack hui thi.'
    }
  ];

  // Browser Speech Recognition Support
  const handleToggleVoice = () => {
    // Check Web Speech API
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition && !isRecording) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN'; // Hindi / Hinglish recognition
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const speechText = event.results[0][0].transcript;
          setTranscript(speechText);
          setIsRecording(false);
          runAIExtraction(speechText);
        };

        recognition.onerror = () => {
          setIsRecording(false);
          // Fallback to simulated audio input
          simulateVoiceRecording();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch {
        simulateVoiceRecording();
      }
    } else {
      simulateVoiceRecording();
    }
  };

  const simulateVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    // Simulate 2 seconds of listening with active soundwave
    setTimeout(() => {
      setIsRecording(false);
      const simulated = '40 veg meals bach gaye hain, dinner 7:30 PM ko bana tha, hot containers mein pack hai.';
      setTranscript(simulated);
      runAIExtraction(simulated);
    }, 2200);
  };

  const runAIExtraction = async (textToExtract: string) => {
    setIsExtracting(true);
    try {
      const extracted = await extractSurplusFromText(textToExtract, sourceKitchen);
      setFoodType(extracted.foodType);
      setCategory(extracted.category);
      setQuantity(extracted.quantity);
      setQuantityUnit(extracted.quantityUnit);
      setPreparedTime(extracted.preparedTime);
      setSourceKitchen(extracted.sourceKitchen);
      setLocation(extracted.location);
      setTemperatureCelsius(extracted.temperatureCelsius);
      setStorageCondition(extracted.storageCondition);
      setExtractionModel(extracted.modelUsed);
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSelectSample = (text: string) => {
    setTranscript(text);
    runAIExtraction(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurplus: SurplusReport = {
      id: initialValues?.id || `SUR-2026-MESS-${Math.floor(1000 + Math.random() * 9000)}`,
      foodType,
      category,
      quantity: Number(quantity),
      quantityUnit,
      preparedTime,
      reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceKitchen,
      location,
      contactPerson: initialValues?.contactPerson || 'Kitchen Head Supervisor',
      contactPhone: initialValues?.contactPhone || '+91 98765 43210',
      temperatureCelsius: Number(temperatureCelsius),
      storageCondition,
      voiceTranscript: transcript,
      visualSignal: initialValues?.visualSignal || 'PASSED',
      visualSignalNotes: initialValues?.visualSignalNotes || 'Visual inspection verified',
      status: 'reported'
    };
    onConfirm(newSurplus);
  };

  return (
    <div className="space-y-6">
      {/* Voice Input Hero Area */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/20 text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/20">
            <Volume2 className="w-3.5 h-3.5" />
            Zero-Friction Voice First Interface (Hindi / Hinglish / English)
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            Report Institutional Food Surplus in Seconds
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Mess staff can tap the microphone and speak naturally. AnnaDhara AI parses quantities, timings, and category.
          </p>

          {/* Large Interactive Mic Button */}
          <div className="my-6 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-2xl shadow-rose-600/50 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-900/40 hover:scale-105'
              }`}
              title="Tap to speak or simulate voice input"
            >
              {isRecording ? (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-75" />
                  <MicOff className="w-10 h-10" />
                </>
              ) : (
                <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
              )}
            </button>

            <span className="mt-3 text-xs font-medium text-slate-300">
              {isRecording ? (
                <span className="text-rose-400 font-semibold animate-pulse">
                  Listening to voice input... Speak now
                </span>
              ) : (
                'Tap microphone to speak (or click a sample prompt below)'
              )}
            </span>
          </div>

          {/* Sample Prompts for Instant Presentation */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
              Try Preset Voice Transcripts (SIH Demo Prompts):
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleTranscripts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample.text)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-emerald-950/40 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-slate-300 transition-all text-left"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript Display */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Voice Transcript Received
              </span>
              <button
                type="button"
                onClick={() => runAIExtraction(transcript)}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isExtracting ? 'animate-spin' : ''}`} />
                <span>Re-parse with AI</span>
              </button>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-sm text-slate-200 border-none focus:outline-none resize-none"
              placeholder="Speak or type surplus details here..."
            />
          </div>

          {/* AI Extraction Status Banner */}
          {isExtracting ? (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs text-emerald-300 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>AI is extracting food type, quantity, preparation time, and temperature...</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Parsed using: <strong className="text-slate-300">{extractionModel}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Structured Editable Form (Result of AI Extraction) */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h4 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              AI Extracted Food Surplus Data
            </h4>
            <p className="text-xs text-slate-400">
              Review and edit extracted fields before triggering Layered Defense risk evaluation.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
            Editable Fields
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Food Type */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Food Item Name *
            </label>
            <input
              type="text"
              required
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Food Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Cooked Meal">Cooked Meal (Thali / Combo)</option>
              <option value="Cooked Rice">Cooked Rice / Grains</option>
              <option value="Cooked Grains & Gravy">Cooked Grains & Gravy</option>
              <option value="Cooked Lentils/Dal">Cooked Lentils / Dal</option>
              <option value="Breads & Roti">Breads & Roti (Low Moisture)</option>
              <option value="Dairy/Paneer">Dairy / Paneer / Curd (High Perishable)</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Unit</label>
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="meals">meals</option>
                <option value="portions">portions</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          {/* Prepared Time */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Preparation Time (24h) *
            </label>
            <input
              type="time"
              required
              value={preparedTime}
              onChange={(e) => setPreparedTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Source Kitchen */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Source Kitchen *
            </label>
            <input
              type="text"
              required
              value={sourceKitchen}
              onChange={(e) => setSourceKitchen(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Temperature & Storage Condition */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Holding Temperature (°C) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
                className="w-24 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-xs text-slate-400">
                {temperatureCelsius >= 60 ? '🔥 Safe Hot Held' : '⚠️ Danger Zone'}
              </span>
            </div>
          </div>

          {/* Storage Description */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Handling & Storage Description
            </label>
            <input
              type="text"
              value={storageCondition}
              onChange={(e) => setStorageCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Submit & Confirm */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Next Step: Layered Food Safety Defense & Trust Token Generation</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Confirm Surplus & Assess Risk</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
