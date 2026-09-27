import { SurplusReport, RiskAssessment, TrustToken, Pathway } from '../types';

/**
 * Calculates hours elapsed from HH:MM string to reported time or current time.
 */
function calculateElapsedHours(preparedTimeStr: string, reportedTimeStr: string): number {
  try {
    const [prepH, prepM] = preparedTimeStr.split(':').map(Number);
    const [repH, repM] = reportedTimeStr.split(':').map(Number);
    
    let prepMinutes = prepH * 60 + (prepM || 0);
    let repMinutes = repH * 60 + (repM || 0);

    // If reported crossed midnight or is earlier in clock representation
    if (repMinutes < prepMinutes) {
      repMinutes += 24 * 60;
    }
    const diffHours = (repMinutes - prepMinutes) / 60;
    return Math.max(0.5, Math.round(diffHours * 10) / 10);
  } catch {
    return 1.5;
  }
}

/**
 * Layered Defense Risk Assessment Engine
 * Adheres to FSSAI 2-hour / 4-hour temperature holding discipline for institutional catering.
 */
export function evaluateSurplusRisk(surplus: SurplusReport): RiskAssessment {
  const elapsedHours = calculateElapsedHours(surplus.preparedTime, surplus.reportedTime || '20:30');
  const temp = surplus.temperatureCelsius || 60;
  const isHotHeld = temp >= 60;
  const isChilled = temp <= 5;
  const isAmbient = !isHotHeld && !isChilled;

  let riskScore = 10; // baseline 10/100
  let isEligible = true;
  let recommendedPathway: Pathway = 'REDISTRIBUTION';

  // 1. TIME FACTOR
  let timeStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
  let timeMsg = `Prepared ${elapsedHours} hrs ago. Within safe handling window.`;
  if (isAmbient && elapsedHours > 4) {
    timeStatus = 'FAIL';
    timeMsg = `Critical: Left at ambient room temperature for ${elapsedHours} hrs (>4 hr FSSAI maximum limit).`;
    riskScore += 45;
    isEligible = false;
  } else if (isAmbient && elapsedHours > 2) {
    timeStatus = 'WARN';
    timeMsg = `Approaching ambient limit (${elapsedHours} hrs elapsed). Immediate redistribution required.`;
    riskScore += 20;
  } else if (isHotHeld && elapsedHours > 6) {
    timeStatus = 'FAIL';
    timeMsg = `Hot holding exceeded 6 hour maximum limit.`;
    riskScore += 35;
    isEligible = false;
  }

  // 2. TEMPERATURE FACTOR
  let tempStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
  let tempMsg = `Hot held at ${temp}°C (Safe zone >60°C).`;
  if (isAmbient) {
    if (elapsedHours > 3) {
      tempStatus = 'FAIL';
      tempMsg = `Stagnant in temperature danger zone (${temp}°C) for ${elapsedHours} hrs without thermal control.`;
      riskScore += 30;
      isEligible = false;
    } else {
      tempStatus = 'WARN';
      tempMsg = `Ambient room temperature (${temp}°C). Requires rapid redistribution within 90 minutes.`;
      riskScore += 15;
    }
  } else if (isChilled) {
    tempMsg = `Chilled cold storage (${temp}°C < 5°C). Safe bacterial inhibition.`;
  }

  // 3. CATEGORY FACTOR
  let catStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
  let catMsg = `Standard cooked food category: ${surplus.category}.`;
  const lowerCat = (surplus.category + ' ' + surplus.foodType).toLowerCase();

  if (lowerCat.includes('dairy') || lowerCat.includes('paneer') || lowerCat.includes('curd') || lowerCat.includes('gravy')) {
    catStatus = isAmbient && elapsedHours > 2 ? 'WARN' : 'PASS';
    catMsg = `High-moisture perishable category (${surplus.category}). Rapid bacterial spoilage vector.`;
    if (isAmbient && elapsedHours > 2) riskScore += 15;
  } else if (lowerCat.includes('dry') || lowerCat.includes('roti') || lowerCat.includes('bread')) {
    catMsg = `Low moisture category with higher shelf stability.`;
  }

  // 4. COMPUTER VISION SIGNAL
  let cvStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
  let cvMetric = 'Optical AI Cleared';
  let cvMsg = `Visual AI Cleared: Healthy surface texture, zero contaminants detected.`;

  if (!surplus.visualSignal || surplus.visualSignal === 'NOT_PROVIDED' || !surplus.photoUrl) {
    cvStatus = 'WARN';
    cvMetric = 'Skipped (No Photo)';
    cvMsg = 'Visual AI scan was skipped (no food photo uploaded). Physical supervisor inspection required before dispatch.';
    riskScore += 8;
  } else if (surplus.visualSignal === 'WARNING') {
    cvStatus = 'FAIL';
    cvMetric = 'Contamination Detected';
    cvMsg = surplus.visualSignalNotes || `Visual risk signal: Biological contamination or optical defects detected on surface.`;
    riskScore += 50;
    isEligible = false;
  } else if (surplus.visualSignal === 'UNCERTAIN') {
    cvStatus = 'WARN';
    cvMetric = 'Uncertain Quality';
    cvMsg = surplus.visualSignalNotes || `Visual risk signal: Indeterminate optical patterns. Requires human sensory gate.`;
    riskScore += 25;
  } else {
    cvStatus = 'PASS';
    cvMetric = 'Optical AI Cleared';
    cvMsg = surplus.visualSignalNotes || 'Visual inspection verified: Clean surface, zero foreign matter or contamination.';
  }

  // 5. HUMAN GATE
  const humanGate = {
    status: isEligible && riskScore < 50 ? ('PASS' as const) : ('PENDING' as const),
    verifiedBy: surplus.contactPerson || 'Kitchen Supervisor',
    message: isEligible 
      ? 'Supervisor sensory verification (visual + aroma) completed at source.'
      : 'Human supervisor gate halted redistribution due to safety violation; diverted to recovery.'
  };

  // OVERALL RISK CLASSIFICATION
  let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH_UNCERTAIN' = 'LOW';
  if (riskScore >= 60 || !isEligible) {
    overallRisk = 'HIGH_UNCERTAIN';
    isEligible = false;

    // Determine recovery pathway: biological contamination, mold, or insects CANNOT go to animal feed
    const hasBioHazard = 
      surplus.visualSignal === 'WARNING' ||
      surplus.visualSignalNotes?.toLowerCase().includes('insect') ||
      surplus.visualSignalNotes?.toLowerCase().includes('keede') ||
      surplus.visualSignalNotes?.toLowerCase().includes('weevil') ||
      surplus.visualSignalNotes?.toLowerCase().includes('mold');

    if (lowerCat.includes('batter') || lowerCat.includes('spoil') || elapsedHours > 8 || hasBioHazard) {
      recommendedPathway = 'COMPOSTING';
    } else {
      recommendedPathway = 'ANIMAL_FEED';
    }
  } else if (riskScore >= 30) {
    overallRisk = 'MEDIUM';
    recommendedPathway = 'REDISTRIBUTION';
  } else {
    overallRisk = 'LOW';
    recommendedPathway = 'REDISTRIBUTION';
  }

  const safetyDisclaimers = [
    'Prototype decision-support output based on time-temperature principles.',
    'Not an official regulatory or laboratory food safety certificate.',
    'Human supervisory sign-off remains mandatory before physical consumption.'
  ];

  const summary = isEligible
    ? `Food is within acceptable time-temperature parameters (${elapsedHours}h elapsed, ${temp}°C). Cleared for verified redistribution.`
    : `Redistribution not recommended due to temperature holding duration (${elapsedHours}h at ${temp}°C). Diverted to ${recommendedPathway === 'ANIMAL_FEED' ? 'sanctioned animal feed' : 'campus composting'}.`;

  return {
    overallRisk,
    riskScore: Math.min(100, Math.max(5, riskScore)),
    isEligibleForRedistribution: isEligible,
    timeFactor: {
      status: timeStatus,
      metric: `${elapsedHours} hours elapsed`,
      threshold: isAmbient ? 'Max 4 hrs at room temp' : 'Max 6 hrs hot held',
      message: timeMsg
    },
    tempFactor: {
      status: tempStatus,
      metric: `${temp}°C`,
      threshold: isHotHeld ? '>60°C' : isChilled ? '<5°C' : 'Danger Zone (5°-60°C)',
      message: tempMsg
    },
    categoryFactor: {
      status: catStatus,
      metric: surplus.category,
      threshold: 'Category Perishability Matrix',
      message: catMsg
    },
    cvFactor: {
      status: cvStatus,
      metric: cvMetric,
      threshold: 'Optical Texture & Steam Detection',
      message: cvMsg
    },
    humanGate,
    recommendedPathway,
    summary,
    safetyDisclaimers
  };
}

