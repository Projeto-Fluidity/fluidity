import express from "express";
import cors from "cors";

import { ENV } from "./config/env.js";

import { sendPushToUser } from "./services/push.service.js";

/**
 * ============================================================
 * EXPRESS APP
 * ============================================================
 */

const app = express();

/**
 * ============================================================
 * CORS
 * ============================================================
 *
 * Permite comunicação entre:
 *
 * - frontend Vite local;
 * - Vercel;
 * - Railway;
 * - ambientes preview.
 *
 * ============================================================
 * IMPORTANTE
 * ============================================================
 *
 * Em produção futura:
 *
 * substituir "*" por allowlist explícita.
 */
app.use(
  cors({
    origin: true,
  }),
);

/**
 * ============================================================
 * JSON PARSER
 * ============================================================
 */

app.use(express.json());

/**
 * ============================================================
 * HEALTHCHECK
 * ============================================================
 *
 * Endpoint utilizado para:
 *
 * - monitoramento;
 * - Railway healthcheck;
 * - validação de deploy;
 * - diagnóstico rápido.
 */
app.get("/", (_, res) => {
  return res.json({
    success: true,
    service: "Fluidity Push Server",
    status: "healthy",
  });
});

/**
 * ============================================================
 * SEND PUSH
 * ============================================================
 *
 * Responsável por:
 *
 * - receber requests do frontend;
 * - localizar subscriptions;
 * - enviar push notification.
 */
app.post("/send-push", async (req, res) => {
  try {
    const { user_id, title, body, url } = req.body;

    /**
     * ========================================================
     * VALIDATION
     * ========================================================
     */

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "user_id obrigatório",
      });
    }

    /**
     * ========================================================
     * SEND PUSH
     * ========================================================
     */

    await sendPushToUser(user_id, {
      title: title || "Fluidity 💧",

      body: body || "Hora do check-in emocional",

      url,
    });

    /**
     * ========================================================
     * SUCCESS RESPONSE
     * ========================================================
     */

    return res.json({
      success: true,
      message: "Push enviado com sucesso",
    });
  } catch (err: unknown) {
    console.error("SEND PUSH ERROR:", err);

    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido";

    /**
     * ========================================================
     * ERROR RESPONSE
     * ========================================================
     */

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

/**
 * ============================================================
 * SERVER START
 * ============================================================
 */

app.listen(ENV.PORT, () => {});
