export type Clinic = {
  id: string;
  name: string;
  type: "clinic" | "hospital" | "pharmacy";
  address: string;
  distanceKm: number;
  waitMinutes: number;
  hours: string;
  phone: string;
  services: string[];
};

export const facilities: Clinic[] = [
  { id: "c1", name: "Soweto Community Clinic", type: "clinic", address: "12 Vilakazi St, Soweto", distanceKm: 2.1, waitMinutes: 25, hours: "07:00 – 18:00", phone: "011 555 0101", services: ["HIV", "TB", "Chronic Care", "Maternal"] },
  { id: "c2", name: "Diepsloot Health Centre", type: "clinic", address: "88 Ext 1, Diepsloot", distanceKm: 4.6, waitMinutes: 55, hours: "08:00 – 17:00", phone: "011 555 0122", services: ["Diabetes", "Hypertension", "General"] },
  { id: "h1", name: "Baragwanath Hospital", type: "hospital", address: "26 Chris Hani Rd, Diepkloof", distanceKm: 6.3, waitMinutes: 120, hours: "24 hours", phone: "011 933 8000", services: ["Emergency", "Surgery", "Maternity"] },
  { id: "p1", name: "Clicks Pharmacy — Maponya Mall", type: "pharmacy", address: "Maponya Mall, Klipspruit", distanceKm: 3.0, waitMinutes: 10, hours: "09:00 – 21:00", phone: "011 938 4400", services: ["Prescriptions", "Wellness Clinic"] },
  { id: "p2", name: "Dis-Chem — Protea Gardens", type: "pharmacy", address: "Protea Gardens Mall", distanceKm: 5.4, waitMinutes: 15, hours: "08:00 – 20:00", phone: "011 555 0300", services: ["Prescriptions", "Vaccines"] },
  { id: "c3", name: "Rural Outreach Mobile Clinic", type: "clinic", address: "Route 66, Limpopo", distanceKm: 12.4, waitMinutes: 40, hours: "Mon/Wed/Fri", phone: "015 555 0450", services: ["HIV", "TB", "Immunisation"] },
];

export type MedicineStock = "available" | "low" | "out";
export type Medicine = {
  id: string;
  name: string;
  category: string;
  stock: Record<string, MedicineStock>; // facility id -> stock
};

export const medicines: Medicine[] = [
  { id: "m1", name: "Metformin 500mg", category: "Diabetes", stock: { c1: "available", c2: "low", p1: "available", p2: "available" } },
  { id: "m2", name: "Amlodipine 5mg", category: "Hypertension", stock: { c1: "available", c2: "available", p1: "low", p2: "available" } },
  { id: "m3", name: "Tenofovir/Lamivudine/Dolutegravir (TLD)", category: "HIV / ARV", stock: { c1: "available", c2: "out", c3: "available", p1: "low" } },
  { id: "m4", name: "Rifafour (TB combo)", category: "Tuberculosis", stock: { c1: "low", c2: "available", c3: "available" } },
  { id: "m5", name: "Paracetamol 500mg", category: "Pain / Fever", stock: { c1: "available", c2: "available", p1: "available", p2: "available" } },
  { id: "m6", name: "Salbutamol Inhaler", category: "Asthma", stock: { c1: "low", p1: "available", p2: "out" } },
  { id: "m7", name: "Insulin (Actrapid)", category: "Diabetes", stock: { c1: "out", c2: "low", h1: "available", p2: "available" } },
];

export const healthTips = [
  "Drink at least 6–8 glasses of clean water each day.",
  "Chronic patients: take medication at the same time daily to build a routine.",
  "Wash hands with soap for 20 seconds to prevent infections.",
  "A 30-minute walk five times a week helps control blood pressure and sugar.",
  "Feeling low? Talking to someone helps — mental health is health.",
];
