import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/page-header";
import { AiChat } from "@/components/ai-chat";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant · MediQueue" }] }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <PageContainer>
      <PageHeader icon={Bot} title="MediQueue AI Assistant" description="Ask anything about your health, medicine, or the app." />
      <AiChat
        mode="assistant"
        greeting="Hi 👋 I'm MediQueue AI. I can help you find clinics, check medicines, book appointments, or answer health questions."
        placeholder="Ask me anything…"
        disclaimer="AI is not a substitute for a medical professional. Call 10177 for emergencies."
        suggestions={[
          "Where is the nearest clinic?",
          "How does MediQueue work?",
          "Do I need to fast for a diabetes test?",
          "Remind me about chronic care visits",
        ]}
      />
    </PageContainer>
  );
}