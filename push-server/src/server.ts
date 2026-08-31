import express from "express";
import cors from "cors";

import { ENV } from "./config/env.js";

import { sendPushToUser } from "./services/push.service.js";
import { runReminderScheduler } from "./services/reminderSchedulerRunner.service.js";

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

    const { user_id, title, body, url, category } = req.body;

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

    const result = await sendPushToUser(user_id, {
      title: title || "Fluidity 💧",

      body: body || "Hora do check-in emocional",

      url,

      category,
    });

    /**
     * ========================================================
     * SUCCESS RESPONSE
     * ========================================================
     */

    return res.json({
      success: true,
      message:
        result.sent === 0
          ? "Nenhuma Push Notification foi entregue"
          : result.failed > 0
            ? "Push enviado parcialmente"
            : "Push enviado com sucesso",
      ...result,
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
 * REMINDER SCHEDULER
 * ============================================================
 *
 * Mantém a mesma frequência utilizada anteriormente
 * pelo scheduler local do frontend.
 */
runReminderScheduler().catch((error) => {
  console.error("REMINDER SCHEDULER ERROR:", error);
});

setInterval(() => {
  runReminderScheduler().catch((error) => {
    console.error("REMINDER SCHEDULER ERROR:", error);
  });
}, 30 * 1000);

/**
 * ============================================================
 * REMINDER SCHEDULER
 * ============================================================
 *
 * Mantém a mesma frequência utilizada anteriormente
 * pelo scheduler local do frontend.
 */
runReminderScheduler().catch((error) => {
  console.error("REMINDER SCHEDULER ERROR:", error);
});

setInterval(() => {
  runReminderScheduler().catch((error) => {
    console.error("REMINDER SCHEDULER ERROR:", error);
  });
}, 30 * 1000);

/**
 * ============================================================
 * SERVER START
 * ============================================================
 */

app.listen(ENV.PORT, () => {});
