import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useServerFn } from "@tanstack/react-start";
import { chatWithAi } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

export function AiChat({
  mode,
  greeting,
  placeholder,
  disclaimer,
  suggestions = [],
}: {
  mode: "assistant" | "symptom" | "mental";
  greeting: string;
  placeholder: string;
  disclaimer?: string;
  suggestions?: string[];
}) {
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chat = useServerFn(chatWithAi);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await chat({ data: { mode, messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[65vh] min-h-[500px] overflow-hidden p-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-muted/20">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-card px-4 py-2.5 text-sm border shadow-sm whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
            <Loader2 className="h-3 w-3 animate-spin" /> MediQueue AI is thinking…
          </div>
        )}
      </div>
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="border-t bg-background px-4 py-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 border-t bg-card p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <Button size="icon" type="submit" disabled={loading || !input.trim()} className="rounded-full shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {disclaimer && (
        <div className="border-t bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground flex items-start gap-1.5">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{disclaimer}</span>
        </div>
      )}
    </Card>
  );
}