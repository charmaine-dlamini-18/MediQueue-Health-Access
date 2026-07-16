import { createFileRoute } from "@tanstack/react-router";
import { Calendar as CalendarIcon, Plus, X, Clock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { facilities } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments · MediQueue" }] }),
  component: AppointmentsPage,
});

type Appt = { id: string; facilityId: string; date: string; time: string; reason: string; condition: string };
const KEY = "mq_appts";

function AppointmentsPage() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Appt | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setAppts(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(appts));
  }, [appts, hydrated]);

  function upsert(a: Appt) {
    setAppts((prev) => {
      const exists = prev.find((p) => p.id === a.id);
      const next = exists ? prev.map((p) => (p.id === a.id ? a : p)) : [...prev, a];
      return next.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
    });
    toast.success(editing ? "Appointment updated" : "Appointment booked");
    setOpen(false); setEditing(null);
  }

  function remove(id: string) {
    setAppts((p) => p.filter((a) => a.id !== id));
    toast.success("Appointment cancelled");
  }

  const upcoming = appts.filter((a) => new Date(`${a.date}T${a.time}`) >= new Date(Date.now() - 3600_000));
  const past = appts.filter((a) => !upcoming.includes(a));

  return (
    <PageContainer>
      <PageHeader icon={CalendarIcon} title="My Appointments" description="Book, reschedule, and get reminders.">
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="rounded-full shrink-0">
          <Plus className="h-4 w-4" /> Book new
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Upcoming ({upcoming.length})</h3>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <div className="text-sm text-muted-foreground rounded-xl border border-dashed p-6 text-center">
                No upcoming visits. Tap <strong>Book new</strong> to schedule one.
              </div>
            )}
            {upcoming.map((a) => (
              <ApptCard key={a.id} appt={a} onEdit={() => { setEditing(a); setOpen(true); }} onDelete={() => remove(a.id)} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3">History</h3>
          <div className="space-y-3">
            {past.length === 0 && <div className="text-sm text-muted-foreground">No past appointments yet.</div>}
            {past.map((a) => <ApptCard key={a.id} appt={a} onDelete={() => remove(a.id)} past />)}
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {open && (
          <BookingDialog
            initial={editing}
            onClose={() => { setOpen(false); setEditing(null); }}
            onSave={upsert}
          />
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

function ApptCard({ appt, onEdit, onDelete, past }: { appt: Appt; onEdit?: () => void; onDelete: () => void; past?: boolean }) {
  const f = facilities.find((x) => x.id === appt.facilityId);
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={`rounded-xl border p-4 ${past ? "opacity-70" : ""}`}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
          <div className="min-w-0">
            <div className="font-semibold truncate">{f?.name ?? "Facility"}</div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {appt.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {appt.time}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{appt.condition}</Badge>
              <span className="text-xs text-muted-foreground truncate">{appt.reason}</span>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            {onEdit && <Button size="sm" variant="ghost" onClick={onEdit}>Reschedule</Button>}
            <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Cancel"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BookingDialog({ initial, onClose, onSave }: { initial: Appt | null; onClose: () => void; onSave: (a: Appt) => void }) {
  const [facilityId, setFacilityId] = useState(initial?.facilityId ?? facilities[0].id);
  const [date, setDate] = useState(initial?.date ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [time, setTime] = useState(initial?.time ?? "09:00");
  const [reason, setReason] = useState(initial?.reason ?? "");
  const [condition, setCondition] = useState(initial?.condition ?? "General");

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-semibold">{initial ? "Reschedule" : "Book appointment"}</div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ id: initial?.id ?? crypto.randomUUID(), facilityId, date, time, reason, condition });
          }}
          className="p-5 space-y-3"
        >
          <Field label="Facility">
            <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)} className="input">
              {facilities.filter((f) => f.type !== "pharmacy").map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" required /></Field>
            <Field label="Time"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input" required /></Field>
          </div>
          <Field label="Condition / Care type">
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input">
              {["General", "HIV", "TB", "Diabetes", "Hypertension", "Mental Health", "Maternal", "Vaccination"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Reason (optional)">
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="input min-h-20" placeholder="e.g. Chronic medication refill" />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initial ? "Save changes" : "Confirm booking"}</Button>
          </div>
        </form>
        <style>{`.input{width:100%;border:1px solid var(--color-border);border-radius:0.625rem;padding:0.5rem 0.75rem;background:var(--color-background);font-size:0.875rem;outline:none} .input:focus{border-color:var(--color-primary)}`}</style>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}