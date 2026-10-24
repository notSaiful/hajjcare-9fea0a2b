import { supabase } from "@/integrations/supabase/client";

/** Canonical Sukoon status. Family, dashboard, command center, and metrics all use these three. */
export const PILGRIM_STATUSES = ["normal", "assisted", "emergency_managed"] as const;
export type PilgrimStatus = (typeof PILGRIM_STATUSES)[number];

const LEGACY_TO_CANONICAL: Record<string, PilgrimStatus> = {
  normal: "normal",
  assisted: "assisted",
  emergency_managed: "emergency_managed",
  emergency: "emergency_managed",
  missing: "emergency_managed",
  help: "assisted",
  needs_help: "assisted",
  hospital: "assisted",
};

export function normalizePilgrimStatus(raw: string | null | undefined): PilgrimStatus {
  if (!raw) return "normal";
  return LEGACY_TO_CANONICAL[raw.toLowerCase()] ?? "normal";
}

export function isEmergencyStatus(raw: string | null | undefined): boolean {
  return normalizePilgrimStatus(raw) === "emergency_managed";
}

export function pilgrimStatusColor(raw: string | null | undefined): string {
  switch (normalizePilgrimStatus(raw)) {
    case "emergency_managed":
      return "#dc2626";
    case "assisted":
      return "#d97706";
    default:
      return "#16a34a";
  }
}

export function pilgrimStatusLabel(raw: string | null | undefined, isRTL = false): string {
  switch (normalizePilgrimStatus(raw)) {
    case "emergency_managed":
      return isRTL ? "طوارئ" : "Emergency";
    case "assisted":
      return isRTL ? "يحتاج مساعدة" : "Needs help";
    default:
      return isRTL ? "طبيعي" : "Normal";
  }
}

const GROUP_ID_KEY = "hajj_group_id";

export function readFamilyGroupId(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(GROUP_ID_KEY);
}

/**
 * Set pilgrim status without writing latitude/longitude.
 * Prefers the set_pilgrim_status RPC (see the Sukoon migration). If that
 * function is not deployed yet, updates pilgrim_status on the existing row.
 * Never calls upsert_member_location with 0,0.
 */
export async function publishPilgrimStatus(
  status: PilgrimStatus,
  groupId = readFamilyGroupId(),
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!groupId) {
    return { ok: false, message: "Join a family group before updating status." };
  }

  const { error: rpcError } = await supabase.rpc("set_pilgrim_status", {
    p_group_id: groupId,
    p_pilgrim_status: status,
  });

  if (!rpcError) return { ok: true };

  const missingRpc =
    rpcError.code === "PGRST202" ||
    rpcError.code === "42883" ||
    /set_pilgrim_status/i.test(rpcError.message) ||
    /could not find the function/i.test(rpcError.message);

  if (!missingRpc) {
    return { ok: false, message: rpcError.message };
  }

  const { data: existing, error: readError } = await supabase
    .from("member_locations")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  if (readError) return { ok: false, message: readError.message };
  if (!existing) {
    return {
      ok: false,
      message: "Status was not published because there is no location row yet. Open family tracking with location on, then try again.",
    };
  }

  const { error: updateError } = await supabase
    .from("member_locations")
    .update({ pilgrim_status: status, updated_at: new Date().toISOString() })
    .eq("id", existing.id);

  if (updateError) return { ok: false, message: updateError.message };
  return { ok: true };
}
