import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Phase = "checking" | "ready" | "invalid" | "saving" | "done";

export const MIN_PASSWORD_LENGTH = 8;

export function validateNewPassword(password: string, confirm: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

/**
 * Landing page for Supabase password-recovery links
 * (resetPasswordForEmail → redirectTo `${origin}/reset-password`).
 * supabase-js exchanges the recovery token from the URL and emits
 * PASSWORD_RECOVERY; we then let the user set a new password via updateUser.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) setPhase("ready");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) setPhase("ready");
      else setTimeout(() => active && setPhase((p) => (p === "checking" ? "invalid" : p)), 2500);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validateNewPassword(password, confirm);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setPhase("saving");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message || "Could not update password. Please request a new link.");
      setPhase("ready");
      return;
    }
    setPhase("done");
    setTimeout(() => navigate("/auth", { replace: true }), 2000);
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>Choose a new password for your HajCare account.</CardDescription>
        </CardHeader>
        <CardContent>
          {phase === "checking" && <p className="text-sm text-muted-foreground">Verifying your reset link…</p>}
          {phase === "invalid" && (
            <div className="space-y-3 text-sm">
              <p role="alert">This reset link is invalid or has expired.</p>
              <Link className="text-primary underline" to="/auth">Request a new link</Link>
            </div>
          )}
          {phase === "done" && <p role="status" className="text-sm">Password updated. Redirecting to sign in…</p>}
          {(phase === "ready" || phase === "saving") && (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={phase === "saving"}>
                {phase === "saving" ? "Saving…" : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
