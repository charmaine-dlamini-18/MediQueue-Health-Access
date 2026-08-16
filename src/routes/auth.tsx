import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { LogIn, UserPlus, ShieldCheck, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import logoAsset from "@/assets/mediqueue-logo.png.asset.json";

const logo = logoAsset.url;

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register · MediQueue" },
      {
        name: "description",
        content:
          "Sign in to MediQueue to view your medical records, join the clinic queue and manage appointments. Patients can register free.",
      },
      { property: "og:title", content: "Sign in or register · MediQueue" },
      {
        property: "og:description",
        content: "Patient, clinical staff and administrator access to the MediQueue clinic system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const registerSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().max(30).optional(),
  idNumber: z.string().trim().max(20).optional(),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [busy, setBusy] = useState(false);
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });

  const nextPath = (() => {
    const raw = new URLSearchParams(searchStr).get("next");
    return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  })();

  useEffect(() => {
    if (!loading && session) navigate({ to: nextPath, replace: true });
  }, [loading, session, nextPath, navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      if (mode === "signin") {
        const parsed = signInSchema.safeParse({
          email: form.get("email"),
          password: form.get("password"),
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Welcome back to MediQueue");
      } else {
        const parsed = registerSchema.safeParse({
          email: form.get("email"),
          password: form.get("password"),
          fullName: form.get("fullName"),
          phone: form.get("phone") || undefined,
          idNumber: form.get("idNumber") || undefined,
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}`,
            data: {
              full_name: parsed.data.fullName,
              phone: parsed.data.phone ?? null,
              id_number: parsed.data.idNumber ?? null,
              role: "patient",
            },
          },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Patient account created. You can sign in now.");
        setMode("signin");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}`,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: nextPath, replace: true });
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 p-2">
            <img src={logo} alt="MediQueue logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Sign in to MediQueue" : "Create a patient account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Patients, clinical staff and administrators sign in here."
              : "Registration is for patients. Staff accounts are created by an administrator."}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" required maxLength={120} placeholder="Thandi Mkhize" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" maxLength={30} placeholder="072 000 0000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="idNumber">ID number</Label>
                    <Input id="idNumber" name="idNumber" maxLength={20} placeholder="Optional" />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required maxLength={255} autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                maxLength={72}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signin" ? (
                <LogIn className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {mode === "signin" ? "Sign in" : "Register as a patient"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
            Continue with Google
          </Button>

          <button
            type="button"
            className="mt-5 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "register" : "signin")}
          >
            {mode === "signin"
              ? "New patient? Create an account"
              : "Already registered? Sign in instead"}
          </button>
        </Card>

        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Your health information is private. Only you and the clinical staff treating you can see
          your records.
        </p>
      </motion.div>
    </div>
  );
}