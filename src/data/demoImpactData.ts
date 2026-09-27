import { ImpactStats } from '../types';

export const INITIAL_IMPACT_STATS: ImpactStats = {
  mealsRescued: 14820,
  kgRecovered: 4310,
  co2AvoidedKg: 22480,
  waterSavedLitres: 1482000,
  activeSurplusCount: 3,
  recoveryEventsCount: 64,
  participatingInstitutions: 18,
  eatRightScore: 94, // Out of 100 for Eat Right Campus
  monthlyRescueData: [
    { month: 'Apr', rescuedMeals: 1100, recoveredKg: 320 },
    { month: 'May', rescuedMeals: 1450, recoveredKg: 410 },
    { month: 'Jun', rescuedMeals: 1820, recoveredKg: 500 },
    { month: 'Jul', rescuedMeals: 2300, recoveredKg: 640 },
    { month: 'Aug', rescuedMeals: 3650, recoveredKg: 980 },
    { month: 'Sep', rescuedMeals: 4500, recoveredKg: 1460 }
  ]
};

export const EAT_RIGHT_CRITERIA = [
  { name: 'Surplus Food Management & Zero Direct Landfill', score: '25/25', status: 'Compliant' },
  { name: 'Food Safety Time-Temperature Discipline', score: '24/25', status: 'Compliant' },
  { name: 'Verified Receiver Chain & Traceability Records', score: '23/25', status: 'Compliant' },
  { name: 'Kitchen Staff Hygiene & Digital Logging', score: '22/25', status: 'Compliant' }
];
