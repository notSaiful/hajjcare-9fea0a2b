import { MAIN_SUPABASE_ORIGIN } from "../../supabase/functions/volunteer-register/handler";

const ROW_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VOLUNTEER_CODE = /^V-[A-Z]{3}-[A-Z]{3}-[0-9]{4}$/;

export interface VolunteerRegistrationInput {
  full_name: string;
  father_name: string;
  age: number;
  mobile: string;
  whatsapp: string;
  email: string;
  full_address: string;
  city: string;
  district: string;
  state: string;
  embarkation_point: string;
  skills: string[];
  availability_days: string;
  duty_location: string;
  languages: string[];
  other_language: string;
  declaration_agreed: boolean;
  consent_privacy: boolean;
  consent_terms: boolean;
  company_website: string;
}

export interface VolunteerClientConfig {
  url: string;
  publishableKey: string;
  accessToken?: string;
}

export type VolunteerRegistrationResult =
  | { ok: true; id: string; volunteerId: string }
  | { ok: false; title: string; description: string };

function viteValue(name: string): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return env?.[name]?.trim() ?? "";
}

export function mainVolunteerClientConfig(accessToken = ""): VolunteerClientConfig | null {
  const url = viteValue("VITE_SUPABASE_URL");
  const publishableKey = viteValue("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !publishableKey) return null;
  if (url.replace(/\/$/, "") !== MAIN_SUPABASE_ORIGIN) return null;
  if (publishableKey.startsWith("sb_secret_") || /service[-_]?role/i.test(publishableKey)) return null;
  return { url: MAIN_SUPABASE_ORIGIN, publishableKey, accessToken };
}

export async function submitVolunteerRegistration(
  input: VolunteerRegistrationInput,
  config = mainVolunteerClientConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<VolunteerRegistrationResult> {
  if (!config) {
    return {
      ok: false,
      title: "रजिस्ट्रेशन अभी खुला नहीं है",
      description: "Volunteer registration is not open yet.",
    };
  }
  const token = config.accessToken?.trim() || config.publishableKey;
  let response: Response;
  try {
    response = await fetchImpl(`${MAIN_SUPABASE_ORIGIN}/functions/v1/volunteer-register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: config.publishableKey,
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
  } catch {
    return {
      ok: false,
      title: "रजिस्ट्रेशन में त्रुटि",
      description: "The registration could not be sent. Please try again.",
    };
  }
  let body: { ok?: unknown; id?: unknown; volunteer_id?: unknown; error?: unknown } = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  if (response.status === 409 || body.error === "duplicate") {
    return {
      ok: false,
      title: "इस मोबाइल नंबर से पहले ही रजिस्ट्रेशन हो चुका है",
      description: "This mobile number is already registered.",
    };
  }
  if (response.status === 429 || body.error === "rate_limited") {
    return {
      ok: false,
      title: "बहुत अधिक प्रयास",
      description: "Too many attempts from this network or mobile number. Please wait and try again.",
    };
  }
  if (response.status === 401) {
    return {
      ok: false,
      title: "साइन-इन की जाँच नहीं हो सकी",
      description: "Your sign-in could not be confirmed. Sign in again, or submit without an account.",
    };
  }
  if (
    response.ok
    && body.ok === true
    && typeof body.id === "string"
    && ROW_ID.test(body.id)
    && typeof body.volunteer_id === "string"
    && VOLUNTEER_CODE.test(body.volunteer_id)
  ) {
    return { ok: true, id: body.id, volunteerId: body.volunteer_id };
  }
  if (response.status === 400) {
    return {
      ok: false,
      title: "कृपया फ़ॉर्म जाँचें",
      description: "Please check the form and try again. Nothing was saved.",
    };
  }
  return {
    ok: false,
    title: "रजिस्ट्रेशन में त्रुटि",
    description: "The server did not confirm the registration. Nothing was saved.",
  };
}
