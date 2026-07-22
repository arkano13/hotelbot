import express from "express";
import cors from "cors";
import QRCode from "qrcode";

import { UPLOADS_DIR } from "./lib/paths.js";
import { obtenerUltimoQR } from "./whatsapp/client.js";

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

app.get("/qr", async (req, res) => {
  const qr = obtenerUltimoQR();

  if (!qr) {
    return res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>No hay ningún código QR pendiente ahora mismo</h2>
          <p>Esto pasa si WhatsApp ya está conectado, o si el servidor apenas está arrancando.
          Recarga esta página en unos segundos si acabas de reiniciar el servicio.</p>
        </body>
      </html>
    `);
  }

  try {
    const imagenDataUrl = await QRCode.toDataURL(qr, { width: 320 });

    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>Escanea este código con WhatsApp</h2>
          <p>Configuración → Dispositivos vinculados → Vincular un dispositivo</p>
          <img src="${imagenDataUrl}" width="320" height="320" />
          <p style="color: #888; font-size: 13px;">Esta página se actualiza sola si recargas — el código cambia cada cierto tiempo si no lo escaneas a tiempo.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error generando el código QR: " + error.message);
  }
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