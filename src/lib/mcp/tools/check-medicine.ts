import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { facilities, medicines } from "@/lib/mock-data";

const STOCK_LABEL = { available: "Available", low: "Low stock", out: "Out of stock" } as const;

export default defineTool({
  name: "check_medicine_availability",
  title: "Check medicine stock",
  description:
    "Look up which MediQueue clinics, hospitals and pharmacies currently have a medicine in stock, so patients avoid unnecessary travel.",
  inputSchema: {
    medicine: z.string().trim().min(1).describe("Medicine name or category, e.g. 'Metformin' or 'HIV'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ medicine }) => {
    const q = medicine.toLowerCase();
    const matches = medicines.filter(
      (m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
    );

    if (matches.length === 0) {
      return { content: [{ type: "text", text: `No medicine matching "${medicine}" is tracked by MediQueue.` }] };
    }

    const results = matches.map((m) => ({
      medicine: m.name,
      category: m.category,
      stock: Object.entries(m.stock).map(([facilityId, status]) => ({
        facility: facilities.find((f) => f.id === facilityId)?.name ?? facilityId,
        status,
      })),
    }));

    return {
      content: [
        {
          type: "text",
          text: results
            .map(
              (r) =>
                `${r.medicine} (${r.category}):\n` +
                r.stock.map((s) => `  - ${s.facility}: ${STOCK_LABEL[s.status]}`).join("\n"),
            )
            .join("\n\n"),
        },
      ],
      structuredContent: { results },
    };
  },
});
