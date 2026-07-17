import fs from "fs";
import path from "path";
import pino from "pino";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

import {
  cambiarModoConversacion,
  listarConversacionesActivas,
  obtenerConversacionConHistorial,
  obtenerConversacionPorCodigo,
  obtenerOCrearConversacion,
} from "../conversations/service.js";

import { guardarMensaje } from "../messages/service.js";
import { generarRespuestaGemini } from "../ai/gemini.js";

import {
  aprobarPagoPorCodigo,
  rechazarPagoPorCodigo,
  registrarComprobante,
} from "../pagos/service.js";

import { crearReservaWalkIn, liberarReservaPorCodigo } from "../reservas/service.js";

const loggerDescarga = pino({ level: "silent" });

function formatearRol(role) {
  if (role === "USER") return "Cliente";
  if (role === "ASSISTANT") return "Bot";
  if (role === "TOOL") return "Sistema";
  return role;
}

function formatearHistorial(conversacion) {
  const mensajes = conversacion?.messages ?? [];

  if (mensajes.length === 0) {
    return "No hay mensajes en esta conversación todavía.";
  }

  const lineas = mensajes.map((mensaje) => {
    const hora = new Date(mensaje.createdAt).toLocaleString("es-HN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `[${hora}] ${formatearRol(mensaje.role)}: ${mensaje.content}`;
  });

  const encabezado = `📜 Historial de ${conversacion.codigo} (${formatearTelefono(
    conversacion.telefono
  )})\n\n`;

  return encabezado + lineas.join("\n");
}

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

  mensajesProcesados.set(
    messageId,
    ahora + TIEMPO_RETENCION_IDS
  );

  return false;
}

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
    "/C1234 historial",
    "/ocupar <telefono> <personas> <noches> <nombre y apellido>",
    "/RES-2026-123456 liberar",
  ].join("\n");

  await socket.sendMessage(jid, {
    text: texto,
  });
}

async function procesarComandoPago({
  socket,
  jid,
  codigoPago,
  accion,
  motivo,
}) {
  try {
    if (accion === "aprobar") {
      const { reserva } = await aprobarPagoPorCodigo(codigoPago);

      await socket.sendMessage(jid, {
        text: `✅ Pago ${codigoPago} aprobado. Reserva ${reserva.codigo} confirmada.`,
      });

      const telefonoCliente = reserva.cliente?.telefono;

      if (telefonoCliente) {
        await socket.sendMessage(`${telefonoCliente}@s.whatsapp.net`, {
          text: `✅ ¡Tu pago fue confirmado! Tu reserva ${reserva.codigo} quedó confirmada. ¡Te esperamos! 🏨`,
        });
      }

      return;
    }

    if (accion === "rechazar") {
      const pagoActualizado = await rechazarPagoPorCodigo(
        codigoPago,
        motivo
      );

      await socket.sendMessage(jid, {
        text: `❌ Pago ${codigoPago} rechazado.`,
      });

      const telefonoCliente = pagoActualizado.reserva?.cliente?.telefono;

      if (telefonoCliente) {
        const motivoTexto = motivo ? `\nMotivo: ${motivo}` : "";

        await socket.sendMessage(`${telefonoCliente}@s.whatsapp.net`, {
          text: `❌ Tu comprobante no pudo confirmarse.${motivoTexto}\n¿Puedes enviar otro comprobante o verificar el monto?`,
        });
      }

      return;
    }
  } catch (error) {
    await socket.sendMessage(jid, {
      text: `⚠️ ${error.message}`,
    });
  }
}

