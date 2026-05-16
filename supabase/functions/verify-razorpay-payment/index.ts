import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY_ID || !KEY_SECRET) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      service_name,
      org_gstin,
      customer_name,
      customer_email,
      status, // "paid" | "failed"
    } = body || {};

    if (
      !razorpay_order_id ||
      typeof razorpay_order_id !== "string" ||
      (status !== "paid" && status !== "failed")
    ) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize free-text invoice fields to prevent stored XSS / injection downstream.
    const safeText = (v: unknown, max: number, pattern?: RegExp): string | null => {
      if (v == null) return null;
      const s = String(v).trim().slice(0, max);
      if (!s) return null;
      if (pattern && !pattern.test(s)) return null;
      // strip control chars and HTML-significant characters
      return s.replace(/[\u0000-\u001F\u007F<>"'`]/g, "");
    };
    const safe_service_name = safeText(service_name, 120) ?? "HajjCare App Maintenance Service Fee";
    const safe_customer_name = safeText(customer_name, 100);
    const safe_customer_email = safeText(customer_email, 254, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const safe_org_gstin = safeText(org_gstin, 20, /^[0-9A-Z]+$/);

    // Fetch authoritative order details from Razorpay — never trust client-supplied amounts.
    const rpAuth = btoa(`${KEY_ID}:${KEY_SECRET}`);
    const orderResp = await fetch(
      `https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`,
      { headers: { Authorization: `Basic ${rpAuth}` } }
    );
    if (!orderResp.ok) {
      console.error("Razorpay order lookup failed:", await orderResp.text());
      return new Response(
        JSON.stringify({ error: "Unable to verify order with payment gateway" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const rpOrder = await orderResp.json();
    // Razorpay returns amount in paise (integer). Convert to rupees for invoice fields.
    const total_amount = Number(rpOrder.amount) / 100;
    // GST inclusive: total = base * 1.18 -> base = total / 1.18, gst = total - base.
    const base_amount = Math.round((total_amount / 1.18) * 100) / 100;
    const gst_amount = Math.round((total_amount - base_amount) * 100) / 100;

    // Confirm the order belongs to the authenticated user (notes set in create-razorpay-order).
    if (rpOrder?.notes?.user_id && rpOrder.notes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Order does not belong to user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let verifiedStatus: "paid" | "failed" = "failed";

    if (status === "paid") {
      if (
        typeof razorpay_payment_id !== "string" ||
        typeof razorpay_signature !== "string"
      ) {
        return new Response(
          JSON.stringify({ error: "Missing payment signature" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const expected = await hmacSha256Hex(
        KEY_SECRET,
        `${razorpay_order_id}|${razorpay_payment_id}`
      );
      if (expected !== razorpay_signature) {
        console.error("Signature mismatch for order", razorpay_order_id);
        return new Response(
          JSON.stringify({ error: "Invalid payment signature" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      verifiedStatus = "paid";
    }

    // Use service role to write invoice (RLS now blocks user writes)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: invoiceNum } = await adminClient.rpc("generate_invoice_number");
    const invoice_number =
      invoiceNum || `HC-${Date.now().toString(36).toUpperCase()}`;

    const { error: insertError } = await adminClient
      .from("billing_invoices")
      .insert({
        user_id: user.id,
        invoice_number,
        service_name: service_name || "HajjCare App Maintenance Service Fee",
        base_amount,
        gst_rate: 18.0,
        gst_amount,
        total_amount,
        razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id || null,
        payment_status: verifiedStatus,
        customer_name: customer_name || null,
        customer_email: customer_email || null,
        org_gstin: org_gstin || null,
      });

    if (insertError) {
      console.error("Invoice insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save invoice" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, invoice_number, status: verifiedStatus }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("verify-razorpay-payment error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
