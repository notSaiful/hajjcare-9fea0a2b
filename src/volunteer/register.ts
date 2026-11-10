import { VOLUNTEER_SUPABASE_ORIGIN, volunteerClientConfig } from "./project";

const ROW_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export type VolunteerRegistrationResult =
  | { ok: true; id: string }
  | { ok: false; title: string; description: string };

export async function submitVolunteerRegistration(
  input: VolunteerRegistrationInput,
  config = volunteerClientConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<VolunteerRegistrationResult> {
  if (!config) {
    return {
      ok: false,
      title: "रजिस्ट्रेशन अभी खुला नहीं है",
      description: "Volunteer registration is not open yet.",
    };
  }
  let response: Response;
  try {
    response = await fetchImpl(`${VOLUNTEER_SUPABASE_ORIGIN}/functions/v1/volunteer-register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: config.publishableKey,
        authorization: `Bearer ${config.publishableKey}`,
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
  let body: { ok?: unknown; id?: unknown; error?: unknown } = {};
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
  if (response.ok && body.ok === true && typeof body.id === "string" && ROW_ID.test(body.id)) {
    return { ok: true, id: body.id };
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
