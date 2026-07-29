import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListOrdered, Ticket, Loader2, Bell, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/page-header";
import { RequireAuth } from "@/components/require-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Queue Management · MediQueue" },
      {
        name: "description",
        content:
          "Live clinic queue: check patients in, issue ticket numbers, triage by priority and call the next patient.",
      },
      { property: "og:title", content: "Queue Management · MediQueue" },
      {
        property: "og:description",
        content: "Real-time ticketing and triage for busy South African clinics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireAuth label="the clinic queue">
      <QueuePage />
    </RequireAuth>
  ),
});

type QueueRow = {
  id: string;
  patient_id: string;
  ticket_number: string;
  facility: string;
  department: string;
  priority: "emergency" | "urgent" | "routine";
  status: "waiting" | "called" | "in_progress" | "completed" | "cancelled";
  reason: string | null;
  checked_in_at: string;
};

const PRIORITY_RANK = { emergency: 0, urgent: 1, routine: 2 } as const;
const DEPARTMENTS = ["General", "Chronic Care", "HIV", "TB", "Maternal", "Immunisation", "Emergency"];

function QueuePage() {
  const { user, isStaff } = useAuth();
  const qc = useQueryClient();
  const [joining, setJoining] = useState(false);

  const queue = useQuery({
    queryKey: ["queue"],
    queryFn: async () => {
      let q = supabase
        .from("queue_entries")
        .select("*")
        .in("status", ["waiting", "called", "in_progress"])
        .order("checked_in_at");
      if (!isStaff) q = q.eq("patient_id", user!.id);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as QueueRow[];
    },
  });

  const patients = useQuery({
    queryKey: ["queue-patients"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("queue-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "queue_entries" }, () => {
        void qc.invalidateQueries({ queryKey: ["queue"] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  const sorted = useMemo(
    () =>
      [...(queue.data ?? [])].sort(
        (a, b) =>
          PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
          a.checked_in_at.localeCompare(b.checked_in_at),
      ),
    [queue.data],
  );

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    (patients.data ?? []).forEach((p) => m.set(p.id, p.full_name || "Unnamed"));
    return m;
  }, [patients.data]);

  const checkIn = useMutation({
    mutationFn: async (form: FormData) => {
      const patientId = (form.get("patient_id") as string) || user!.id;
      const ticket = `${(form.get("department") as string).slice(0, 3).toUpperCase()}-${String(
        Math.floor(Math.random() * 900 + 100),
      )}`;
      const { error } = await supabase.from("queue_entries").insert({
        patient_id: patientId,
        ticket_number: ticket,
        facility: (form.get("facility") as string) || "MediQueue Clinic",
        department: form.get("department") as string,
        priority: (form.get("priority") as QueueRow["priority"]) ?? "routine",
        reason: ((form.get("reason") as string) || "").slice(0, 300) || null,
      });
      if (error) throw error;
      return ticket;
    },
    onSuccess: (ticket) => {
      toast.success(`Ticket ${ticket} issued`);
      setJoining(false);
      void qc.invalidateQueries({ queryKey: ["queue"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: QueueRow["status"] }) => {
      const patch: {
        status: QueueRow["status"];
        called_at?: string;
        completed_at?: string;
        attended_by?: string;
      } = { status };
      if (status === "called") patch.called_at = new Date().toISOString();
      if (status === "completed") {
        patch.completed_at = new Date().toISOString();
        patch.attended_by = user!.id;
      }
      const { error } = await supabase.from("queue_entries").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["queue"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PageContainer>
      <PageHeader
        icon={ListOrdered}
        title="Queue Management"
        description={
          isStaff
            ? "Live waiting list, triage priority and call-next control."
            : "Your live ticket and position in the clinic queue."
        }
      >
        <Button className="rounded-full shrink-0" onClick={() => setJoining((v) => !v)}>
          <Ticket className="h-4 w-4" /> {isStaff ? "Check in patient" : "Join queue"}
        </Button>
      </PageHeader>

      {joining && (
        <Card className="mb-5 p-5">
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              checkIn.mutate(new FormData(e.currentTarget));
            }}
          >
            {isStaff && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="q-patient">Patient</Label>
                <select
                  id="q-patient"
                  name="patient_id"
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a patient…</option>
                  {(patients.data ?? []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name || p.id}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                name="department"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                defaultValue="routine"
                disabled={!isStaff}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-60"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="facility">Facility</Label>
              <Input id="facility" name="facility" maxLength={120} defaultValue="MediQueue Clinic" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="reason">Reason for visit</Label>
              <Input id="reason" name="reason" maxLength={300} placeholder="Chronic medication refill" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setJoining(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={checkIn.isPending}>
                {checkIn.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Issue ticket
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {queue.isLoading && (
          <div className="grid place-items-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {queue.data?.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            The queue is empty right now.
          </Card>
        )}
        {sorted.map((row, index) => (
          <Card key={row.id} className="p-4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <div className="grid h-12 w-16 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {row.ticket_number}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">
                  {isStaff ? (nameById.get(row.patient_id) ?? "Patient") : "Your ticket"}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline">{row.department}</Badge>
                  <Badge
                    variant={row.priority === "emergency" ? "destructive" : "secondary"}
                    className="capitalize"
                  >
                    {row.priority}
                  </Badge>
                  <span className="capitalize">{row.status.replace("_", " ")}</span>
                  <span>· position {index + 1}</span>
                </div>
              </div>
              {isStaff && (
                <div className="flex shrink-0 gap-1">
                  {row.status === "waiting" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus.mutate({ id: row.id, status: "called" })}
                    >
                      <Bell className="h-4 w-4" /> Call
                    </Button>
                  )}
                  {row.status === "called" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus.mutate({ id: row.id, status: "in_progress" })}
                    >
                      Start
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Complete"
                    onClick={() => updateStatus.mutate({ id: row.id, status: "completed" })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Cancel"
                    onClick={() => updateStatus.mutate({ id: row.id, status: "cancelled" })}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}