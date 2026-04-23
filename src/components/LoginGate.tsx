import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wraps a page that requires authentication.
 * Instead of redirecting, shows a login dialog when unauthenticated.
 * On cancel, navigates back (or home if no history) and does not re-open the dialog.
 */
export function LoginGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);
  const dismissedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated && !dismissedRef.current) {
      setShowDialog(true);
    }
  }, [loading, isAuthenticated]);

  const handleCancel = () => {
    dismissedRef.current = true;
    setShowDialog(false);
    // Try to go back; if no history, fallback to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

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
          if (!open) handleCancel();
          else setShowDialog(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
