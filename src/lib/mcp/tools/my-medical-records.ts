import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_medical_records",
  title: "My medical records",
  description:
    "List the signed-in MediQueue patient's own medical records (visit date, condition, diagnosis, treatment, prescription and facility).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum records to return, newest first."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("medical_records")
      .select("id, visit_date, condition, diagnosis, treatment, prescription, facility, notes")
      .eq("patient_id", ctx.getUserId()!)
      .order("visit_date", { ascending: false })
      .limit(limit ?? 10);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [
        {
          type: "text",
          text: data?.length
            ? data
                .map(
                  (r) =>
                    `${r.visit_date} · ${r.condition} @ ${r.facility ?? "Unknown facility"}\n  Diagnosis: ${r.diagnosis ?? "—"}\n  Treatment: ${r.treatment ?? "—"}\n  Prescription: ${r.prescription ?? "—"}`,
                )
                .join("\n\n")
            : "No medical records found for your account.",
        },
      ],
      structuredContent: { records: data ?? [] },
    };
  },
});
