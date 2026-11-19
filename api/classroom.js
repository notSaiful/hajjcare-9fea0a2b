import { createClient } from "@supabase/supabase-js";
import { futureDayBody } from "./futureDays.js";
import { istDateString, publicProgramme } from "../src/data/classroomRelease.js";

export function classroomApiPayload(asOf, { allowSimulation = true, admin = false } = {}) {
  const today = allowSimulation && asOf ? String(asOf) : istDateString();
  const days = publicProgramme(today);
  const releasedBodies = {};
  for (const day of days) {
    if (day.status === "locked" && !admin) continue;
    const body = futureDayBody(day.day);
    if (body) releasedBodies[day.day] = body;
  }
  return { today, days, releasedBodies, admin: admin === true };
}

/** Confirms a Supabase user JWT, then the same admin role the admin pages read. */
export async function callerIsAdmin(authorization) {
  try {
    const header = Array.isArray(authorization) ? authorization[0] : authorization;
    const token = typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!token || !url || !key) return false;
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return false;
    const { data: allowed, error: roleError } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (!roleError && allowed === true) return true;
    const { data: roles, error: readError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    return !readError && Array.isArray(roles) && roles.length > 0;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const allowSimulation = process.env.VERCEL_ENV !== "production";
  const asOf = req.query?.asOf;
  const admin = await callerIsAdmin(req.headers?.authorization);
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.status(200).json(classroomApiPayload(asOf, { allowSimulation, admin }));
}
