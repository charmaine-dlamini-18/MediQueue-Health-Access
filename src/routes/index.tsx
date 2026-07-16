import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Stethoscope, MapPin, Pill, Calendar, PackageSearch, HeartPulse, Bot, Bell,
  Clock, TrendingUp, Activity, ArrowRight, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { healthTips, facilities } from "@/lib/mock-data";
import logoAsset from "@/assets/mediqueue-logo.png.asset.json";
const logo = logoAsset.url;

export const Route = createFileRoute("/")({ component: Dashboard });

const quickActions = [
  { title: "Symptom Checker", desc: "Describe how you feel", icon: Stethoscope, to: "/symptoms", tint: "from-primary to-primary-glow" },
  { title: "Find a Clinic", desc: "Nearest facilities & wait times", icon: MapPin, to: "/clinics", tint: "from-emerald-500 to-teal-500" },
  { title: "Find a Pharmacy", desc: "Locate pharmacies near you", icon: Pill, to: "/pharmacies", tint: "from-cyan-500 to-primary" },
  { title: "Book Appointment", desc: "Schedule your next visit", icon: Calendar, to: "/appointments", tint: "from-secondary to-amber-400" },
  { title: "Medicine Tracker", desc: "Check stock availability", icon: PackageSearch, to: "/medicines", tint: "from-amber-500 to-orange-500" },
  { title: "Mental Health", desc: "Confidential AI support", icon: HeartPulse, to: "/mental-health", tint: "from-rose-500 to-pink-500" },
  { title: "AI Assistant", desc: "Ask anything, anytime", icon: Bot, to: "/assistant", tint: "from-primary to-secondary" },
];

function Dashboard() {
  const tip = healthTips[new Date().getDate() % healthTips.length];
  const nextClinic = [...facilities].filter((f) => f.type === "clinic").sort((a, b) => a.waitMinutes - b.waitMinutes)[0];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-6 sm:p-10 text-primary-foreground shadow-[var(--shadow-soft)]"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" /> AI-powered healthcare
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
              Welcome to MediQueue
            </h1>
            <p className="mt-2 max-w-xl text-primary-foreground/90">
              Skip the queue. Find the right clinic, check medicine stock, and get AI-guided care — designed for South Africa.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/symptoms" className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-md hover:brightness-105 transition">
                <Stethoscope className="h-4 w-4" /> Check Symptoms
              </Link>
              <Link to="/clinics" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/25 transition">
                <MapPin className="h-4 w-4" /> Find a Clinic
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="hidden sm:grid h-32 w-32 place-items-center rounded-3xl bg-white/95 p-4 shadow-xl"
          >
            <img src={logo} alt="MediQueue" className="h-full w-full object-contain" />
          </motion.div>
        </div>
      </motion.section>

      {/* Stat strip */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Bell} label="Reminders today" value="2" hint="Medication + follow-up" delay={0} />
        <StatCard icon={Clock} label="Shortest queue" value={`${nextClinic?.waitMinutes ?? 0} min`} hint={nextClinic?.name ?? ""} delay={0.05} />
        <StatCard icon={Activity} label="Health status" value="Stable" hint="Keep it up 💪" delay={0.1} />
        <StatCard icon={TrendingUp} label="Adherence" value="92%" hint="Last 30 days" delay={0.15} />
      </section>

      {/* Quick actions grid */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Quick actions</h2>
            <p className="text-sm text-muted-foreground">Everything you need in one place.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickActions.map((a, i) => (
            <motion.div
              key={a.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
            >
              <Link to={a.to} className="group block h-full">
                <Card className="h-full p-5 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all border-transparent hover:border-primary/20">
                  <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${a.tint} text-white shadow-md`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{a.desc}</div>
                  <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                    Open <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Two-column info */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Upcoming reminders</h3>
          </div>
          <ul className="space-y-3">
            <ReminderRow title="Take Metformin 500mg" time="Today · 08:00" tag="Diabetes" tone="primary" />
            <ReminderRow title="Refill ARV (TLD)" time="Tomorrow" tag="HIV" tone="secondary" />
            <ReminderRow title="Follow-up at Soweto Clinic" time="Fri · 09:30" tag="Chronic" tone="muted" />
          </ul>
        </Card>
        <Card className="p-6 bg-[image:var(--gradient-gold)] text-secondary-foreground">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Daily health tip</div>
          <p className="mt-2 text-base font-medium leading-relaxed">{tip}</p>
          <div className="mt-6 flex items-center gap-2 text-xs opacity-80">
            <HeartPulse className="h-4 w-4" /> Small habits, big impact.
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint, delay }: { icon: any; label: string; value: string; hint: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 truncate">{hint}</div>
      </Card>
    </motion.div>
  );
}

function ReminderRow({ title, time, tag, tone }: { title: string; time: string; tag: string; tone: "primary" | "secondary" | "muted" }) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : tone === "secondary" ? "bg-secondary/20 text-secondary-foreground" : "bg-muted text-muted-foreground";
  return (
    <li className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/40 transition">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${toneClass}`}>
        <Bell className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground">{time}</div>
      </div>
      <Badge variant="outline" className="shrink-0">{tag}</Badge>
    </li>
  );
}
