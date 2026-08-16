import { auth, defineMcp } from "@lovable.dev/mcp-js";

import findFacilities from "./tools/find-facilities";
import checkMedicine from "./tools/check-medicine";
import myMedicalRecords from "./tools/my-medical-records";
import myQueueStatus from "./tools/my-queue-status";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "mediqueue-health-access",
  title: "MediQueue Health Access",
  version: "0.1.0",
  instructions:
    "Tools for MediQueue, a healthcare access app for the Ugu District in KwaZulu-Natal, South Africa. Use `find_facilities` to locate clinics, hospitals and pharmacies with opening hours and waiting times, `check_medicine_availability` to see where a medicine is in stock, and `my_medical_records` / `my_queue_status` for the signed-in patient's own data. Never present this as medical advice; for emergencies advise calling 10177.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [findFacilities, checkMedicine, myMedicalRecords, myQueueStatus],
});
