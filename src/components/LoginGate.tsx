import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wraps a page that requires authentication.
 * Instead of redirecting, shows a login dialog when unauthenticated.
 */
export function LoginGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowDialog(true);
    }
  }, [loading, isAuthenticated]);

  if (loading) {
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

  if (!isAuthenticated) {
    return (
      <LoginRequiredDialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) navigate(-1);
        }}
      />
    );
  }

  return <>{children}</>;
}
