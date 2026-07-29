import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/page-header";
import { RequireAuth } from "@/components/require-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { createStaffAccount, setUserRole } from "@/lib/admin.functions";
import type { AppRole } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration · MediQueue" },
      {
        name: "description",
        content:
          "Administrator console for MediQueue: create doctor, nurse and receptionist accounts and manage user roles.",
      },
      { property: "og:title", content: "Administration · MediQueue" },
      {
        property: "og:description",
        content: "Create and manage clinic staff accounts and permissions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireAuth roles={["admin"]} label="The administration console">
      <AdminPage />
    </RequireAuth>
  ),
});

const ROLES: AppRole[] = ["patient", "receptionist", "nurse", "doctor", "admin"];

function AdminPage() {
  const qc = useQueryClient();
  const createStaff = useServerFn(createStaffAccount);
  const changeRole = useServerFn(setUserRole);

  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone").order("full_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;
      const roleMap = new Map<string, AppRole[]>();
      (roles ?? []).forEach((r) => {
        roleMap.set(r.user_id, [...(roleMap.get(r.user_id) ?? []), r.role as AppRole]);
      });
      return (profiles ?? []).map((p) => ({ ...p, roles: roleMap.get(p.id) ?? [] }));
    },
  });

  const addStaff = useMutation({
    mutationFn: async (form: FormData) =>
      createStaff({
        data: {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
          fullName: String(form.get("fullName") ?? ""),
          phone: String(form.get("phone") ?? "") || undefined,
          role: String(form.get("role") ?? "nurse") as "doctor" | "nurse" | "receptionist" | "admin",
        },
      }),
    onSuccess: (res) => {
      toast.success(`${res.fullName} added as ${res.role}`);
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateRole = useMutation({
    mutationFn: async (vars: { userId: string; role: AppRole }) => changeRole({ data: vars }),
    onSuccess: () => {
      toast.success("Role updated");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PageContainer>
      <PageHeader
        icon={ShieldCheck}
        title="Administration"
        description="Create staff accounts and manage who can do what in MediQueue."
      />

      <Card className="mb-5 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold">
          <UserPlus className="h-4 w-4" /> Add a staff member
        </h2>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            addStaff.mutate(form);
            e.currentTarget.reset();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-role">Role</Label>
            <select
              id="staff-role"
              name="role"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-email">Email</Label>
            <Input id="staff-email" name="email" type="email" required maxLength={255} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-phone">Phone</Label>
            <Input id="staff-phone" name="phone" maxLength={30} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="staff-password">Temporary password</Label>
            <Input
              id="staff-password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={addStaff.isPending}>
              {addStaff.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Create account
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 font-semibold">All users</h2>
        {users.isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        <div className="space-y-2">
          {(users.data ?? []).map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{u.full_name || "Unnamed user"}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {u.roles.length === 0 && <Badge variant="outline">no role</Badge>}
                  {u.roles.map((r) => (
                    <Badge key={r} variant="secondary" className="capitalize">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
              <select
                aria-label={`Change role for ${u.full_name || "user"}`}
                value={u.roles[0] ?? ""}
                onChange={(e) => updateRole.mutate({ userId: u.id, role: e.target.value as AppRole })}
                className="rounded-lg border bg-background px-2 py-1.5 text-sm"
              >
                <option value="" disabled>
                  Set role…
                </option>
                {ROLES.map((r) => (
                  <option key={r} value={r} className="capitalize">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}