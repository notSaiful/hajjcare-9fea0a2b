import { futureDayBody } from "./futureDays.js";
import { istDateString, publicProgramme } from "../src/data/classroomRelease.js";

export function classroomApiPayload(asOf, { allowSimulation = true } = {}) {
  const today = allowSimulation && asOf ? String(asOf) : istDateString();
  const days = publicProgramme(today);
  const releasedBodies = {};
  for (const day of days) {
    if (day.status === "locked") continue;
    const body = futureDayBody(day.day);
    if (body) releasedBodies[day.day] = body;
  }
  return { today, days, releasedBodies };
}

export default function handler(req, res) {
  const allowSimulation = process.env.VERCEL_ENV !== "production";
  const asOf = req.query?.asOf;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.status(200).json(classroomApiPayload(asOf, { allowSimulation }));
}
