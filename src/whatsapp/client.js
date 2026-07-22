import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import pino from "pino";

import {
  manejarMensajeEntrante,
} from "./messageHandler.js";

import { enviarAlerta } from "../lib/alertas.js";
import { AUTH_DIR } from "../lib/paths.js";

const logger = pino({
  level: "silent",
});

let socket = null;
let iniciando = false;
let intentosReconexionFallidos = 0;
let ultimoQR = null;

export function obtenerUltimoQR() {
  return ultimoQR;
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

          const statusCode =
            lastDisconnect?.error?.output
              ?.statusCode;

          const sesionCerrada =
            statusCode ===
            DisconnectReason.loggedOut;

          console.log("⚠️ WhatsApp desconectado");

          if (sesionCerrada) {
            console.log(
              "La sesión fue cerrada. Borra auth_info_baileys y vuelve a escanear."
            );

            enviarAlerta(
              "whatsapp-sesion-cerrada",
              "WhatsApp: sesión cerrada",
              "La sesión de WhatsApp del bot se cerró. Hay que volver a escanear el código QR desde el servidor para reconectar."
            ).catch(console.error);

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