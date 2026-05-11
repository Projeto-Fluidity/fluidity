// ============================================================
// SEND PUSH FUNCTION (SUPABASE EDGE)
// TESTE DE RUNTIME (SEM WEB-PUSH)
// ============================================================

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ============================================================
// ENV
// ============================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY
);

// ============================================================
// SERVER
// ============================================================

serve(async (req) => {
  // ==========================================================
  // CORS
  // ==========================================================

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // ==========================================================
  // PREFLIGHT
  // ==========================================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    console.log("==================================");
    console.log("SEND-PUSH INICIADA");
    console.log("==================================");

    // ==========================================================
    // BODY
    // ==========================================================

    const body = await req.json();

    console.log("BODY RECEBIDO:", body);

    const device_id = body.device_id;
    const title = body.title;
    const message = body.body;
    const url = body.url;

    // ==========================================================
    // VALIDAÇÃO
    // ==========================================================

    if (!device_id) {
      console.error("device_id ausente");

      return new Response(
        JSON.stringify({
          success: false,
          error: "device_id é obrigatório",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("device_id:", device_id);

    // ==========================================================
    // BUSCAR SUBSCRIPTIONS
    // ==========================================================

    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("device_id", device_id);

    // ==========================================================
    // LOGS
    // ==========================================================

    console.log("Subscriptions encontradas:", subs?.length);

    if (error) {
      console.error("Erro Supabase:", error);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Erro ao buscar subscriptions",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!subs || subs.length === 0) {
      console.warn("Nenhuma subscription encontrada");

      return new Response(
        JSON.stringify({
          success: false,
          error: "Subscription não encontrada",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ==========================================================
    // MOCK PUSH
    // ==========================================================

    console.log("==================================");
    console.log("MOCK PUSH EXECUTADO");
    console.log("==================================");

    for (const sub of subs) {
      console.log("SUBSCRIPTION:");
      console.log({
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
      });
    }

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return new Response(
      JSON.stringify({
        success: true,
        message: "Mock funcionando",
        data: {
          device_id,
          title,
          message,
          url,
          subscriptions: subs.length,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err: unknown) {
    console.error("==================================");
    console.error("ERRO GERAL:");
    console.error(err);
    console.error("==================================");

    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
