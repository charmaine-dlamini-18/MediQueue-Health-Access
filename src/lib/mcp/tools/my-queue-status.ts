import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_queue_status",
  title: "My clinic queue status",
  description:
    "Show the signed-in MediQueue patient's current and recent clinic queue tickets, including ticket number, facility, department, priority and status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("queue_entries")
      .select("ticket_number, facility, department, priority, status, reason, checked_in_at")
      .eq("patient_id", ctx.getUserId()!)
      .order("checked_in_at", { ascending: false })
      .limit(10);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [
        {
          type: "text",
          text: data?.length
            ? data
                .map(
                  (q) =>
                    `Ticket ${q.ticket_number} · ${q.facility} / ${q.department} · priority ${q.priority} · status ${q.status} · checked in ${q.checked_in_at}`,
                )
                .join("\n")
            : "You are not in any clinic queue right now.",
        },
      ],
      structuredContent: { entries: data ?? [] },
    };
  },
});
