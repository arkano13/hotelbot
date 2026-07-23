import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import pino from "pino";
import fs from "fs";

import {
  manejarMensajeEntrante,
} from "./messageHandler.js";

import { enviarAlerta } from "../lib/alertas.js";
import { AUTH_DIR } from "../lib/paths.js";

const logger = pino({
  level: "silent",
});

let socket = null;
let cerrandoIntencionalmente = false;
let iniciando = false;
let intentosReconexionFallidos = 0;
let ultimoQR = null;

export function obtenerUltimoQR() {
  return ultimoQR;
}

// Se llama cuando el servidor se está apagando de forma controlada (por
// ejemplo, en cada despliegue de Railway). Cierra el socket de WhatsApp
// avisando explícitamente "me estoy desconectando normal", en vez de
// dejar la conexión colgada — eso evita que WhatsApp lo interprete luego
// como un conflicto de sesión y fuerce un cierre de sesión real, que
// obligaría a escanear el QR de nuevo sin necesidad.
export async function cerrarWhatsAppLimpio() {
  if (!socket) return;

  cerrandoIntencionalmente = true;

  try {
    socket.end(undefined);
  } catch {
    // No pasa nada si ya estaba cerrado o falla — el proceso va a
    // terminar de todas formas.
  }

  socket = null;
}

export async function reiniciarSesionWhatsApp() {
  await fs.promises
    .rm(AUTH_DIR, { recursive: true, force: true })
    .catch((error) =>
      console.error("❌ Error borrando la sesión vieja:", error)
    );

  ultimoQR = null;

  if (socket) {
    try {
      socket.end(undefined);
    } catch {
      // No pasa nada si ya estaba cerrado.
    }
  }

  socket = null;
  iniciando = false;

  return iniciarWhatsApp();
}

const UMBRAL_ALERTA_RECONEXION = 5;

export async function iniciarWhatsApp() {
  if (iniciando) {
    return socket;
  }

  iniciando = true;

  try {
    const { state, saveCreds } =
      await useMultiFileAuthState(
        AUTH_DIR
      );

    socket = makeWASocket({
      auth: state,
      logger,
      printQRInTerminal: false,
    });

    socket.ev.on("creds.update", saveCreds);

    socket.ev.on(
      "connection.update",
      async (update) => {
        const {
          connection,
          lastDisconnect,
          qr,
        } = update;

        if (qr) {
          ultimoQR = qr;

          console.log(
            "Escanea este código QR con WhatsApp (o entra a /qr en el navegador si no se ve bien aquí):"
          );

          qrcode.generate(qr, {
            small: true,
          });
        }

        if (connection === "open") {
          iniciando = false;
          intentosReconexionFallidos = 0;
          ultimoQR = null;

          console.log("✅ WhatsApp conectado");
        }

        if (connection === "close") {
          iniciando = false;

          if (cerrandoIntencionalmente) {
            console.log(
              "🛑 WhatsApp desconectado por apagado normal del servidor — no se toca la sesión guardada."
            );

            return;
          }

          const statusCode =
            lastDisconnect?.error?.output
              ?.statusCode;

          const sesionCerrada =
            statusCode ===
            DisconnectReason.loggedOut;

          console.log("⚠️ WhatsApp desconectado");

          if (sesionCerrada) {
            console.log(
              "La sesión fue cerrada. Borrando auth_info_baileys y generando un código QR nuevo automáticamente..."
            );

            await fs.promises
              .rm(AUTH_DIR, { recursive: true, force: true })
              .catch((error) =>
                console.error("❌ Error borrando la sesión vieja:", error)
              );

            enviarAlerta(
              "whatsapp-sesion-cerrada",
              "WhatsApp: sesión cerrada",
              "La sesión de WhatsApp del bot se cerró. Se generó un código QR nuevo automáticamente — entra a /qr para escanearlo."
            ).catch(console.error);

            iniciarWhatsApp();

            return;
          }

          intentosReconexionFallidos += 1;

          if (
            intentosReconexionFallidos ===
            UMBRAL_ALERTA_RECONEXION
          ) {
            enviarAlerta(
              "whatsapp-reconexion-fallida",
              "WhatsApp: problemas de conexión",
              `El bot lleva ${UMBRAL_ALERTA_RECONEXION} intentos seguidos sin poder reconectarse a WhatsApp. Revisa el servidor.`
            ).catch(console.error);
          }

          console.log(
            "Intentando reconectar..."
          );

          setTimeout(() => {
            iniciarWhatsApp().catch(
              console.error
            );
          }, 3000);
        }
      }
    );

    socket.ev.on(
      "messages.upsert",
      async ({ messages, type }) => {
        if (type !== "notify") {
          return;
        }

        for (const message of messages) {
          try {
            await manejarMensajeEntrante({
              socket,
              message,
            });
          } catch (error) {
            console.error(
              "❌ Error procesando mensaje:",
              error
            );
          }
        }
      }
    );

    return socket;
  } catch (error) {
    iniciando = false;
    throw error;
  }
}

export function obtenerWhatsAppSocket() {
  if (!socket) {
    throw new Error(
      "WhatsApp todavía no está conectado"
    );
  }

  return socket;
}