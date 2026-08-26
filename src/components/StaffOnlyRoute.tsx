import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";

/** Blocks operational screens until a database-backed staff role is confirmed. */
export function StaffOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { hasAnyCoordinatorRole, isLoading: rolesLoading } = useUserRole();

  if (authLoading || rolesLoading) {
    return <div className="min-h-screen bg-background p-6"><Skeleton className="mx-auto h-48 w-full max-w-2xl rounded-3xl" /></div>;
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!hasAnyCoordinatorRole) return <Navigate to="/error/forbidden" replace />;
  return <>{children}</>;
}
