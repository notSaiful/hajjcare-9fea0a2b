import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;
    const city = formData.get("city") as string;
    const document = formData.get("document") as File | null;

    // Validate required fields
    if (!name || !mobile || !city) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate mobile format (10 digits)
    if (!/^[0-9]{10}$/.test(mobile)) {
      return new Response(
        JSON.stringify({ error: "Invalid mobile number format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate document
    if (!document) {
      return new Response(
        JSON.stringify({ error: "Document upload required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check file size
    if (document.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "File size must be under 2MB" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(document.type)) {
      return new Response(
        JSON.stringify({ error: "Only PDF and image files allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate application ID
    const cityCode = city.substring(0, 4).toUpperCase().padEnd(4, "X");
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const applicationId = `${cityCode}-${randomPart}`;

    // Upload document to storage
    const fileExt = document.name.split(".").pop();
    const filePath = `${applicationId}/${Date.now()}.${fileExt}`;
    const fileBuffer = await document.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("proof-documents")
      .upload(filePath, fileBuffer, {
        contentType: document.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload document" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Document validated and uploaded successfully",
        applicationId,
        filePath,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
