import {
  obtenerOCrearConversacion,
  obtenerConversacionConHistorial,
} from "../conversations/service.js";

import { guardarMensaje } from "../messages/service.js";
import { generarRespuestaGemini } from "../ai/gemini.js";

const mensajesPendientes = new Map();
const TIEMPO_ESPERA = 3000;

function obtenerTelefonoDesdeJid(jid) {
  return String(jid ?? "")
    .replace("@s.whatsapp.net", "")
    .replace("@lid", "")
    .trim();
}

function obtenerTextoMensaje(message) {
  return (
    message.message?.conversation ||
    message.message?.extendedTextMessage?.text ||
    message.message?.imageMessage?.caption ||
    message.message?.videoMessage?.caption ||
    ""
  ).trim();
}

async function procesarMensajesAgrupados({
  socket,
  jid,
  telefono,
  textos,
}) {
  const textoCompleto = textos.join(" ").trim();

  if (!textoCompleto) {
    return;
  }

  console.log(`📩 ${telefono}: ${textoCompleto}`);

  const conversacion =
    await obtenerOCrearConversacion(telefono);

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: textoCompleto,
  });

  if (conversacion.mode === "HUMANO") {
    console.log(
      `👤 Conversación ${telefono} está en modo HUMANO`
    );

    return;
  }

  const conversacionConHistorial =
    await obtenerConversacionConHistorial(
      telefono,
      15
    );

  let respuesta;

  try {
    respuesta = await generarRespuestaGemini({
      messages:
        conversacionConHistorial?.messages ?? [],
      step:
        conversacionConHistorial?.step ??
        conversacion.step,
      telefono,
      conversationId: conversacion.id,
    });
  } catch (error) {
    console.error(
      "❌ Error generando respuesta con Gemini:",
      error
    );

    if (error?.status === 429) {
      respuesta =
        "Disculpa, el asistente está temporalmente ocupado. Intenta nuevamente más tarde.";
    } else {
      respuesta =
        "Disculpa, tuve un problema al procesar tu mensaje. Inténtalo nuevamente.";
    }
  }

  if (!respuesta?.trim()) {
    respuesta =
      "Disculpa, no pude generar una respuesta. Inténtalo nuevamente.";
  }

  await socket.sendMessage(jid, {
    text: respuesta,
  });

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "ASSISTANT",
    content: respuesta,
  });

  console.log(`🤖 ${telefono}: ${respuesta}`);
}

export async function manejarMensajeEntrante({
  socket,
  message,
}) {
  if (!message?.message || message.key?.fromMe) {
    return;
  }

  const jid = message.key?.remoteJid;

  if (
    !jid ||
    jid === "status@broadcast" ||
    jid.endsWith("@g.us")
  ) {
    return;
  }

  const texto = obtenerTextoMensaje(message);

  if (!texto) {
    return;
  }

  const telefono = obtenerTelefonoDesdeJid(jid);

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
      console.error(
        "❌ Error procesando mensajes:",
        error
      );
      if (error?.status === 429) {
  respuesta =
    "El asistente alcanzó temporalmente su límite de uso. Intenta nuevamente más tarde.";
} else if (error?.status === 503 || error?.status === 504) {
  respuesta =
    "El asistente está temporalmente ocupado. Por favor, intenta nuevamente en unos momentos.";
} else {
  respuesta =
    "Disculpa, tuve un problema al procesar tu mensaje. Inténtalo nuevamente.";
}
    }
  }, TIEMPO_ESPERA);

  mensajesPendientes.set(jid, pendiente);
}