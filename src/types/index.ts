export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH_UNCERTAIN';
export type SurplusStatus = 'reported' | 'assessed' | 'matched' | 'verified' | 'completed' | 'recovered';
export type Pathway = 'REDISTRIBUTION' | 'ANIMAL_FEED' | 'COMPOSTING';
export type VisualSignal = 'PASSED' | 'WARNING' | 'UNCERTAIN' | 'NOT_PROVIDED';

export interface SurplusReport {
  id: string;
  foodType: string;
  category: string;
  quantity: number;
  quantityUnit: string;
  preparedTime: string;
  reportedTime: string;
  sourceKitchen: string;
  location: string;
  contactPerson: string;
  contactPhone: string;
  temperatureCelsius: number;
  storageCondition: string;
  voiceTranscript?: string;
  notes?: string;
  photoUrl?: string;
  visualSignal?: VisualSignal;
  visualSignalNotes?: string;
  status: SurplusStatus;
}

export interface RiskFactor {
  status: 'PASS' | 'WARN' | 'FAIL';
  metric: string;
  threshold: string;
  message: string;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  riskScore: number; // 0 (best) - 100 (highest risk)
  isEligibleForRedistribution: boolean;
  timeFactor: RiskFactor;
  tempFactor: RiskFactor;
  categoryFactor: RiskFactor;
  cvFactor: RiskFactor;
  humanGate: {
    status: 'PASS' | 'PENDING';
    verifiedBy?: string;
    message: string;
  };
  recommendedPathway: Pathway;
  summary: string;
  safetyDisclaimers: string[];
}

export interface TrustToken {
  tokenId: string;
  hash: string;
  timestamp: string;
  surplusId: string;
  status: 'PASSED' | 'PENDING_VERIFICATION' | 'RECOVERY_DIVERTED';
  issuer: string;
  rulesPassed: string[];
  isDemo: boolean;
  tamperProofProof: string;
}

export interface Receiver {
  id: string;
  name: string;
  type: 'Community Kitchen' | 'Shelter Home' | 'Food Bank NGO' | 'Gaushala (Animal Sanctuary)' | 'Campus Composting Unit';
  category: 'HUMAN_REDISTRIBUTION' | 'ANIMAL_RECOVERY' | 'COMPOST_RECOVERY';
  distanceKm: number;
  capacityMeals: number;
  hasPickup: boolean;
  vehicleType?: string;
  fssaiOrDarpanId: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  isFssaiVerified: boolean;
  acceptanceRate: number;
  rating: number;
  matchScore: number;
}

export interface TimelineEvent {
  stage: 'Prepared' | 'Reported' | 'Assessed' | 'Verified' | 'Matched' | 'Picked Up' | 'Redistributed' | 'Recovered';
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  completed: boolean;
  active?: boolean;
}

export interface FoodPassport {
  passportId: string;
  qrValue: string;
  surplus: SurplusReport;
  trustToken: TrustToken;
  riskAssessment: RiskAssessment;
  matchedReceiver?: Receiver;
  verificationOtp: string;
  isOtpVerified: boolean;
  pickupCompleted: boolean;
  redistributionCompleted: boolean;
  timeline: TimelineEvent[];
  outcome: 'REDISTRIBUTED' | 'RECOVERED_ANIMAL_FEED' | 'RECOVERED_COMPOST' | 'IN_PROGRESS';
  co2SavedKg: number;
  waterSavedLiters: number;
  donorCertificateUrl?: string;
}

export interface ImpactStats {
  mealsRescued: number;
  kgRecovered: number;
  co2AvoidedKg: number;
  waterSavedLitres: number;
  activeSurplusCount: number;
  recoveryEventsCount: number;
  participatingInstitutions: number;
  eatRightScore: number;
  monthlyRescueData: Array<{ month: string; rescuedMeals: number; recoveredKg: number }>;
}
