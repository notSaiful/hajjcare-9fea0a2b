import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const updateUser = vi.fn(async () => ({ error: null }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getSession: async () => ({ data: { session: { user: { id: "u1" } } } }),
      updateUser: (...a: unknown[]) => updateUser(...(a as [])),
    },
  },
}));

import ResetPasswordPage, { validateNewPassword } from "@/pages/ResetPasswordPage";

describe("ResetPasswordPage", () => {
  it("validates length and match", () => {
    expect(validateNewPassword("short", "short")).toMatch(/at least/);
    expect(validateNewPassword("longenough1", "different1")).toMatch(/match/);
    expect(validateNewPassword("longenough1", "longenough1")).toBeNull();
  });

  it("calls supabase.auth.updateUser with the new password", async () => {
    render(<MemoryRouter><ResetPasswordPage /></MemoryRouter>);
    fireEvent.change(await screen.findByLabelText("New password"), { target: { value: "newpass123" } });
    fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "newpass123" } });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ password: "newpass123" }));
    expect(await screen.findByText(/Password updated/)).toBeInTheDocument();
  });
});
