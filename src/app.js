import express from "express";
import cors from "cors";

import { UPLOADS_DIR } from "./lib/paths.js";

import tarifasRoutes from "./tarifas/routes.js";
import clientesRoutes from "./clientes/routes.js";
import disponibilidadRoutes from "./disponibilidad/routes.js";
import reservasRoutes from "./reservas/routes.js";
import pagosRoutes from "./pagos/routes.js";
import adminRoutes from "./admin/routes.js";

import { requireApiKey } from "./lib/auth.js";
import { apiLimiter } from "./lib/rateLimit.js";

const app = express();

const ORIGENES_PERMITIDOS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: ORIGENES_PERMITIDOS.length ? ORIGENES_PERMITIDOS : false,
  })
);

app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API del hotel funcionando",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiLimiter, requireApiKey);

app.use("/api/tarifas", tarifasRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/admin", adminRoutes);


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

export { app };