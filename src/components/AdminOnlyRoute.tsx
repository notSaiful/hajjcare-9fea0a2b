import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";

function GuardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <Skeleton className="h-14 w-full max-w-md mx-auto rounded-2xl" />
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}

/**
 * Route-level guard: only users with the `admin` role may access the wrapped
 * page. Provides defence-in-depth alongside RLS — blocks rendering until auth
 * and role are confirmed so admin UI/JS never executes for non-admins.
 */
export function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { isAdmin, isLoading: rolesLoading } = useUserRole();

  if (authLoading || rolesLoading) return <GuardSkeleton />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/error/forbidden" replace />;

  return <>{children}</>;
}
