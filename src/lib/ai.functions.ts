import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatCompletion, type ChatMessage } from "./ai-gateway.server";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const ChatInput = z.object({
  mode: z.enum(["assistant", "symptom", "mental"]).default("assistant"),
  messages: z.array(MessageSchema).min(1),
});

const SYSTEM_PROMPTS: Record<"assistant" | "symptom" | "mental", string> = {
  assistant:
    "You are MediQueue AI, a friendly healthcare navigator for users in South Africa. Help them find clinics/pharmacies, book appointments, check medicine availability, and understand health topics. Be concise, warm, and clear. Use simple English. Always remind users you are not a substitute for a healthcare professional and to call 10177 (SA ambulance) for emergencies.",
  symptom:
    "You are MediQueue Symptom Checker. Ask 1-2 focused follow-up questions when needed. Then give: (1) possible conditions (never diagnose), (2) an urgency level (Self-care / See a clinic soon / Visit a clinic today / Emergency — call 10177), (3) practical self-care if appropriate. Be brief and use bullet points. End every response with: 'This is guidance only, not a diagnosis. Please consult a healthcare professional.'",
  mental:
    "You are MediQueue Mental Health Companion. Be warm, non-judgmental, and confidential. Validate feelings first, then offer coping tips (breathing, grounding, journaling, connecting with others). If the user mentions self-harm or suicide, gently share: SADAG 24hr helpline 0800 567 567, or SMS 31393. You are not a therapist — remind them help is available.",
};

export const chatWithAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPTS[data.mode] },
      ...data.messages,
    ];
    const reply = await chatCompletion({ messages });
    return { reply };
  });