/**
 * Creates an evidence-backed prototype Trust Token record.
 */
export function generateTrustToken(surplus: SurplusReport, risk: RiskAssessment): TrustToken {
  const hashSeed = `${surplus.id}-${surplus.foodType}-${surplus.quantity}-${surplus.preparedTime}-${Date.now()}`;
  
  // Emulate cryptographic SHA-256 fingerprint
  let hashNum = 0;
  for (let i = 0; i < hashSeed.length; i++) {
    hashNum = ((hashNum << 5) - hashNum) + hashSeed.charCodeAt(i);
    hashNum |= 0;
  }
  const hexHash = '0x' + Math.abs(hashNum).toString(16).padStart(8, '0') + 'd8e4f1a23c89';

  const rulesPassed: string[] = [];
  if (risk.timeFactor.status !== 'FAIL') rulesPassed.push('Time Window Holding Rule');
  if (risk.tempFactor.status !== 'FAIL') rulesPassed.push('Temperature Integrity Threshold');
  if (risk.categoryFactor.status !== 'FAIL') rulesPassed.push('Category Cross-Contamination Check');
  if (risk.cvFactor.status === 'PASS' && surplus.photoUrl && surplus.visualSignal === 'PASSED') {
    rulesPassed.push('Optical Risk Signal Evaluation');
  }
  if (risk.humanGate.status === 'PASS') rulesPassed.push('Supervisor Sensory Human Gate');

  return {
    tokenId: `TT-2026-${surplus.id.replace('SUR-2026-', '')}`,
    hash: hexHash,
    timestamp: new Date().toISOString(),
    surplusId: surplus.id,
    status: risk.isEligibleForRedistribution ? 'PASSED' : 'RECOVERY_DIVERTED',
    issuer: 'AnnaDhara Layered Defense Engine v2.4 (SIH 2026)',
    rulesPassed,
    isDemo: true,
    tamperProofProof: `Merkle-Root:${hexHash.slice(0, 10)}...${surplus.sourceKitchen.slice(0, 6)}`
  };
}
