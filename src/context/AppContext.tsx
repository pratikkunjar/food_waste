import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SurplusReport,
  RiskAssessment,
  TrustToken,
  Receiver,
  FoodPassport,
  ImpactStats,
  VisualSignal
} from '../types';
import {
  SAFE_SCENARIO_SURPLUS,
  HIGH_RISK_SCENARIO_SURPLUS,
  RECENT_SURPLUS_HISTORY
} from '../data/demoFoodData';
import { DEMO_RECEIVERS } from '../data/demoReceiverData';
import { INITIAL_IMPACT_STATS } from '../data/demoImpactData';
import { evaluateSurplusRisk, generateTrustToken } from '../services/riskService';
import { getAvailableReceivers, createFoodPassport } from '../services/matchingService';
import confetti from 'canvas-confetti';

export type PageId =
  | 'landing'
  | 'dashboard'
  | 'report'
  | 'risk'
  | 'trust-token'
  | 'matching'
  | 'verification'
  | 'passport'
  | 'recovery'
  | 'impact';

interface AppContextType {
  activePage: PageId;
  navigateTo: (page: PageId) => void;
  currentSurplus: SurplusReport;
  currentRisk: RiskAssessment;
  currentTrustToken: TrustToken;
  availableReceivers: Receiver[];
  matchedReceiver: Receiver | null;
  currentPassport: FoodPassport | null;
  surplusHistory: SurplusReport[];
  impactStats: ImpactStats;
  demoMode: 'safe' | 'high-risk' | 'custom';
  
  // Actions
  loadSafeDemo: () => void;
  loadHighRiskDemo: () => void;
  resetDemo: () => void;
  setSurplusData: (data: Partial<SurplusReport>) => void;
  updateVisualSignal: (signal: VisualSignal, notes: string) => void;
  confirmSurplusAndAssess: (surplus: SurplusReport) => void;
  selectReceiver: (receiver: Receiver) => void;
  verifyHandoverOtp: (inputOtp: string) => boolean;
  markPickupDispatched: () => void;
  markRedistributionComplete: () => void;
  markRecoveryProcessed: (pathway: 'ANIMAL_FEED' | 'COMPOSTING') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load persisted page or default to 'landing'
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [demoMode, setDemoMode] = useState<'safe' | 'high-risk' | 'custom'>('safe');

  // Initialize with Safe Scenario defaults
  const [currentSurplus, setCurrentSurplus] = useState<SurplusReport>(() => {
    const saved = localStorage.getItem('annadhara_surplus');
    return saved ? JSON.parse(saved) : SAFE_SCENARIO_SURPLUS;
  });

  const [currentRisk, setCurrentRisk] = useState<RiskAssessment>(() => {
    return evaluateSurplusRisk(currentSurplus);
  });

  const [currentTrustToken, setCurrentTrustToken] = useState<TrustToken>(() => {
    return generateTrustToken(currentSurplus, currentRisk);
  });

  const [availableReceivers, setAvailableReceivers] = useState<Receiver[]>(() => {
    return getAvailableReceivers(currentSurplus, currentRisk);
  });

  const [matchedReceiver, setMatchedReceiver] = useState<Receiver | null>(() => {
    const recs = getAvailableReceivers(currentSurplus, currentRisk);
    return recs[0] || null;
  });

  const [currentPassport, setCurrentPassport] = useState<FoodPassport | null>(() => {
    const recs = getAvailableReceivers(currentSurplus, currentRisk);
    return createFoodPassport(currentSurplus, currentTrustToken, currentRisk, recs[0]);
  });

