import { Link } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth, type AppRole } from "@/hooks/useAuth";

export function RequireAuth({
  children,
  roles,
  label = "this page",
}: {
  children: ReactNode;
  roles?: AppRole[];
  label?: string;
}) {
  const { session, roles: myRoles, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid place-items-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="mx-auto mt-12 max-w-md p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 text-lg font-semibold">Sign in required</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You need to be signed in to view {label}.
        </p>
        <Button asChild className="mt-5">
          <Link to="/auth">Sign in or register</Link>
        </Button>
      </Card>
    );
  }

  if (roles && !roles.some((r) => myRoles.includes(r))) {
    return (
      <Card className="mx-auto mt-12 max-w-md p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 text-lg font-semibold">Not available for your role</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {label} is limited to {roles.join(", ")} accounts.
        </p>
      </Card>
    );
  }

  return <>{children}</>;
}