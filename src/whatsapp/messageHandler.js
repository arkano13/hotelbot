import fs from "fs";
import path from "path";
import crypto from "crypto";
import pino from "pino";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

import {
  actualizarEstadoConversacion,
  obtenerConversacionConHistorial,
  obtenerOCrearConversacion,
} from "../conversations/service.js";

import { guardarMensaje } from "../messages/service.js";
import { generarRespuestaGemini, transcribirAudio } from "../ai/gemini.js";
import { obtenerConfiguracionBot } from "../configuracion/service.js";

import { registrarComprobantes } from "../pagos/service.js";

const loggerDescarga = pino({ level: "silent" });

const mensajesPendientes = new Map();
const TIEMPO_ESPERA = 3000;

const mensajesProcesados = new Map();
const TIEMPO_RETENCION_IDS = 10 * 60 * 1000;


function yaFueProcesado(messageId) {
  if (!messageId) {
    return false;
  }

  const ahora = Date.now();

  for (const [id, expiracion] of mensajesProcesados) {
    if (expiracion < ahora) {
      mensajesProcesados.delete(id);
    }
  }

  if (mensajesProcesados.has(messageId)) {
    return true;
  }

  mensajesProcesados.set(messageId, ahora + TIEMPO_RETENCION_IDS);

  return false;
}

const OWNER_PHONE = String(process.env.OWNER_PHONE ?? "")
  .replace(/\D/g, "")
  .trim();

function limpiarJid(jid) {
  return String(jid ?? "")
    .replace("@s.whatsapp.net", "")
    .replace("@lid", "")
    .replace(/\D/g, "")
    .trim();
}

function obtenerTelefonoMensaje(message) {
  const jidAlternativo = message.key?.remoteJidAlt;

  const jidPrincipal = message.key?.remoteJid;

  return limpiarJid(jidAlternativo || jidPrincipal);
}

function obtenerTextoMensaje(message) {
  return (
    message.message?.conversation ||
    message.message?.extendedTextMessage?.text ||
    message.message?.imageMessage?.caption ||
    message.message?.videoMessage?.caption ||
    message.message?.buttonsResponseMessage?.selectedButtonId ||
    message.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ""
  ).trim();
}

function formatearTelefono(telefono) {
  const numero = String(telefono ?? "").replace(/\D/g, "");

  const sinPais = numero.startsWith("504") ? numero.slice(3) : numero;

  if (sinPais.length === 8) {
    return `${sinPais.slice(0, 4)}-${sinPais.slice(4)}`;
  }

  return sinPais;
}

