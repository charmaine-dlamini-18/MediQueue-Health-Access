import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/page-header";
import { AiChat } from "@/components/ai-chat";

export const Route = createFileRoute("/symptoms")({
  head: () => ({ meta: [{ title: "AI Symptom Checker · MediQueue" }] }),
  component: SymptomsPage,
});

function SymptomsPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={Stethoscope}
        title="AI Symptom Checker"
        description="Describe how you feel — get guidance in seconds."
      />
      <AiChat
        mode="symptom"
        greeting="Tell me what's going on. Describe your symptoms in your own words — when they started, how bad they feel, and anything else you've noticed."
        placeholder="e.g. I've had a fever and cough for 3 days…"
        disclaimer="MediQueue AI provides guidance only and is not a substitute for a healthcare professional. For emergencies call 10177."
        suggestions={[
          "I have a headache and fever",
          "My blood sugar reading is 15",
          "Persistent cough for 2 weeks",
          "Chest pain when I breathe",
        ]}
      />
    </PageContainer>
  );
}