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

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
    // ==========================================================
    // BODY
    // ==========================================================

    const body = await req.json();

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
        },
      );
    }

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
        },
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
        },
      );
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
      },
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido";

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
      },
    );
  }
});
