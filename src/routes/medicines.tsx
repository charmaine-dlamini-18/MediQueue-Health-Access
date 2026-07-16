import { createFileRoute } from "@tanstack/react-router";
import { PackageSearch, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { medicines, facilities, type MedicineStock } from "@/lib/mock-data";

export const Route = createFileRoute("/medicines")({
  head: () => ({ meta: [{ title: "Medicine Availability · MediQueue" }] }),
  component: MedicinesPage,
});

function MedicinesPage() {
  const [query, setQuery] = useState("");
  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) || m.category.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <PageContainer>
      <PageHeader icon={PackageSearch} title="Medicine Availability" description="Check stock before you travel." />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search medicines or category (e.g. Metformin, HIV)…"
        className="w-full rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((m, i) => {
          const entries = Object.entries(m.stock);
          const anyAvailable = entries.find(([, s]) => s === "available");
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
              <Card className="p-5 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{m.name}</div>
                    <Badge variant="outline" className="mt-1">{m.category}</Badge>
                  </div>
                  <StockPill stock={anyAvailable ? "available" : entries.some(([, s]) => s === "low") ? "low" : "out"} />
                </div>
                <div className="mt-4 space-y-2">
                  {entries.map(([fid, stock]) => {
                    const f = facilities.find((x) => x.id === fid);
                    if (!f) return null;
                    return (
                      <div key={fid} className="flex items-center justify-between text-sm rounded-lg border px-3 py-2">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{f.name}</div>
                          <div className="text-[11px] text-muted-foreground">{f.distanceKm} km away</div>
                        </div>
                        <StockPill stock={stock} small />
                      </div>
                    );
                  })}
                </div>
                {!anyAvailable && (
                  <div className="mt-3 text-xs text-rose-600 bg-rose-50 rounded-lg p-2">
                    ⚠ Out of stock nearby. Call ahead or try again in 24–48 hours.
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageContainer>
  );
}

function StockPill({ stock, small }: { stock: MedicineStock; small?: boolean }) {
  const cfg = {
    available: { icon: CheckCircle2, label: "Available", class: "bg-emerald-500/15 text-emerald-700" },
    low: { icon: AlertTriangle, label: "Low stock", class: "bg-amber-500/20 text-amber-700" },
    out: { icon: XCircle, label: "Out of stock", class: "bg-rose-500/15 text-rose-700" },
  }[stock];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${cfg.class} ${small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} font-semibold`}>
      <Icon className={small ? "h-3 w-3" : "h-3.5 w-3.5"} /> {cfg.label}
    </span>
  );
}