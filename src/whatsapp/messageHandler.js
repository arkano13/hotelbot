import {
  cambiarModoConversacion,
  listarConversacionesActivas,
  obtenerConversacionConHistorial,
  obtenerConversacionPorCodigo,
  obtenerOCrearConversacion,
} from "../conversations/service.js";

import { guardarMensaje } from "../messages/service.js";
import { generarRespuestaGemini } from "../ai/gemini.js";

const mensajesPendientes = new Map();
const TIEMPO_ESPERA = 3000;

const OWNER_PHONE = String(
  process.env.OWNER_PHONE ?? ""
)
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
  const jidAlternativo =
    message.key?.remoteJidAlt;

  const jidPrincipal =
    message.key?.remoteJid;

  return limpiarJid(
    jidAlternativo || jidPrincipal
  );
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

function formatearTelefono(telefono) {
  const numero = String(telefono ?? "")
    .replace(/\D/g, "");

  const sinPais = numero.startsWith("504")
    ? numero.slice(3)
    : numero;

  if (sinPais.length === 8) {
    return `${sinPais.slice(0, 4)}-${sinPais.slice(4)}`;
  }

  return sinPais;
}

async function enviarMenuJefe(socket, jid) {
  const conversaciones =
    await listarConversacionesActivas();

  const conversacionesClientes =
    conversaciones.filter(
      (conversacion) =>
        conversacion.telefono !== OWNER_PHONE
    );

  if (conversacionesClientes.length === 0) {
    await socket.sendMessage(jid, {
      text: "No hay conversaciones activas.",
    });

    return;
  }

  const filas = conversacionesClientes.map(
    (conversacion) => {
      const codigo =
        conversacion.codigo || "SIN-CODIGO";

      const telefono = formatearTelefono(
        conversacion.telefono
      );

      const modo =
        conversacion.mode === "HUMANO"
          ? "👤 HUMANO"
          : "🤖 BOT";

      return `${codigo} | ${telefono} | ${modo}`;
    }
  );

  const texto = [
    "💬 Conversaciones activas",
    "",
    ...filas,
    "",
    "Comandos:",
    "/C1234 humano",
    "/C1234 bot",
  ].join("\n");

  await socket.sendMessage(jid, {
    text: texto,
  });
}

async function procesarComandoJefe({
  socket,
  jid,
  texto,
}) {
  const comando = texto
    .trim()
    .toLowerCase();

  if (comando === "/menu") {
    await enviarMenuJefe(socket, jid);
    return;
  }

  const coincidencia = comando.match(
    /^\/(c\d+)\s+(humano|bot)$/i
  );

  if (!coincidencia) {
    await socket.sendMessage(jid, {
      text: "Escribe /menu para ver las conversaciones.",
    });

    return;
  }

  const codigo =
    coincidencia[1].toUpperCase();

  const modo =
    coincidencia[2].toLowerCase() ===
    "humano"
      ? "HUMANO"
      : "BOT";

  let conversacion;

  try {
    conversacion =
      await obtenerConversacionPorCodigo(
        codigo
      );
  } catch {
    await socket.sendMessage(jid, {
      text: `No encontré la conversación ${codigo}. Escribe /menu.`,
    });

    return;
  }

  await cambiarModoConversacion(
    conversacion.id,
    modo
  );

  const telefono = formatearTelefono(
    conversacion.telefono
  );

  const respuesta =
    modo === "HUMANO"
      ? `✅ ${codigo} (${telefono}) ahora está en modo HUMANO. Puedes responder desde el WhatsApp del hotel.`
      : `✅ ${codigo} (${telefono}) volvió al modo BOT.`;

  await socket.sendMessage(jid, {
    text: respuesta,
  });
}

async function procesarMensajesAgrupados({
  socket,
  jid,
  telefono,
  textos,
}) {
  const textoCompleto = textos
    .join(" ")
    .trim();

  if (!textoCompleto) {
    return;
  }

  console.log(
    `📩 ${telefono}: ${textoCompleto}`
  );

  const conversacion =
    await obtenerOCrearConversacion(
      telefono
    );

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: textoCompleto,
  });

  if (
    conversacion.mode === "HUMANO"
  ) {
    console.log(
      `👤 Conversación ${conversacion.codigo} está en modo HUMANO`
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
    respuesta =
      await generarRespuestaGemini({
        messages:
          conversacionConHistorial
            ?.messages ?? [],

        step:
          conversacionConHistorial
            ?.step ??
          conversacion.step,

        telefono,

        conversationId:
          conversacion.id,

        socket,
        jid,
      });
  } catch (error) {
    console.error(
      "❌ Error generando respuesta con Gemini:",
      error
    );

    if (error?.status === 429) {
      respuesta =
        "El asistente está temporalmente ocupado. Intenta nuevamente más tarde.";
    } else if (
      error?.status === 503 ||
      error?.status === 504
    ) {
      respuesta =
        "El asistente está ocupado. Intenta nuevamente en unos momentos.";
    } else {
      respuesta =
        "Disculpa, tuve un problema al procesar tu mensaje.";
    }
  }

  if (!respuesta?.trim()) {
    respuesta =
      "Disculpa, no pude procesar tu mensaje.";
  }

  await socket.sendMessage(jid, {
    text: respuesta,
  });

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "ASSISTANT",
    content: respuesta,
  });

  console.log(
    `🤖 ${conversacion.codigo}: ${respuesta}`
  );
}

export async function manejarMensajeEntrante({
  socket,
  message,
}) {
  if (
    !message?.message ||
    message.key?.fromMe
  ) {
    return;
  }

  const jid =
    message.key?.remoteJid;

  if (
    !jid ||
    jid === "status@broadcast" ||
    jid.endsWith("@g.us")
  ) {
    return;
  }

  const texto =
    obtenerTextoMensaje(message);

  if (!texto) {
    return;
  }

  const telefono =
    obtenerTelefonoMensaje(message);

  if (
    OWNER_PHONE &&
    telefono === OWNER_PHONE
  ) {
    await procesarComandoJefe({
      socket,
      jid,
      texto,
    });

    return;
  }

  const pendiente =
    mensajesPendientes.get(jid) ?? {
      textos: [],
      timeout: null,
    };

  pendiente.textos.push(texto);

  if (pendiente.timeout) {
    clearTimeout(
      pendiente.timeout
    );
  }

  pendiente.timeout = setTimeout(
    async () => {
      const datos =
        mensajesPendientes.get(jid);

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
      }
    },
    TIEMPO_ESPERA
  );

  mensajesPendientes.set(
    jid,
    pendiente
  );
}