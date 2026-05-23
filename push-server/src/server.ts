import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  sendPushToDevice,
} from "./services/push.service.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================================================
// HEALTH
// ============================================================

app.get("/", (_, res) => {
  return res.json({
    success: true,
    service: "Fluidity Push Server",
  });
});

// ============================================================
// SEND PUSH
// ============================================================

app.post("/send-push", async (req, res) => {
  try {
    const {
      device_id,
      title,
      body,
      url,
    } = req.body;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!device_id) {
      return res.status(400).json({
        success: false,
        error: "device_id obrigatório",
      });
    }

    // ========================================================
    // SEND PUSH
    // ========================================================

    await sendPushToDevice(
      device_id,
      {
        title: title || "Fluidity 💧",
        body: body || "Hora do check-in emocional",
        url,
      }
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.json({
      success: true,
      message: "Push enviado com sucesso",
    });

  } catch (err: unknown) {
    console.error("SEND PUSH ERROR:", err);

    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Push Server running on ${PORT}`);
});