async function procesarComandoOcupar({
  socket,
  jid,
  telefonoCliente,
  personas,
  noches,
  nombre,
}) {
  try {
    if (!Number.isInteger(personas) || personas < 1) {
      throw new Error("La cantidad de personas no es válida");
    }

    if (!Number.isInteger(noches) || noches < 1) {
      throw new Error("La cantidad de noches no es válida");
    }

    const fechaEntrada = obtenerFechaActual();
    const fechaSalida = sumarDias(fechaEntrada, noches);

    const reserva = await crearReservaWalkIn({
      nombre,
      telefono: telefonoCliente,
      fechaEntrada,
      fechaSalida,
      personas,
    });

    await socket.sendMessage(jid, {
      text:
        `✅ Reserva registrada — ${reserva.codigo}\n` +
        `Cliente: ${nombre} (${formatearTelefono(telefonoCliente)})\n` +
        `Fechas: ${formatearFechaCorta(fechaEntrada)} → ${formatearFechaCorta(
          fechaSalida
        )}\n` +
        `Personas: ${personas} | Noches: ${noches}\n` +
        `Total: L. ${Number(reserva.precioTotal).toFixed(2)} (efectivo, ya confirmado)`,
    });

    await socket.sendMessage(`${telefonoCliente}@s.whatsapp.net`, {
      text:
        `✅ ¡Bienvenido! Tu reserva quedó confirmada.\n` +
        `Código: ${reserva.codigo}\n` +
        `Fechas: ${formatearFechaCorta(fechaEntrada)} → ${formatearFechaCorta(
          fechaSalida
        )}\n` +
        `Total: L. ${Number(reserva.precioTotal).toFixed(2)} (efectivo)`,
    });
  } catch (error) {
    await socket.sendMessage(jid, {
      text: `⚠️ ${error.message}`,
    });
  }
}

async function procesarComandoLiberar({
  socket,
  jid,
  codigoReserva,
}) {
  try {
    const reserva = await liberarReservaPorCodigo(codigoReserva);

    await socket.sendMessage(jid, {
      text:
        `🔓 Habitación ${reserva.habitacion.numero} liberada — ${reserva.codigo}\n` +
        `Cliente: ${reserva.cliente.nombre}`,
    });
  } catch (error) {
    await socket.sendMessage(jid, {
      text: `⚠️ ${error.message}`,
    });
  }
}

