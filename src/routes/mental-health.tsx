import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, ShieldCheck, Wind, Users, Phone } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/page-header";
import { AiChat } from "@/components/ai-chat";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/mental-health")({
  head: () => ({ meta: [{ title: "Mental Health Support · MediQueue" }] }),
  component: MentalHealth,
});

function MentalHealth() {
  return (
    <PageContainer>
      <PageHeader icon={HeartPulse} title="Mental Health Support" description="Confidential, judgment-free AI companion." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AiChat
          mode="mental"
          greeting="Hi, I'm here to listen 💛 Whatever you're feeling — stress, anxiety, sadness, or just needing to talk — this is a safe space. What's on your mind today?"
          placeholder="Share what you're feeling…"
          disclaimer="This is peer-style AI support. If you are in crisis, please call SADAG on 0800 567 567 (free, 24/7)."
          suggestions={["I've been feeling overwhelmed", "I can't sleep at night", "How do I manage anxiety?", "I need someone to talk to"]}
        />
        <div className="space-y-4">
          <Card className="p-5 bg-[image:var(--gradient-hero)] text-primary-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <div className="text-sm font-semibold">Crisis? Talk to a human</div>
            </div>
            <div className="mt-2 text-2xl font-bold">0800 567 567</div>
            <div className="text-xs opacity-90">SADAG 24hr helpline (free) · SMS 31393</div>
          </Card>
          <ResourceCard icon={Wind} title="Breathing exercises" desc="4-7-8 breathing calms your nervous system in 60 seconds." />
          <ResourceCard icon={ShieldCheck} title="Grounding tips" desc="Name 5 things you can see, 4 you can touch, 3 you can hear." />
          <ResourceCard icon={Users} title="You are not alone" desc="1 in 3 South Africans experience a mental health issue. Talking helps." />
        </div>
      </div>
    </PageContainer>
  );
}

function ResourceCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary/20 text-secondary-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        </div>
      </div>
    </Card>
  );
}