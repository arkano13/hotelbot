import express from "express";
import cors from "cors";
import QRCode from "qrcode";

import { UPLOADS_DIR } from "./lib/paths.js";
import { obtenerUltimoQR, solicitarCodigoVinculacion } from "./whatsapp/client.js";

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
        <head><meta http-equiv="refresh" content="5"></head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>No hay ningún código QR pendiente ahora mismo</h2>
          <p>Esto pasa si WhatsApp ya está conectado, o si el servidor apenas está arrancando.
          Esta página se recarga sola cada 5 segundos.</p>
        </body>
      </html>
    `);
  }

  try {
    const imagenDataUrl = await QRCode.toDataURL(qr, { width: 320 });

    res.send(`
      <html>
        <head><meta http-equiv="refresh" content="15"></head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>Escanea este código con WhatsApp</h2>
          <p>Configuración → Dispositivos vinculados → Vincular un dispositivo</p>
          <img src="${imagenDataUrl}" width="320" height="320" />
          <p style="color: #888; font-size: 13px;">El código vence cada 20-30 segundos — esta página se refresca sola cada 15 segundos para que siempre veas uno vigente. Escanéalo apenas la veas, no la dejes abierta esperando.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error generando el código QR: " + error.message);
  }
});

app.get("/pair", async (req, res) => {
  const telefono = req.query.telefono;

  if (!telefono) {
    return res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>Vincular por código</h2>
          <p>Escribe el número de WhatsApp que va a usar el bot, en formato internacional, sin "+" ni espacios.</p>
          <form method="get" action="/pair">
            <input name="telefono" placeholder="50499999999" style="font-size: 18px; padding: 8px; width: 220px;" />
            <button type="submit" style="font-size: 18px; padding: 8px 16px;">Pedir código</button>
          </form>
        </body>
      </html>
    `);
  }

  try {
    const codigo = await solicitarCodigoVinculacion(telefono);

    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>Tu código de vinculación</h2>
          <p style="font-size: 42px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${codigo}</p>
          <p>En el celular con el número <strong>${telefono}</strong>: abre WhatsApp → Configuración → Dispositivos vinculados → Vincular un dispositivo → "Vincular con número de teléfono en su lugar", y escribe este código.</p>
          <p style="color: #888; font-size: 13px;">Este código vence en unos minutos — si tarda demasiado, recarga esta misma página para pedir uno nuevo.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(
      `<html><body style="font-family: sans-serif; text-align: center; padding: 40px;"><h2>Error</h2><p>${error.message}</p><p><a href="/pair">Volver a intentar</a></p></body></html>`
    );
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