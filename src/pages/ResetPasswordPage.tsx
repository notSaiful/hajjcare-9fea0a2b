import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

/**
 * Landing page for Supabase password-recovery emails.
 * The reset link is `${origin}/reset-password` and arrives with a recovery
 * session in the URL hash (or a PKCE code). This page must exist or the
 * email opens the 404 screen.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let settled = false;
    const finish = (hasSession: boolean) => {
      if (settled) return;
      settled = true;
      setReady(hasSession);
      setChecking(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        finish(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish(true);
      else window.setTimeout(() => finish(false), 800);
    });

    return () => subscription.unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. You are signed in.");
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO
        title="Reset password"
        description="Choose a new HajCare password."
        path="/reset-password"
        noindex
      />
      <Card className="w-full max-w-md rounded-3xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Reset password</h1>
          {checking ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking your reset link…
            </div>
          ) : !ready ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This reset link is missing, expired, or has already been used. Request a new one from the sign-in page.
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Choose a new password for your HajCare account. This updates your Supabase password only.
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-12"
              />
              <Button type="submit" className="w-full h-12" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