function formatearFechaCorta(fecha) {
  if (!fecha) return "N/A";

  return new Date(fecha).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function procesarComprobante({ socket, jid, telefono, message }) {
  const conversacion = await obtenerOCrearConversacion(telefono);

  const reservaIds = Array.isArray(conversacion.reservaIds)
    ? conversacion.reservaIds.filter(Boolean)
    : conversacion.reservaId
      ? [conversacion.reservaId]
      : [];

  if (reservaIds.length === 0) {
    await socket.sendMessage(jid, {
      text: "No encontré una reserva activa asociada a este número. Primero completemos la reserva y luego me puedes enviar el comprobante.",
    });

    return;
  }

  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger: loggerDescarga,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  const mimetype = message.message?.imageMessage?.mimetype ?? "image/jpeg";

  const extension = mimetype.includes("png") ? "png" : "jpg";

  const carpeta = path.join(process.cwd(), "uploads", "comprobantes");

  await fs.promises.mkdir(carpeta, { recursive: true });

  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const rutaArchivo = path.join(carpeta, nombreArchivo);

  await fs.promises.writeFile(rutaArchivo, buffer);

  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  const comprobanteUrl = `${baseUrl}/uploads/comprobantes/${nombreArchivo}`;

  const pagos = await registrarComprobantes({
    reservaIds,
    comprobanteUrl,
  });

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: "[Envió comprobante de pago]",
  });

  const textoRespuesta =
    `Recibí tu comprobante ✅\n` +
    `${pagos.length === 1 ? "Código de revisión" : "Códigos de revisión"}: ${pagos
      .map((pago) => pago.codigo)
      .join(", ")}\n` +
    `En cuanto el hotel lo confirme, te aviso por aquí.`;

  await socket.sendMessage(jid, {
    text: textoRespuesta,
  });

  // Importante: sin esto, la IA no se entera de que ya se recibió el
  // comprobante (esta respuesta no pasa por Gemini, se manda directo) y el
  // step se queda en ESPERANDO_PAGO para siempre — causaba que la IA
  // volviera a mandar los datos bancarios ante cualquier mensaje después,
  // como un simple "gracias".
  await guardarMensaje({
    conversationId: conversacion.id,
    role: "ASSISTANT",
    content: textoRespuesta,
  });

  await actualizarEstadoConversacion(conversacion.id, {
    step: "COMPLETADO",
  });

  if (OWNER_PHONE) {
    const pagoPrincipal = pagos[0];
    const reserva = pagoPrincipal.reserva;
    const cliente = reserva?.cliente;
    const codigosReservas = pagos
      .map((pago) => pago.reserva?.codigo ?? "N/A")
      .join(", ");
    const montoTotal = pagos.reduce(
      (total, pago) => total + Number(pago.monto),
      0,
    );
    const comandos = pagos
      .map(
        (pago) =>
          `/${pago.codigo} aprobar\n/${pago.codigo} rechazar [motivo]`,
      )
      .join("\n");

    await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, {
      image: buffer,
      caption:
        `📸 Nuevo comprobante — ${pagos.map((pago) => pago.codigo).join(", ")}\n` +
        `Reserva${pagos.length > 1 ? "s" : ""}: ${codigosReservas} | Conversación: ${
          conversacion.codigo
        }\n` +
        `Cliente: ${cliente?.nombre ?? "N/A"} (${formatearTelefono(
          telefono,
        )})\n` +
        `Fechas: ${formatearFechaCorta(
          reserva?.fechaEntrada,
        )} → ${formatearFechaCorta(reserva?.fechaSalida)}\n` +
        `Monto esperado total: L. ${montoTotal.toFixed(2)}\n\n` +
        `Responde:\n${comandos}`,
    });
  }
}

async function transcribirNotaDeVoz(message, socket) {
  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger: loggerDescarga,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  const mimetype = message.message?.audioMessage?.mimetype ?? "audio/ogg";

  return transcribirAudio(buffer, mimetype);
}

async function procesarMensajesAgrupados({ socket, jid, telefono, textos }) {
  const textoCompleto = textos.join(" ").trim();

  if (!textoCompleto) {
    return;
  }

  console.log(`📩 ${telefono}: ${textoCompleto}`);

  const conversacion = await obtenerOCrearConversacion(telefono);

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: textoCompleto,
  });

  if (conversacion.mode === "HUMANO") {
    console.log(`👤 Conversación ${conversacion.codigo} está en modo HUMANO`);

    return;
  }

  const configuracionBot = await obtenerConfiguracionBot();

  if (!configuracionBot.activo) {
    console.log(`🔌 Bot apagado globalmente, no se responde a ${telefono}`);

    return;
  }

  const conversacionConHistorial = await obtenerConversacionConHistorial(
    telefono,
    15,
  );

  let respuesta;

  try {
    respuesta = await generarRespuestaGemini({
      messages: conversacionConHistorial?.messages ?? [],

      step: conversacionConHistorial?.step ?? conversacion.step,

      telefono,

      conversationId: conversacion.id,

      socket,
      jid,
    });
  } catch (error) {
    console.error("❌ Error generando respuesta con Gemini:", error);

    if (error?.status === 429) {
      respuesta =
        "El asistente está temporalmente ocupado. Intenta nuevamente más tarde.";
    } else if (error?.status === 503 || error?.status === 504) {
      respuesta =
        "El asistente está ocupado. Intenta nuevamente en unos momentos.";
    } else {
      respuesta = "Disculpa, tuve un problema al procesar tu mensaje.";
    }
  }

  if (!respuesta?.trim()) {
    respuesta = "Disculpa, no pude procesar tu mensaje.";
  }

  await socket.sendMessage(jid, {
    text: respuesta,
  });

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "ASSISTANT",
    content: respuesta,
  });

  console.log(`🤖 ${conversacion.codigo}: ${respuesta}`);
}