async function procesarComandoJefe({
  socket,
  jid,
  texto,
}) {
  const comandoOriginal = texto.trim();
  const comando = comandoOriginal.toLowerCase();

  if (comando === "/menu") {
    await enviarMenuJefe(socket, jid);
    return;
  }

  const coincidenciaPago = comandoOriginal.match(
    /^\/(p\d+)\s+(aprobar|rechazar)(?:\s+(.+))?$/i
  );

  if (coincidenciaPago) {
    await procesarComandoPago({
      socket,
      jid,
      codigoPago: coincidenciaPago[1].toUpperCase(),
      accion: coincidenciaPago[2].toLowerCase(),
      motivo: coincidenciaPago[3]?.trim(),
    });

    return;
  }

  const coincidenciaOcupar = comandoOriginal.match(
    /^\/ocupar\s+(\d{8,})\s+(\d+)\s+(\d+)\s+(.+)$/i
  );

  if (coincidenciaOcupar) {
    await procesarComandoOcupar({
      socket,
      jid,
      telefonoCliente: coincidenciaOcupar[1].replace(/\D/g, ""),
      personas: Number(coincidenciaOcupar[2]),
      noches: Number(coincidenciaOcupar[3]),
      nombre: coincidenciaOcupar[4].trim(),
    });

    return;
  }

  const coincidenciaLiberar = comandoOriginal.match(
    /^\/(res-\d{4}-\d+)\s+liberar$/i
  );

  if (coincidenciaLiberar) {
    await procesarComandoLiberar({
      socket,
      jid,
      codigoReserva: coincidenciaLiberar[1],
    });

    return;
  }

  const coincidencia = comando.match(
    /^\/(c\d+)\s+(humano|bot|historial)$/i
  );

  if (!coincidencia) {
    await socket.sendMessage(jid, {
      text: "Escribe /menu para ver las conversaciones.",
    });

    return;
  }

  const codigo =
    coincidencia[1].toUpperCase();

  const accion = coincidencia[2].toLowerCase();

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

  if (accion === "historial") {
    const conversacionConHistorial =
      await obtenerConversacionConHistorial(
        conversacion.telefono,
        100
      );

    await socket.sendMessage(jid, {
      text: formatearHistorial(conversacionConHistorial),
    });

    return;
  }

  const modo = accion === "humano" ? "HUMANO" : "BOT";

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

function obtenerFechaActual() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function sumarDias(fechaISO, dias) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

function formatearFechaCorta(fecha) {
  if (!fecha) return "N/A";

  return new Date(fecha).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function procesarComprobante({
  socket,
  jid,
  telefono,
  message,
}) {
  const conversacion = await obtenerOCrearConversacion(telefono);

  const reservaId = conversacion.reservaId;

  if (!reservaId) {
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
    }
  );

  const mimetype =
    message.message?.imageMessage?.mimetype ?? "image/jpeg";

  const extension = mimetype.includes("png") ? "png" : "jpg";

  const carpeta = path.join(process.cwd(), "uploads", "comprobantes");

  await fs.promises.mkdir(carpeta, { recursive: true });

  const nombreArchivo = `${Date.now()}-${telefono}.${extension}`;

  const rutaArchivo = path.join(carpeta, nombreArchivo);

  await fs.promises.writeFile(rutaArchivo, buffer);

  const baseUrl =
    process.env.BASE_URL ||
    `http://localhost:${process.env.PORT || 3000}`;

  const comprobanteUrl = `${baseUrl}/uploads/comprobantes/${nombreArchivo}`;

  const pago = await registrarComprobante({
    reservaId,
    comprobanteUrl,
  });

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: "[Envió comprobante de pago]",
  });

  await socket.sendMessage(jid, {
    text:
      `Recibí tu comprobante ✅\n` +
      `Código de revisión: ${pago.codigo}\n` +
      `En cuanto el hotel lo confirme, te aviso por aquí.`,
  });

  if (OWNER_PHONE) {
    const reserva = pago.reserva;
    const cliente = reserva?.cliente;

    await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, {
      image: buffer,
      caption:
        `📸 Nuevo comprobante — ${pago.codigo}\n` +
        `Reserva: ${reserva?.codigo ?? "N/A"} | Conversación: ${
          conversacion.codigo
        }\n` +
        `Cliente: ${cliente?.nombre ?? "N/A"} (${formatearTelefono(
          telefono
        )})\n` +
        `Fechas: ${formatearFechaCorta(
          reserva?.fechaEntrada
        )} → ${formatearFechaCorta(reserva?.fechaSalida)}\n` +
        `Monto esperado: L. ${Number(pago.monto).toFixed(2)}\n\n` +
        `Responde:\n/${pago.codigo} aprobar\n/${pago.codigo} rechazar [motivo]`,
    });
  }
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

  if (yaFueProcesado(message.key?.id)) {
    console.log(
      `🔁 Mensaje duplicado ignorado: ${message.key?.id}`
    );

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

  const telefono =
    obtenerTelefonoMensaje(message);

  if (
    OWNER_PHONE &&
    telefono === OWNER_PHONE
  ) {
    const texto = obtenerTextoMensaje(message);

    if (!texto) {
      return;
    }

    await procesarComandoJefe({
      socket,
      jid,
      texto,
    });

    return;
  }

  const esImagen = Boolean(
    message.message?.imageMessage
  );

  if (esImagen) {
    try {
      await procesarComprobante({
        socket,
        jid,
        telefono,
        message,
      });
    } catch (error) {
      console.error(
        "❌ Error procesando comprobante:",
        error
      );

      await socket.sendMessage(jid, {
        text: "Tuve un problema al recibir la imagen. ¿Puedes intentar enviarla de nuevo?",
      });
    }

    return;
  }

  const texto =
    obtenerTextoMensaje(message);

  if (!texto) {
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