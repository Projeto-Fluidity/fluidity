// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std/http/server.ts";
import webpush from "npm:web-push@3.6.6";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ============================
// ENV
// ============================
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

// ============================
// WEB PUSH CONFIG
// ============================
webpush.setVapidDetails(
  "mailto:seu@email.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// ============================
// SUPABASE CLIENT (SERVER)
// ============================
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  // ============================
  // CORS HEADERS
  // ============================
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // ============================
  // PREFLIGHT
  // ============================
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let device_id: string | undefined;

  try {
    // ============================
    // BODY
    // ============================
    const body = await req.json();
    device_id = body.device_id;

    if (!device_id) {
      return new Response(
        JSON.stringify({ error: "device_id é obrigatório" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ============================
    // BUSCAR SUBSCRIPTION
    // ============================
    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("device_id", device_id)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: "Subscription não encontrada" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // ============================
    // SUBSCRIPTION
    // ============================
    const subscription = {
      endpoint: data.endpoint,
      keys: {
        p256dh: data.p256dh,
        auth: data.auth,
      },
    };

    // ============================
    // PAYLOAD
    // ============================
    const payload = JSON.stringify({
      title: "💧 Hora do seu check-in",
      body: "Que tal registrar como você está se sentindo?",
    });

    // ============================
    // ENVIAR PUSH
    // ============================
    await webpush.sendNotification(subscription, payload);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err: unknown) {
  console.error("Erro ao enviar push:", err);

  if (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err
    ) {
      const statusCode = (err as { statusCode?: number }).statusCode;

        if (statusCode === 410 || statusCode === 404) {
          try {
            if (device_id) {
              await supabase
                .from("push_subscriptions")
                .delete()
                .eq("device_id", device_id);
            }
          } catch (cleanupErr) {
            console.error("Erro ao limpar subscription:", cleanupErr);
          }
        }
      }

      return new Response(
        JSON.stringify({ error: "Erro interno" }),
        {
          status: 500,
          headers: corsHeaders,
        }
  );
}

  return new Response(
    JSON.stringify({ error: "Erro interno" }),
    {
      status: 500,
      headers: corsHeaders,
    }
  ); 
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-push' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