export async function manejarMensajeEntrante({ socket, message }) {
  if (!message?.message || message.key?.fromMe) {
    return;
  }

  if (yaFueProcesado(message.key?.id)) {
    console.log(`🔁 Mensaje duplicado ignorado: ${message.key?.id}`);

    return;
  }

  const jid = message.key?.remoteJid;

  if (!jid || jid === "status@broadcast" || jid.endsWith("@g.us")) {
    return;
  }

  const telefono = obtenerTelefonoMensaje(message);

  if (OWNER_PHONE && telefono === OWNER_PHONE) {
    // El dueño ya no usa un menú por WhatsApp — administra todo desde la
    // app. El bot solo le sigue mandando resúmenes automáticos (eso lo
    // maneja aparte reportes/Scheduler.js, sin depender de este mensaje).
    return;
  }

  const esImagen = Boolean(message.message?.imageMessage);

  if (esImagen) {
    try {
      await procesarComprobante({
        socket,
        jid,
        telefono,
        message,
      });
    } catch (error) {
      console.error("❌ Error procesando comprobante:", error);

      await socket.sendMessage(jid, {
        text: "Tuve un problema al recibir la imagen. ¿Puedes intentar enviarla de nuevo?",
      });
    }

    return;
  }

  const esAudio = Boolean(message.message?.audioMessage);

  let texto;

  if (esAudio) {
    const duracion = Number(message.message?.audioMessage?.seconds || 0);

    const maximoSegundos = Number(process.env.MAX_AUDIO_SECONDS || 180);

    if (duracion > maximoSegundos) {
      await socket.sendMessage(jid, {
        text: `El audio es demasiado largo. Envíame uno de máximo ${Math.floor(
          maximoSegundos / 60,
        )} minutos o escribe el mensaje.`,
      });

      return;
    }

    try {
      texto = await transcribirNotaDeVoz(message, socket);
    } catch (error) {
      console.error("❌ Error transcribiendo audio:", error);

      await socket.sendMessage(jid, {
        text: "Tuve un problema al escuchar tu audio. ¿Puedes escribirlo o intentar enviarlo de nuevo?",
      });

      return;
    }

    if (texto === "[audio no entendido]") {
      await socket.sendMessage(jid, {
        text: "No logré entender tu audio 😅 ¿Puedes repetirlo o escribirlo?",
      });

      return;
    }
  } else {
    texto = obtenerTextoMensaje(message);
  }

  if (!texto) {
    return;
  }

  const pendiente = mensajesPendientes.get(jid) ?? {
    textos: [],
    timeout: null,
  };

  pendiente.textos.push(texto);

  if (pendiente.timeout) {
    clearTimeout(pendiente.timeout);
  }

  pendiente.timeout = setTimeout(async () => {
    const datos = mensajesPendientes.get(jid);

    mensajesPendientes.delete(jid);

    if (!datos) {
      return;
    }

    try {
      await procesarMensajesAgrupados({
        socket,
        jid,
        telefono,
        textos: datos.textos,
      });
    } catch (error) {
      console.error("❌ Error procesando mensajes:", error);
    }
  }, TIEMPO_ESPERA);

  mensajesPendientes.set(jid, pendiente);
}