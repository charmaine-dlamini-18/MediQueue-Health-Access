import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Phone, Navigation, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { facilities } from "@/lib/mock-data";

export const Route = createFileRoute("/clinics")({
  head: () => ({ meta: [{ title: "Find a Clinic · MediQueue" }] }),
  component: ClinicsPage,
});

function ClinicsPage() {
  return <FacilityListPage type="clinic" title="Find a Clinic" description="Nearby facilities, wait times, and directions." />;
}

export function FacilityListPage({ type, title, description }: { type: "clinic" | "pharmacy"; title: string; description: string }) {
  const [query, setQuery] = useState("");
  const list = facilities.filter((f) => (type === "clinic" ? f.type !== "pharmacy" : f.type === "pharmacy"))
    .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()) || f.address.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  const leastBusy = [...list].sort((a, b) => a.waitMinutes - b.waitMinutes)[0];
  return (
    <PageContainer>
      <PageHeader icon={MapPin} title={title} description={description} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or area…"
            className="w-full rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="space-y-3">
            {list.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                <Card className="p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{f.name}</h3>
                        {leastBusy?.id === f.id && (
                          <Badge className="bg-secondary text-secondary-foreground">Least busy</Badge>
                        )}
                        <Badge variant="outline" className="capitalize">{f.type}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground truncate">{f.address}</div>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Navigation className="h-3 w-3" /> {f.distanceKm} km</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {f.hours}</span>
                        <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {f.phone}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {f.services.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <WaitBadge minutes={f.waitMinutes} />
                      <Button size="sm" variant="outline" className="mt-3" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name + " " + f.address)}`} target="_blank" rel="noreferrer">
                          Directions
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {list.length === 0 && <Card className="p-10 text-center text-muted-foreground">No facilities found.</Card>}
          </div>
        </div>

        <Card className="p-5 h-fit sticky top-20 overflow-hidden">
          <div className="text-sm font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Map preview
          </div>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[image:var(--gradient-hero)] text-primary-foreground">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(oklch(1_0_0/.15)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/.15)_1px,transparent_1px)] [background-size:20px_20px]" />
            {list.slice(0, 5).map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring" }}
                className="absolute"
                style={{ left: `${15 + (i * 17) % 70}%`, top: `${20 + (i * 23) % 60}%` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-40" />
                  <div className="relative grid h-7 w-7 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-lg text-[10px] font-bold">
                    {i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/30 backdrop-blur p-3 text-xs">
              <div className="font-semibold flex items-center gap-1"><Users className="h-3 w-3" /> Community wait times</div>
              <div className="opacity-90 mt-1">Crowdsourced from users near you.</div>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

function WaitBadge({ minutes }: { minutes: number }) {
  const tone = minutes <= 20 ? "bg-emerald-500/15 text-emerald-700" : minutes <= 60 ? "bg-amber-500/20 text-amber-700" : "bg-rose-500/15 text-rose-700";
  return (
    <div className={`inline-flex flex-col items-center rounded-xl px-3 py-2 ${tone}`}>
      <div className="text-lg font-bold leading-none">{minutes}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5">min wait</div>
    </div>
  );
}