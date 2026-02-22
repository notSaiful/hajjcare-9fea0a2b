import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <Skeleton className="h-14 w-full max-w-md mx-auto rounded-2xl" />
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <AuthSkeleton />;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}
