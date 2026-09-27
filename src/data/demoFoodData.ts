import { SurplusReport } from '../types';
import { IMAGES } from './imageConfig';

export const SAFE_SCENARIO_SURPLUS: SurplusReport = {
  id: 'SUR-2026-MESS-0941',
  foodType: 'Veg Thali Meals (Dal Tadka, Jeera Rice, Mixed Veg, Phulka Roti)',
  category: 'Cooked Meal',
  quantity: 40,
  quantityUnit: 'meals',
  preparedTime: '19:30',
  reportedTime: '20:35',
  sourceKitchen: 'Hostel Mess B (Kailash Hall, Block 2)',
  location: 'North Campus, Gate No. 4, Ground Floor Kitchen',
  contactPerson: 'Rameshwar Yadav (Head Mess Supervisor)',
  contactPhone: '+91 98765 43210',
  temperatureCelsius: 64,
  storageCondition: 'Hot Held (>60°C) in Insulated Thermal Steel Tubs',
  voiceTranscript: '40 veg meals bach gaye hain, dinner 7:30 PM ko bana tha, hot containers mein packed hai.',
  notes: 'Cooked fresh for dinner service. Clean utensils used, no cross-contamination, lids tightly sealed.',
  photoUrl: IMAGES.freshMeals.url,
  visualSignal: 'PASSED',
  visualSignalNotes: 'Visual inspection shows steam retention, typical vibrant color, zero oil or water separation.',
  status: 'reported'
};

export const HIGH_RISK_SCENARIO_SURPLUS: SurplusReport = {
  id: 'SUR-2026-CANT-0312',
  foodType: 'Mixed Sambar Rice & Potato Curry',
  category: 'Cooked Grains & Gravy',
  quantity: 65,
  quantityUnit: 'portions',
  preparedTime: '11:30',
  reportedTime: '20:15',
  sourceKitchen: 'Engineering Central Canteen Kitchen 3',
  location: 'South Campus Annex, 1st Floor Cafeteria',
  contactPerson: 'Suresh Kumar (Canteen Contractor)',
  contactPhone: '+91 98112 77490',
  temperatureCelsius: 27,
  storageCondition: 'Room Temperature Ambient (>8 hours elapsed)',
  voiceTranscript: 'Doopahar ka sambar chawal bach gaya hai lagbhag 65 portions, room temp par rakha tha 11:30 baje se.',
  notes: 'Cooked for lunch at 11:30 AM. Sat at ambient room temperature (27°C) past the critical 4-hour window.',
  photoUrl: IMAGES.cvInspectionQuestionable.url,
  visualSignal: 'WARNING',
  visualSignalNotes: 'Prolonged ambient temperature storage detected; sauce viscosity breakdown and thermal stagnation.',
  status: 'reported'
};

export const RECENT_SURPLUS_HISTORY: SurplusReport[] = [
  {
    id: 'SUR-2026-HOSP-0811',
    foodType: 'Dietary Khichdi & Boiled Veggies',
    category: 'Cooked Meal',
    quantity: 25,
    quantityUnit: 'meals',
    preparedTime: '12:00',
    reportedTime: '13:10',
    sourceKitchen: 'Civil Hospital Dietary Wing',
    location: 'Sector 10, Medical Ward Canteen',
    contactPerson: 'Dr. Neha Verma',
    contactPhone: '+91 97110 55421',
    temperatureCelsius: 62,
    storageCondition: 'Hot Held (>60°C)',
    visualSignal: 'PASSED',
    status: 'completed'
  },
  {
    id: 'SUR-2026-MESS-0792',
    foodType: 'Vegetable Pulao & Raita',
    category: 'Cooked Rice',
    quantity: 50,
    quantityUnit: 'meals',
    preparedTime: '13:30',
    reportedTime: '15:00',
    sourceKitchen: 'Girls Hostel Mess A',
    location: 'West Campus',
    contactPerson: 'Sunita Devi',
    contactPhone: '+91 98991 33412',
    temperatureCelsius: 58,
    storageCondition: 'Hot Held in Warmers',
    visualSignal: 'PASSED',
    status: 'completed'
  },
  {
    id: 'SUR-2026-UNIV-0640',
    foodType: 'Over-fermented Idli Batter & Coconut Chutney',
    category: 'Perishable Batter & Dairy',
    quantity: 35,
    quantityUnit: 'kg',
    preparedTime: '06:00',
    reportedTime: '16:00',
    sourceKitchen: 'Campus South Canteen',
    location: 'Gate 2',
    contactPerson: 'Murthy S.',
    contactPhone: '+91 94441 22390',
    temperatureCelsius: 32,
    storageCondition: 'Ambient Room Temp (>10 hours)',
    visualSignal: 'UNCERTAIN',
    status: 'recovered'
  }
];
