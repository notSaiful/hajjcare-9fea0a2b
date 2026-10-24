import { supabase } from "@/integrations/supabase/client";

/**
 * Public Mapbox token from the get-mapbox-token edge function.
 * The page does not require a signed-in user. A 404 means the function
 * is not deployed; a 503 means MAPBOX_PUBLIC_TOKEN is unset.
 */
export async function fetchMapboxToken(): Promise<string> {
  const base = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !anon) {
    throw new Error("Map service is not configured in this build.");
  }

  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${base}/functions/v1/get-mapbox-token`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${session?.access_token || anon}`,
    },
  });

  let body: { token?: string; error?: string } = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (response.status === 404) {
    throw new Error("The live map is unavailable because get-mapbox-token is not deployed.");
  }
  if (!response.ok || !body.token) {
    throw new Error(body.error || "Unable to load the map.");
  }
  return body.token;
}
