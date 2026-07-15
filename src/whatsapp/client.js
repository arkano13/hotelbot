import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import pino from "pino";

import {
  manejarMensajeEntrante,
} from "./messageHandler.js";

const logger = pino({
  level: "silent",
});

let socket = null;
let iniciando = false;

export async function iniciarWhatsApp() {
  if (iniciando) {
    return socket;
  }

  iniciando = true;

  try {
    const { state, saveCreds } =
      await useMultiFileAuthState(
        "auth_info_baileys"
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
          console.log(
            "Escanea este código QR con WhatsApp:"
          );

          qrcode.generate(qr, {
            small: true,
          });
        }

        if (connection === "open") {
          iniciando = false;

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

            return;
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