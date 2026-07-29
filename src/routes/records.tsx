import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageContainer, PageHeader } from "@/components/page-header";
import { RequireAuth } from "@/components/require-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Patient Records · MediQueue" },
      {
        name: "description",
        content:
          "View and capture patient medical records — diagnosis, treatment and prescriptions — securely inside MediQueue.",
      },
      { property: "og:title", content: "Patient Records · MediQueue" },
      {
        property: "og:description",
        content: "Secure clinical record keeping for MediQueue patients and staff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireAuth label="medical records">
      <RecordsPage />
    </RequireAuth>
  ),
});

type RecordRow = {
  id: string;
  patient_id: string;
  visit_date: string;
  facility: string | null;
  condition: string;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  notes: string | null;
};

const recordSchema = z.object({
  patient_id: z.string().uuid("Select a patient"),
  visit_date: z.string().min(1),
  condition: z.string().trim().min(2).max(80),
  facility: z.string().trim().max(120).optional(),
  diagnosis: z.string().trim().max(1000).optional(),
  treatment: z.string().trim().max(1000).optional(),
  prescription: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

function RecordsPage() {
  const { user, isStaff, isClinical } = useAuth();
  const qc = useQueryClient();
  const [patientFilter, setPatientFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  const patients = useQuery({
    queryKey: ["patient-list"],
    enabled: isStaff,
    queryFn: async () => {
      const { data: roleRows, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "patient");
      if (roleError) throw roleError;
      const ids = (roleRows ?? []).map((r) => r.user_id);
      if (ids.length === 0) return [] as { id: string; full_name: string }[];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids)
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const records = useQuery({
    queryKey: ["records", isStaff ? patientFilter : user?.id],
    queryFn: async () => {
      let q = supabase.from("medical_records").select("*").order("visit_date", { ascending: false });
      if (!isStaff) q = q.eq("patient_id", user!.id);
      else if (patientFilter) q = q.eq("patient_id", patientFilter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as RecordRow[];
    },
  });

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    (patients.data ?? []).forEach((p) => map.set(p.id, p.full_name || "Unnamed patient"));
    return map;
  }, [patients.data]);

  const addRecord = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = recordSchema.safeParse({
        patient_id: form.get("patient_id"),
        visit_date: form.get("visit_date"),
        condition: form.get("condition"),
        facility: form.get("facility") || undefined,
        diagnosis: form.get("diagnosis") || undefined,
        treatment: form.get("treatment") || undefined,
        prescription: form.get("prescription") || undefined,
        notes: form.get("notes") || undefined,
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      const { error } = await supabase
        .from("medical_records")
        .insert({ ...parsed.data, author_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Record saved");
      setShowForm(false);
      void qc.invalidateQueries({ queryKey: ["records"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PageContainer>
      <PageHeader
        icon={FileText}
        title={isStaff ? "Patient Records" : "My Health Records"}
        description={
          isStaff
            ? "Search a patient and review or capture their clinical history."
            : "Every visit, diagnosis and prescription captured by your care team."
        }
      >
        {isClinical && (
          <Button className="rounded-full shrink-0" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" /> New record
          </Button>
        )}
      </PageHeader>

      {isStaff && (
        <Card className="mb-4 p-4">
          <Label htmlFor="patient" className="text-xs text-muted-foreground">
            <Search className="mr-1 inline h-3 w-3" /> Filter by patient
          </Label>
          <select
            id="patient"
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">All patients</option>
            {(patients.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name || p.id}
              </option>
            ))}
          </select>
        </Card>
      )}

      {showForm && isClinical && (
        <Card className="mb-5 p-5">
          <h3 className="mb-3 font-semibold">Capture a clinical record</h3>
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              addRecord.mutate(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="rec-patient">Patient</Label>
              <select
                id="rec-patient"
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
            <div className="space-y-1.5">
              <Label htmlFor="visit_date">Visit date</Label>
              <Input
                id="visit_date"
                name="visit_date"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {["General", "HIV", "TB", "Diabetes", "Hypertension", "Mental Health", "Maternal", "Vaccination"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="facility">Facility</Label>
              <Input id="facility" name="facility" maxLength={120} placeholder="Gamalakhe CHC" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                maxLength={1000}
                className="min-h-20 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="treatment">Treatment</Label>
              <textarea
                id="treatment"
                name="treatment"
                maxLength={1000}
                className="min-h-20 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="prescription">Prescription</Label>
              <textarea
                id="prescription"
                name="prescription"
                maxLength={1000}
                className="min-h-16 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addRecord.isPending}>
                {addRecord.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save record
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {records.isLoading && (
          <div className="grid place-items-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {records.data?.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No records yet.
          </Card>
        )}
        {(records.data ?? []).map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{r.condition}</Badge>
              <span className="text-sm font-semibold">{r.visit_date}</span>
              {r.facility && <span className="text-xs text-muted-foreground">{r.facility}</span>}
              {isStaff && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {nameById.get(r.patient_id) ?? "Patient"}
                </span>
              )}
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <Field label="Diagnosis" value={r.diagnosis} />
              <Field label="Treatment" value={r.treatment} />
              <Field label="Prescription" value={r.prescription} />
              <Field label="Notes" value={r.notes} />
            </dl>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-wrap">{value}</dd>
    </div>
  );
}