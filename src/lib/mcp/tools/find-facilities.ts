import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { facilities } from "@/lib/mock-data";

export default defineTool({
  name: "find_facilities",
  title: "Find clinics, hospitals and pharmacies",
  description:
    "Search MediQueue's Ugu District (KwaZulu-Natal) healthcare facilities by name, area or service. Returns address, opening hours, phone, services and the current crowdsourced waiting time.",
  inputSchema: {
    query: z.string().trim().optional().describe("Name, town or service to match, e.g. 'Margate' or 'TB'."),
    type: z.enum(["clinic", "hospital", "pharmacy"]).optional().describe("Restrict to one facility type."),
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, type, limit }) => {
    const q = query?.toLowerCase();
    const results = facilities
      .filter((f) => (type ? f.type === type : true))
      .filter((f) =>
        !q
          ? true
          : f.name.toLowerCase().includes(q) ||
            f.address.toLowerCase().includes(q) ||
            f.services.some((s) => s.toLowerCase().includes(q)),
      )
      .slice(0, limit ?? 10)
      .map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        address: f.address,
        hours: f.hours,
        phone: f.phone,
        services: f.services,
        distanceKm: f.distanceKm,
        estimatedWaitMinutes: f.waitMinutes,
      }));

    return {
      content: [
        {
          type: "text",
          text: results.length
            ? results
                .map(
                  (f) =>
                    `${f.name} (${f.type}) — ${f.address}. Open ${f.hours}. Tel ${f.phone}. Services: ${f.services.join(", ")}. Approx wait ${f.estimatedWaitMinutes} min.`,
                )
                .join("\n")
            : "No matching facilities found.",
        },
      ],
      structuredContent: { facilities: results },
    };
  },
});
