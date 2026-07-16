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
  // Hospitals in Ugu District Municipality, KwaZulu-Natal
  { id: "h1", name: "Port Shepstone Regional Hospital", type: "hospital", address: "Bazley St, Port Shepstone", distanceKm: 1.2, waitMinutes: 95, hours: "24 hours", phone: "039 688 6000", services: ["Emergency", "Surgery", "Maternity", "Oncology"] },
  { id: "h2", name: "Murchison Hospital", type: "hospital", address: "R61, Murchison", distanceKm: 18.5, waitMinutes: 80, hours: "24 hours", phone: "039 687 7311", services: ["Emergency", "General", "Maternity"] },
  { id: "h3", name: "GJ Crookes Hospital", type: "hospital", address: "1 Hospital Rd, Scottburgh", distanceKm: 55.0, waitMinutes: 70, hours: "24 hours", phone: "039 978 7000", services: ["Emergency", "Surgery", "Maternity"] },
  { id: "h4", name: "St Andrews Hospital", type: "hospital", address: "14 Moodie St, Harding", distanceKm: 62.0, waitMinutes: 60, hours: "24 hours", phone: "039 433 1955", services: ["Emergency", "General", "TB"] },

  // Community Health Centres & Clinics — Ugu District
  { id: "c1", name: "Gamalakhe Community Health Centre", type: "clinic", address: "Gamalakhe Township, Margate", distanceKm: 6.4, waitMinutes: 45, hours: "24 hours", phone: "039 318 1113", services: ["HIV", "TB", "Chronic Care", "Maternal"] },
  { id: "c2", name: "Turton Clinic", type: "clinic", address: "Turton, Hibberdene", distanceKm: 25.0, waitMinutes: 30, hours: "07:30 – 16:00", phone: "039 699 1220", services: ["General", "Immunisation", "Chronic Care"] },
  { id: "c3", name: "Margate Clinic", type: "clinic", address: "Boyes Ln, Margate", distanceKm: 8.1, waitMinutes: 40, hours: "07:30 – 16:00", phone: "039 312 1113", services: ["General", "HIV", "Maternal"] },
  { id: "c4", name: "Hibberdene Clinic", type: "clinic", address: "Beach Rd, Hibberdene", distanceKm: 28.0, waitMinutes: 25, hours: "07:30 – 16:00", phone: "039 699 1000", services: ["General", "Chronic Care"] },
  { id: "c5", name: "Izingolweni Clinic", type: "clinic", address: "R61, Izingolweni", distanceKm: 22.0, waitMinutes: 50, hours: "07:30 – 16:00", phone: "039 534 0025", services: ["HIV", "TB", "General"] },
  { id: "c6", name: "Bhobhoyi Clinic", type: "clinic", address: "Bhobhoyi, Port Shepstone", distanceKm: 4.3, waitMinutes: 35, hours: "07:30 – 16:00", phone: "039 682 5544", services: ["General", "Maternal", "Immunisation"] },
  { id: "c7", name: "Murchison Clinic", type: "clinic", address: "Murchison", distanceKm: 17.2, waitMinutes: 40, hours: "07:30 – 16:00", phone: "039 687 7211", services: ["General", "HIV", "TB"] },
  { id: "c8", name: "KwaNzimakwe Clinic", type: "clinic", address: "KwaNzimakwe, Ramsgate", distanceKm: 12.5, waitMinutes: 55, hours: "07:30 – 16:00", phone: "039 319 2200", services: ["General", "Chronic Care"] },
  { id: "c9", name: "Dududu Clinic", type: "clinic", address: "Dududu, Umzinto", distanceKm: 45.0, waitMinutes: 30, hours: "07:30 – 16:00", phone: "039 974 0100", services: ["General", "Maternal"] },
  { id: "c10", name: "Umzinto Clinic", type: "clinic", address: "Main Rd, Umzinto", distanceKm: 40.0, waitMinutes: 60, hours: "07:30 – 16:00", phone: "039 974 1010", services: ["General", "HIV", "Chronic Care"] },
  { id: "c11", name: "Harding Clinic", type: "clinic", address: "Main St, Harding", distanceKm: 60.5, waitMinutes: 45, hours: "07:30 – 16:00", phone: "039 433 1010", services: ["General", "TB", "HIV"] },
  { id: "c12", name: "Ramsgate Clinic", type: "clinic", address: "Marine Dr, Ramsgate", distanceKm: 11.0, waitMinutes: 20, hours: "07:30 – 16:00", phone: "039 314 4477", services: ["General", "Immunisation"] },

  // Pharmacies in Ugu
  { id: "p1", name: "Clicks Pharmacy — Shelly Centre", type: "pharmacy", address: "Shelly Centre, Shelly Beach", distanceKm: 5.2, waitMinutes: 10, hours: "08:30 – 18:00", phone: "039 315 7788", services: ["Prescriptions", "Wellness Clinic"] },
  { id: "p2", name: "Dis-Chem — Shelly Beach", type: "pharmacy", address: "Shelly Beach Mall", distanceKm: 5.4, waitMinutes: 12, hours: "08:00 – 19:00", phone: "039 315 0400", services: ["Prescriptions", "Vaccines"] },
  { id: "p3", name: "Alpha Pharm — Port Shepstone", type: "pharmacy", address: "Aiken St, Port Shepstone", distanceKm: 1.0, waitMinutes: 8, hours: "08:00 – 17:30", phone: "039 682 1234", services: ["Prescriptions"] },
  { id: "p4", name: "Medirite — Margate", type: "pharmacy", address: "Shoprite Margate", distanceKm: 8.0, waitMinutes: 15, hours: "08:30 – 18:00", phone: "039 312 8899", services: ["Prescriptions", "Wellness"] },
];

export type MedicineStock = "available" | "low" | "out";
export type Medicine = {
  id: string;
  name: string;
  category: string;
  stock: Record<string, MedicineStock>; // facility id -> stock
};

export const medicines: Medicine[] = [
  { id: "m1", name: "Metformin 500mg", category: "Diabetes", stock: { c1: "available", c3: "low", c6: "available", p1: "available", p3: "available" } },
  { id: "m2", name: "Amlodipine 5mg", category: "Hypertension", stock: { c1: "available", c2: "available", c10: "low", p2: "available", p4: "available" } },
  { id: "m3", name: "Tenofovir/Lamivudine/Dolutegravir (TLD)", category: "HIV / ARV", stock: { c1: "available", c5: "out", c7: "available", c11: "available", p1: "low" } },
  { id: "m4", name: "Rifafour (TB combo)", category: "Tuberculosis", stock: { c5: "low", c7: "available", c11: "available", h4: "available" } },
  { id: "m5", name: "Paracetamol 500mg", category: "Pain / Fever", stock: { c1: "available", c3: "available", c12: "available", p1: "available", p2: "available", p3: "available" } },
  { id: "m6", name: "Salbutamol Inhaler", category: "Asthma", stock: { c3: "low", c8: "available", p1: "available", p4: "out" } },
  { id: "m7", name: "Insulin (Actrapid)", category: "Diabetes", stock: { c1: "out", c10: "low", h1: "available", h3: "available", p2: "available" } },
];

export const healthTips = [
  "Drink at least 6–8 glasses of clean water each day.",
  "Chronic patients: take medication at the same time daily to build a routine.",
  "Wash hands with soap for 20 seconds to prevent infections.",
  "A 30-minute walk five times a week helps control blood pressure and sugar.",
  "Feeling low? Talking to someone helps — mental health is health.",
];
