import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createStaffSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional(),
  role: z.enum(["doctor", "nurse", "receptionist", "admin"]),
});

export const createStaffAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createStaffSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error("Could not verify permissions");
    if (!isAdmin) throw new Error("Forbidden: only administrators can create staff accounts");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName, phone: data.phone ?? null, role: data.role },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Could not create the staff account");

    // The signup trigger assigns 'patient' by default when metadata is missing;
    // make sure the requested staff role is present and the patient role is not.
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: created.user.id, role: data.role }, { onConflict: "user_id,role" });
    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", created.user.id)
      .eq("role", "patient");

    return { id: created.user.id, email: data.email, fullName: data.fullName, role: data.role };
  });

const changeRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["patient", "doctor", "nurse", "receptionist", "admin"]),
});

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => changeRoleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: only administrators can change roles");
    if (data.userId === context.userId) throw new Error("You cannot change your own role");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });