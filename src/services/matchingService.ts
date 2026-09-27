import { Receiver, SurplusReport, FoodPassport, RiskAssessment, TrustToken } from '../types';
import { DEMO_RECEIVERS } from '../data/demoReceiverData';

/**
 * Verified receiver matching engine.
 * Filters receivers matching the surplus category (Human Redistribution vs Animal Feed vs Composting)
 * and scores them based on distance, pickup capability, and capacity.
 */
export function getAvailableReceivers(surplus: SurplusReport, risk: RiskAssessment): Receiver[] {
  let targetCategory: Receiver['category'] = 'HUMAN_REDISTRIBUTION';

  if (!risk.isEligibleForRedistribution) {
    targetCategory = risk.recommendedPathway === 'COMPOSTING' ? 'COMPOST_RECOVERY' : 'ANIMAL_RECOVERY';
  }

  const filtered = DEMO_RECEIVERS.filter((r) => r.category === targetCategory);

  // Sort by match score and distance
  return filtered.sort((a, b) => {
    // Capacity penalty if too small
    const aFits = a.capacityMeals >= surplus.quantity;
    const bFits = b.capacityMeals >= surplus.quantity;
    if (aFits && !bFits) return -1;
    if (!aFits && bFits) return 1;
    return a.distanceKm - b.distanceKm;
  });
}

/**
 * Generates an end-to-end digital Food Passport.
 */
export function createFoodPassport(
  surplus: SurplusReport,
  trustToken: TrustToken,
  risk: RiskAssessment,
  matchedReceiver?: Receiver
): FoodPassport {
  const passportId = `FP-IN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Environmental impact multipliers:
  // 1 meal approx saves 1.52 kg CO2 equivalent and 100 Litres of virtual water
  const mealsCount = surplus.quantity;
  const co2SavedKg = Math.round(mealsCount * 1.52 * 10) / 10;
  const waterSavedLiters = Math.round(mealsCount * 100);

  const qrData = JSON.stringify({
    passportId,
    tokenId: trustToken.tokenId,
    surplusId: surplus.id,
    food: surplus.foodType,
    quantity: `${surplus.quantity} ${surplus.quantityUnit}`,
    source: surplus.sourceKitchen,
    risk: risk.overallRisk,
    receiver: matchedReceiver?.name || 'Pending',
    verified: true,
    verificationUrl: `https://annadhara.in/verify/${passportId}`
  });

  const now = new Date();
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isRedistribution = risk.isEligibleForRedistribution;

  const timeline = [
    {
      stage: 'Prepared' as const,
      timestamp: surplus.preparedTime,
      title: 'Batch Cooked & Hot Packed',
      description: `Prepared at ${surplus.sourceKitchen}. Initial temperature ${surplus.temperatureCelsius}°C.`,
      actor: surplus.contactPerson || 'Kitchen Head',
      completed: true
    },
    {
      stage: 'Reported' as const,
      timestamp: surplus.reportedTime || formatTime(now),
      title: 'Surplus Reported via Voice/Web',
      description: `${surplus.quantity} ${surplus.quantityUnit} logged into AnnaDhara system.`,
      actor: 'AnnaDhara Zero-Friction Assistant',
      completed: true
    },
    {
      stage: 'Assessed' as const,
      timestamp: formatTime(now),
      title: 'Layered Defense Risk Evaluated',
      description: `Risk Level: ${risk.overallRisk} (${risk.riskScore}/100). Trust Token generated: ${trustToken.tokenId}.`,
      actor: 'AI Risk Engine & Human Sensory Gate',
      completed: true
    },
    {
      stage: 'Matched' as const,
      timestamp: formatTime(now),
      title: isRedistribution ? 'Verified Receiver Matched' : 'Recovery Partner Assigned',
      description: matchedReceiver
        ? `${matchedReceiver.name} (${matchedReceiver.distanceKm} km away). Pickup assigned.`
        : 'Matching receiver...',
      actor: matchedReceiver?.contactPerson || 'Logistics Coordinator',
      completed: !!matchedReceiver
    },
    {
      stage: 'Verified' as const,
      timestamp: 'Pending Handover',
      title: 'Digital OTP Handover Verification',
      description: 'Physical handover verification with temperature check and mutual signature.',
      actor: 'Kitchen Staff & Logistics Volunteer',
      completed: false,
      active: true
    },
    {
      stage: 'Picked Up' as const,
      timestamp: 'Pending',
      title: 'Insulated Transport Transit',
      description: 'Dispatched in temperature-controlled / insulated transport unit.',
      actor: matchedReceiver?.vehicleType || 'Transport Courier',
      completed: false
    },
    {
      stage: isRedistribution ? ('Redistributed' as const) : ('Recovered' as const),
      timestamp: 'Pending Final Delivery',
      title: isRedistribution ? 'Dignified Community Nourishment' : 'Green Zero-Landfill Utilization',
      description: isRedistribution 
        ? 'Distributed safely to community members with traceability record.'
        : 'Processed into animal fodder / compost bio-nutrients.',
      actor: matchedReceiver?.name || 'Partner Facility',
      completed: false
    }
  ];

  return {
    passportId,
    qrValue: qrData,
    surplus,
    trustToken,
    riskAssessment: risk,
    matchedReceiver,
    verificationOtp: otp,
    isOtpVerified: false,
    pickupCompleted: false,
    redistributionCompleted: false,
    timeline,
    outcome: 'IN_PROGRESS',
    co2SavedKg,
    waterSavedLiters
  };
}