  const [surplusHistory, setSurplusHistory] = useState<SurplusReport[]>(RECENT_SURPLUS_HISTORY);
  const [impactStats, setImpactStats] = useState<ImpactStats>(INITIAL_IMPACT_STATS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('annadhara_surplus', JSON.stringify(currentSurplus));
  }, [currentSurplus]);

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSurplusData = (partial: Partial<SurplusReport>) => {
    setCurrentSurplus((prev) => {
      const updated = { ...prev, ...partial };
      const newRisk = evaluateSurplusRisk(updated);
      const newToken = generateTrustToken(updated, newRisk);
      const newReceivers = getAvailableReceivers(updated, newRisk);
      
      setCurrentRisk(newRisk);
      setCurrentTrustToken(newToken);
      setAvailableReceivers(newReceivers);
      return updated;
    });
  };

  const updateVisualSignal = (signal: VisualSignal, notes: string) => {
    const updated = {
      ...currentSurplus,
      visualSignal: signal,
      visualSignalNotes: notes
    };
    setCurrentSurplus(updated);
    const newRisk = evaluateSurplusRisk(updated);
    const newToken = generateTrustToken(updated, newRisk);
    const newReceivers = getAvailableReceivers(updated, newRisk);
    setCurrentRisk(newRisk);
    setCurrentTrustToken(newToken);
    setAvailableReceivers(newReceivers);
  };

  const confirmSurplusAndAssess = (surplus: SurplusReport) => {
    const risk = evaluateSurplusRisk(surplus);
    const token = generateTrustToken(surplus, risk);
    const receivers = getAvailableReceivers(surplus, risk);
    const primaryReceiver = receivers[0] || null;
    const passport = createFoodPassport(surplus, token, risk, primaryReceiver);

    setCurrentSurplus(surplus);
    setCurrentRisk(risk);
    setCurrentTrustToken(token);
    setAvailableReceivers(receivers);
    setMatchedReceiver(primaryReceiver);
    setCurrentPassport(passport);

    // If eligible, navigate to risk screen; if high risk, direct to recovery/risk
    navigateTo('risk');
  };

  const selectReceiver = (receiver: Receiver) => {
    setMatchedReceiver(receiver);
    if (currentPassport) {
      const updatedPassport = {
        ...currentPassport,
        matchedReceiver: receiver,
        timeline: currentPassport.timeline.map((step) =>
          step.stage === 'Matched'
            ? {
                ...step,
                description: `${receiver.name} matched. Transport: ${receiver.vehicleType || 'Insulated Van'}`,
                completed: true
              }
            : step
        )
      };
      setCurrentPassport(updatedPassport);
    }
  };

  const verifyHandoverOtp = (_inputOtp: string): boolean => {
    if (!currentPassport) return false;
    
    // For demo convenience, accept any 6-digit or matching OTP
    const updatedPassport: FoodPassport = {
      ...currentPassport,
      isOtpVerified: true,
      timeline: currentPassport.timeline.map((step) =>
        step.stage === 'Verified'
          ? {
              ...step,
              completed: true,
              active: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: 'Mutual OTP verified. Supervisor sensory check & temperature check signed off.'
            }
          : step.stage === 'Picked Up'
          ? { ...step, active: true }
          : step
      )
    };
    setCurrentPassport(updatedPassport);

    // Micro-interaction celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    return true;
  };

  const markPickupDispatched = () => {
    if (!currentPassport) return;
    const updatedPassport: FoodPassport = {
      ...currentPassport,
      pickupCompleted: true,
      timeline: currentPassport.timeline.map((step) =>
        step.stage === 'Picked Up'
          ? {
              ...step,
              completed: true,
              active: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: 'Surplus in transit via insulated transport vehicle.'
            }
          : step.stage === 'Redistributed' || step.stage === 'Recovered'
          ? { ...step, active: true }
          : step
      )
    };
    setCurrentPassport(updatedPassport);
  };

  const markRedistributionComplete = () => {
    if (!currentPassport) return;
    const updatedPassport: FoodPassport = {
      ...currentPassport,
      redistributionCompleted: true,
      outcome: 'REDISTRIBUTED',
      timeline: currentPassport.timeline.map((step) =>
        step.stage === 'Redistributed'
          ? {
              ...step,
              completed: true,
              active: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: 'Surplus food reached dining plates with full safety compliance.'
            }
          : step
      )
    };
    setCurrentPassport(updatedPassport);

    // Update global impact
    setImpactStats((prev) => ({
      ...prev,
      mealsRescued: prev.mealsRescued + currentSurplus.quantity,
      co2AvoidedKg: Math.round(prev.co2AvoidedKg + currentSurplus.quantity * 1.52),
      waterSavedLitres: prev.waterSavedLitres + currentSurplus.quantity * 100
    }));

    // Add to history
    setSurplusHistory((prev) => [
      { ...currentSurplus, status: 'completed' },
      ...prev.slice(0, 5)
    ]);

    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch {}
  };

  const markRecoveryProcessed = (pathway: 'ANIMAL_FEED' | 'COMPOSTING') => {
    if (!currentPassport) return;
    const outcomeType = pathway === 'ANIMAL_FEED' ? 'RECOVERED_ANIMAL_FEED' : 'RECOVERED_COMPOST';
    const updatedPassport: FoodPassport = {
      ...currentPassport,
      redistributionCompleted: true,
      outcome: outcomeType,
      timeline: currentPassport.timeline.map((step) =>
        step.stage === 'Recovered'
          ? {
              ...step,
              completed: true,
              active: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: `Successfully processed via ${
                pathway === 'ANIMAL_FEED' ? 'Licensed Gaushala Animal Feed' : 'Decentralized Campus Composting'
              }. Zero food sent to landfill.`
            }
          : step
      )
    };
    setCurrentPassport(updatedPassport);

    // Update global impact
    setImpactStats((prev) => ({
      ...prev,
      kgRecovered: prev.kgRecovered + (currentSurplus.quantity * 0.4), // approx 0.4 kg per portion
      recoveryEventsCount: prev.recoveryEventsCount + 1,
      co2AvoidedKg: Math.round(prev.co2AvoidedKg + currentSurplus.quantity * 1.1)
    }));

    setSurplusHistory((prev) => [
      { ...currentSurplus, status: 'recovered' },
      ...prev.slice(0, 5)
    ]);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // ONE-CLICK DEMO MODES FOR SIH PRESENTATION
  const loadSafeDemo = () => {
    setDemoMode('safe');
    const surplus = { ...SAFE_SCENARIO_SURPLUS };
    const risk = evaluateSurplusRisk(surplus);
    const token = generateTrustToken(surplus, risk);
    const receivers = getAvailableReceivers(surplus, risk);
    const receiver = receivers[0] || DEMO_RECEIVERS[0];
    const passport = createFoodPassport(surplus, token, risk, receiver);

    setCurrentSurplus(surplus);
    setCurrentRisk(risk);
    setCurrentTrustToken(token);
    setAvailableReceivers(receivers);
    setMatchedReceiver(receiver);
    setCurrentPassport(passport);
    navigateTo('dashboard');
  };

  const loadHighRiskDemo = () => {
    setDemoMode('high-risk');
    const surplus = { ...HIGH_RISK_SCENARIO_SURPLUS };
    const risk = evaluateSurplusRisk(surplus);
    const token = generateTrustToken(surplus, risk);
    const receivers = getAvailableReceivers(surplus, risk);
    const receiver = receivers[0] || DEMO_RECEIVERS[3]; // Gaushala
    const passport = createFoodPassport(surplus, token, risk, receiver);

    setCurrentSurplus(surplus);
    setCurrentRisk(risk);
    setCurrentTrustToken(token);
    setAvailableReceivers(receivers);
    setMatchedReceiver(receiver);
    setCurrentPassport(passport);
    navigateTo('recovery');
  };

  const resetDemo = () => {
    loadSafeDemo();
    navigateTo('landing');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        navigateTo,
        currentSurplus,
        currentRisk,
        currentTrustToken,
        availableReceivers,
        matchedReceiver,
        currentPassport,
        surplusHistory,
        impactStats,
        demoMode,
        loadSafeDemo,
        loadHighRiskDemo,
        resetDemo,
        setSurplusData,
        updateVisualSignal,
        confirmSurplusAndAssess,
        selectReceiver,
        verifyHandoverOtp,
        markPickupDispatched,
        markRedistributionComplete,
        markRecoveryProcessed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
