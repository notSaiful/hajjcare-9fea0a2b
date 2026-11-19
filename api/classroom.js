import { futureDayBody } from "./futureDays.js";
import { istDateString, publicProgramme } from "../src/data/classroomRelease.js";

export function classroomApiPayload(asOf, { allowSimulation = true, admin = false, adminReason = "no-token" } = {}) {
  const today = allowSimulation && asOf ? String(asOf) : istDateString();
  const days = publicProgramme(today);
  const releasedBodies = {};
  for (const day of days) {
    if (day.status === "locked" && !admin) continue;
    const body = futureDayBody(day.day);
    if (body) releasedBodies[day.day] = body;
  }
  return { today, days, releasedBodies, admin: admin === true, adminReason };
}

function logAdmin(reason, extra = {}) {
  console.info(JSON.stringify({ scope: "classroom-admin", reason, ...extra }));
}

/** Confirms a Supabase user JWT, then the existing admin role. No secrets are logged. */
export async function callerIsAdmin(authorization) {
  const header = Array.isArray(authorization) ? authorization[0] : authorization;
  const token = typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!token) {
    logAdmin("no-token");
    return { admin: false, reason: "no-token" };
  }
  if (!url || !key) {
    logAdmin("no-config", { hasUrl: Boolean(url), hasKey: Boolean(key) });
    return { admin: false, reason: "no-config" };
  }
  try {
    const userResponse = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!userResponse.ok) {
      logAdmin("user-rejected", { status: userResponse.status });
      return { admin: false, reason: "user-rejected" };
    }
    const user = await userResponse.json();
    if (!user?.id) {
      logAdmin("user-rejected", { status: userResponse.status });
      return { admin: false, reason: "user-rejected" };
    }
    const roleResponse = await fetch(`${url}/rest/v1/rpc/has_role`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _user_id: user.id, _role: "admin" }),
    });
    if (roleResponse.ok) {
      const allowed = await roleResponse.json();
      if (allowed === true) {
        logAdmin("ok");
        return { admin: true, reason: "ok" };
      }
    } else {
      logAdmin("role-rpc-failed", { status: roleResponse.status });
    }
    const rolesResponse = await fetch(
      `${url}/rest/v1/user_roles?user_id=eq.${encodeURIComponent(user.id)}&role=eq.admin&select=role`,
      { headers: { apikey: key, Authorization: `Bearer ${token}` } },
    );
    if (!rolesResponse.ok) {
      logAdmin("role-read-failed", { status: rolesResponse.status });
      return { admin: false, reason: "role-read-failed" };
    }
    const roles = await rolesResponse.json();
    const admin = Array.isArray(roles) && roles.length > 0;
    logAdmin(admin ? "ok" : "not-admin");
    return { admin, reason: admin ? "ok" : "not-admin" };
  } catch (error) {
    logAdmin("check-failed", { message: error instanceof Error ? error.message : "unknown" });
    return { admin: false, reason: "check-failed" };
  }
}

export default async function handler(req, res) {
  const allowSimulation = process.env.VERCEL_ENV !== "production";
  const asOf = req.query?.asOf;
  const check = await callerIsAdmin(req.headers?.authorization);
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.status(200).json(classroomApiPayload(asOf, { allowSimulation, admin: check.admin, adminReason: check.reason }));
}
