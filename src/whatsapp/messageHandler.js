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
import { generarRespuestaGemini, transcribirAudio } from "../ai/gemini.js";

import {
  aprobarPagoPorCodigo,
  rechazarPagoPorCodigo,
  registrarComprobantes,
} from "../pagos/service.js";

import {
  crearReservaWalkIn,
  liberarReservaPorCodigo,
  listarHabitacionesDisponiblesWalkIn,
  listarReservasParaCheckIn,
  listarReservasParaCheckout,
  listarReservasParaCancelar,
  registrarCheckInPorHabitacion,
  registrarCheckoutPorHabitacion,
  cancelarReservaPorId,
  listarHabitacionesParaMantenimiento,
  alternarMantenimientoHabitacion,
} from "../reservas/service.js";

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
    conversacion.telefono,
  )})\n\n`;

  return encabezado + lineas.join("\n");
}

const mensajesPendientes = new Map();
const TIEMPO_ESPERA = 3000;

const mensajesProcesados = new Map();
const TIEMPO_RETENCION_IDS = 10 * 60 * 1000;

import { flujosJefe } from "../lib/flujosJefe.js";

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

function capacidadPorNumeroHabitacion(numero) {
  const valor = String(numero);
  if (["1", "2", "3"].includes(valor)) return 1;
  if (["4", "5", "6"].includes(valor)) return 2;
  if (["7", "8"].includes(valor)) return 3;
  return null;
}

async function enviarMenuJefe(socket, jid) {
  await socket.sendMessage(jid, {
    text:
      "🏨 MENÚ DEL JEFE\n\n" +
      "1️⃣ Ocupar habitación\n" +
      "2️⃣ Check-in\n" +
      "3️⃣ Checkout\n" +
      "4️⃣ Cambiar modo BOT/HUMANO\n" +
      "5️⃣ Cancelar reserva\n" +
      "6️⃣ Habilitar/deshabilitar habitación\n\n" +
      "Responde con un número.",
  });
}

async function enviarConversacionesActivas(socket, jid) {
  const conversaciones = await listarConversacionesActivas();
  const conversacionesClientes = conversaciones.filter(
    (conversacion) => conversacion.telefono !== OWNER_PHONE,
  );

  if (!conversacionesClientes.length) {
    await socket.sendMessage(jid, { text: "No hay conversaciones activas." });
    return;
  }

  const filas = conversacionesClientes.map((conversacion) => {
    const codigo = conversacion.codigo || "SIN-CODIGO";
    const telefono = formatearTelefono(conversacion.telefono);
    const modo = conversacion.mode === "HUMANO" ? "👤 HUMANO" : "🤖 BOT";
    return `${codigo} | ${telefono} | ${modo}`;
  });

  await socket.sendMessage(jid, {
    text:
      "💬 Conversaciones activas\n\n" +
      filas.join("\n") +
      "\n\nUsa:\n/C1234 humano\n/C1234 bot\n/C1234 historial",
  });
}

async function enviarSeleccionHabitaciones(socket, jid, habitaciones, accion) {
  if (!habitaciones.length) {
    await socket.sendMessage(jid, {
      text: "No hay habitaciones para esta operación.",
    });
    return;
  }

  await socket.sendMessage(jid, {
    text:
      "Selecciona una habitación escribiendo su número de la lista:\n\n" +
      habitaciones
        .map(
          (habitacion, indice) =>
            `${indice + 1}. Habitación ${habitacion.numero} (${capacidadPorNumeroHabitacion(habitacion.numero) || habitacion.capacidad} personas)`,
        )
        .join("\n"),
  });
}

async function enviarSeleccionReservasCancelar(socket, jid, reservas) {
  if (!reservas.length) {
    await socket.sendMessage(jid, {
      text: "No hay reservas confirmadas pendientes de llegada.",
    });
    return;
  }

  await socket.sendMessage(jid, {
    text:
      "Selecciona la reserva que deseas cancelar:\n\n" +
      reservas
        .map(
          (reserva, indice) =>
            `${indice + 1}. ${reserva.cliente.nombre} | Habitación ${reserva.habitacion.numero} | ${reserva.codigo}`,
        )
        .join("\n") +
      "\n\nEl pago no será reembolsado.",
  });
}

async function enviarSeleccionMantenimiento(socket, jid, habitaciones) {
  if (!habitaciones.length) {
    await socket.sendMessage(jid, { text: "No hay habitaciones registradas." });
    return;
  }

  await socket.sendMessage(jid, {
    text:
      "Selecciona la habitación que quieres habilitar o deshabilitar:\n\n" +
      habitaciones
        .map((habitacion, indice) => {
          const estadoTexto =
            habitacion.estado === "MANTENIMIENTO"
              ? "🔧 en mantenimiento"
              : "✅ disponible";
          return `${indice + 1}. Habitación ${habitacion.numero} (${estadoTexto})`;
        })
        .join("\n"),
  });
}

async function procesarFlujoJefe({ socket, jid, texto }) {
  const textoNormalizado = texto.toLowerCase();
  if (textoNormalizado === "/menu" || textoNormalizado.startsWith("jefe:menu:"))
    return false;

  const flujo = flujosJefe.get(jid);
  if (!flujo) return false;

  if (flujo.tipo === "OCUPAR_DATOS") {
    const partes = texto.split("|").map((parte) => parte.trim());
    if (partes.length < 3) {
      await socket.sendMessage(jid, {
        text: "Formato: Nombre | personas | noches\nEjemplo: Juan Pérez | 1 | 2",
      });
      return true;
    }

    const [nombre, personasTexto, nochesTexto] = partes;
    const personas = Number(personasTexto);
    const noches = Number(nochesTexto);
    if (
      !nombre ||
      !Number.isInteger(personas) ||
      personas < 1 ||
      !Number.isInteger(noches) ||
      noches < 1
    ) {
      await socket.sendMessage(jid, {
        text: "Datos inválidos. Ejemplo: Juan Pérez | 1 | 2",
      });
      return true;
    }

    const fechaEntrada = obtenerFechaActual();
    const fechaSalida = sumarDias(fechaEntrada, noches);
    try {
      const reserva = await crearReservaWalkIn({
        nombre,
        telefono: null,
        personas,
        fechaEntrada,
        fechaSalida,
      });
      await socket.sendMessage(jid, {
        text: `✅ Habitación ${reserva.habitacion.numero} ocupada automáticamente.\nReserva: ${reserva.codigo}\nCliente: ${reserva.cliente.nombre}\nPago: efectivo confirmado.`,
      });
    } catch (error) {
      await socket.sendMessage(jid, { text: `⚠️ ${error.message}` });
    }
    flujosJefe.delete(jid);
    return true;
  }

  if (
    (flujo.tipo === "CHECKIN" || flujo.tipo === "CHECKOUT") &&
    /^\d+$/.test(texto)
  ) {
    const indice = Number(texto) - 1;
    const habitacion = flujo.habitaciones?.[indice];
    if (!habitacion) {
      await socket.sendMessage(jid, {
        text: "Número inválido. Elige uno de la lista.",
      });
      return true;
    }

    try {
      const reserva =
        flujo.tipo === "CHECKIN"
          ? await registrarCheckInPorHabitacion(habitacion.id)
          : await registrarCheckoutPorHabitacion(habitacion.id);
      const accion = flujo.tipo === "CHECKIN" ? "Check-in" : "Checkout";
      await socket.sendMessage(jid, {
        text: `✅ ${accion} realizado en habitación ${reserva.habitacion.numero}. Reserva ${reserva.codigo}.`,
      });
    } catch (error) {
      await socket.sendMessage(jid, { text: `⚠️ ${error.message}` });
    }
    flujosJefe.delete(jid);
    return true;
  }

  if (flujo.tipo === "CANCELAR" && /^\d+$/.test(texto)) {
    const indice = Number(texto) - 1;
    const seleccionada = flujo.reservas?.[indice];

    if (!seleccionada) {
      await socket.sendMessage(jid, {
        text: "Número inválido. Elige una reserva de la lista.",
      });
      return true;
    }

    try {
      const reserva = await cancelarReservaPorId(seleccionada.id);
      await socket.sendMessage(jid, {
        text:
          `✅ Reserva ${reserva.codigo} cancelada.\n` +
          `Habitación ${reserva.habitacion.numero} liberada para esas fechas.\n` +
          "El pago permanece aprobado y no se realizará reembolso.",
      });

      if (reserva.cliente?.telefono) {
        await socket.sendMessage(`${reserva.cliente.telefono}@s.whatsapp.net`, {
          text:
            `Tu reserva ${reserva.codigo} fue cancelada.\n` +
            "De acuerdo con la política del hotel, los pagos de reservación no son reembolsables.",
        });
      }
    } catch (error) {
      await socket.sendMessage(jid, { text: `⚠️ ${error.message}` });
    }

    flujosJefe.delete(jid);
    return true;
  }

  if (flujo.tipo === "MANTENIMIENTO" && /^\d+$/.test(texto)) {
    const indice = Number(texto) - 1;
    const seleccionada = flujo.habitaciones?.[indice];

    if (!seleccionada) {
      await socket.sendMessage(jid, {
        text: "Número inválido. Elige una habitación de la lista.",
      });
      return true;
    }

    try {
      const habitacion = await alternarMantenimientoHabitacion(seleccionada.id);
      const mensaje =
        habitacion.estado === "MANTENIMIENTO"
          ? `🔧 Habitación ${habitacion.numero} puesta en mantenimiento. Ya no aparecerá disponible para nuevas reservas.`
          : `✅ Habitación ${habitacion.numero} habilitada de nuevo.`;

      await socket.sendMessage(jid, { text: mensaje });
    } catch (error) {
      await socket.sendMessage(jid, { text: `⚠️ ${error.message}` });
    }

    flujosJefe.delete(jid);
    return true;
  }

  if (flujo.tipo === "CHECKIN" && texto.startsWith("jefe:room:checkin:")) {
    try {
      const reserva = await registrarCheckInPorHabitacion(
        texto.split(":").pop(),
      );
      await socket.sendMessage(jid, {
        text: `✅ Check-in realizado en habitación ${reserva.habitacion.numero}. Reserva ${reserva.codigo}.`,
      });
    } catch (error) {
      await socket.sendMessage(jid, { text: `⚠️ ${error.message}` });
    }
    flujosJefe.delete(jid);
    return true;
  }

  if (flujo.tipo === "CHECKOUT" && texto.startsWith("jefe:room:checkout:")) {
    try {
      const reserva = await registrarCheckoutPorHabitacion(
        texto.split(":").pop(),
      );
      await socket.sendMessage(jid, {
        text: `✅ Checkout realizado en habitación ${reserva.habitacion.numero}. Reserva ${reserva.codigo}.`,
      });
    } catch (error) {
      await socket.sendMessage(jid, { text: `⚠️ ${error.message}` });
    }
    flujosJefe.delete(jid);
    return true;
  }

  if (flujo.tipo === "ESCALAR_CONFIRMACION") {
    const opcion = texto.trim().toLowerCase();

    if (["1", "aceptar"].includes(opcion)) {
      try {
        await cambiarModoConversacion(flujo.conversationId, "HUMANO");

        await socket.sendMessage(jid, {
          text: "✅ Tomaste la conversación. El bot dejó de responder ahí, ya puedes escribirle directo al cliente.",
        });
      } catch (error) {
        await socket.sendMessage(jid, {
          text: `⚠️ ${error.message}`,
        });
      }

      flujosJefe.delete(jid);
      return true;
    }

    if (["2", "rechazar"].includes(opcion)) {
      await socket.sendMessage(jid, {
        text: "❌ Está bien, el bot sigue atendiendo esa conversación.",
      });

      flujosJefe.delete(jid);
      return true;
    }

    await socket.sendMessage(jid, {
      text: "Responde 1 para aceptar o 2 para rechazar.",
    });

    return true;
  }

  return false;
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
      const { reserva, reasignada } = await aprobarPagoPorCodigo(codigoPago);

      await socket.sendMessage(jid, {
        text:
          `✅ Pago ${codigoPago} aprobado. Reserva ${reserva.codigo} confirmada.\n` +
          `Habitación: ${reserva.habitacion.numero}` +
          (reasignada ? " (reasignada porque el comprobante llegó tarde)" : ""),
      });

      const telefonoCliente = reserva.cliente?.telefono;

      if (telefonoCliente) {
        await socket.sendMessage(`${telefonoCliente}@s.whatsapp.net`, {
          text:
            `✅ ¡Tu pago fue confirmado! Tu reserva ${reserva.codigo} quedó confirmada.\n` +
            `Habitación: ${reserva.habitacion.numero}. ¡Te esperamos! 🏨`,
        });
      }

      return;
    }

    if (accion === "rechazar") {
      const pagoActualizado = await rechazarPagoPorCodigo(codigoPago, motivo);

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
          fechaSalida,
        )}\n` +
        `Personas: ${personas} | Noches: ${noches}\n` +
        `Total: L. ${Number(reserva.precioTotal).toFixed(2)} (efectivo, ya confirmado)`,
    });

    await socket.sendMessage(`${telefonoCliente}@s.whatsapp.net`, {
      text:
        `✅ ¡Bienvenido! Tu reserva quedó confirmada.\n` +
        `Código: ${reserva.codigo}\n` +
        `Fechas: ${formatearFechaCorta(fechaEntrada)} → ${formatearFechaCorta(
          fechaSalida,
        )}\n` +
        `Total: L. ${Number(reserva.precioTotal).toFixed(2)} (efectivo)`,
    });
  } catch (error) {
    await socket.sendMessage(jid, {
      text: `⚠️ ${error.message}`,
    });
  }
}

async function procesarComandoLiberar({ socket, jid, codigoReserva }) {
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

async function procesarComandoJefe({ socket, jid, texto }) {
  const comandoOriginal = texto.trim();
  const comando = comandoOriginal.toLowerCase();

  if (comando === "/menu") {
    flujosJefe.delete(jid);
    await enviarMenuJefe(socket, jid);
    return;
  }

  if (await procesarFlujoJefe({ socket, jid, texto: comandoOriginal })) return;

  if (["jefe:menu:1", "1"].includes(comando)) {
    flujosJefe.set(jid, { tipo: "OCUPAR_DATOS" });
    await socket.sendMessage(jid, {
      text: "🏨 Ocupar habitación\n\nEscribe:\nNombre | personas | noches\nEjemplo: Juan Pérez | 1 | 2",
    });
    return;
  }

  if (["jefe:menu:2", "2"].includes(comando)) {
    const reservas = await listarReservasParaCheckIn();
    const habitaciones = reservas.map((reserva) => reserva.habitacion);
    flujosJefe.set(jid, { tipo: "CHECKIN", habitaciones });
    await enviarSeleccionHabitaciones(socket, jid, habitaciones, "checkin");
    return;
  }

  if (["jefe:menu:3", "3"].includes(comando)) {
    const reservas = await listarReservasParaCheckout();
    const habitaciones = reservas.map((reserva) => reserva.habitacion);
    flujosJefe.set(jid, { tipo: "CHECKOUT", habitaciones });
    await enviarSeleccionHabitaciones(socket, jid, habitaciones, "checkout");
    return;
  }

  if (["jefe:menu:4", "4"].includes(comando)) {
    await enviarConversacionesActivas(socket, jid);
    return;
  }

  if (["jefe:menu:5", "5"].includes(comando)) {
    const reservas = await listarReservasParaCancelar();
    flujosJefe.set(jid, { tipo: "CANCELAR", reservas });
    await enviarSeleccionReservasCancelar(socket, jid, reservas);
    return;
  }

  if (["jefe:menu:6", "6"].includes(comando)) {
    const habitaciones = await listarHabitacionesParaMantenimiento();
    flujosJefe.set(jid, { tipo: "MANTENIMIENTO", habitaciones });
    await enviarSeleccionMantenimiento(socket, jid, habitaciones);
    return;
  }

  const coincidenciaPago = comandoOriginal.match(
    /^\/(p\d+)\s+(aprobar|rechazar)(?:\s+(.+))?$/i,
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
    /^\/ocupar\s+(\d{8,})\s+(\d+)\s+(\d+)\s+(.+)$/i,
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
    /^\/(res-\d{4}-\d+)\s+liberar$/i,
  );
  if (coincidenciaLiberar) {
    await procesarComandoLiberar({
      socket,
      jid,
      codigoReserva: coincidenciaLiberar[1],
    });
    return;
  }

  const coincidencia = comando.match(/^\/(c\d+)\s+(humano|bot|historial)$/i);
  if (!coincidencia) {
    await socket.sendMessage(jid, {
      text: "Escribe /menu para abrir el menú del jefe.",
    });
    return;
  }

  const codigo = coincidencia[1].toUpperCase();
  const accion = coincidencia[2].toLowerCase();
  let conversacion;
  try {
    conversacion = await obtenerConversacionPorCodigo(codigo);
  } catch {
    await socket.sendMessage(jid, {
      text: `No encontré la conversación ${codigo}. Escribe /menu.`,
    });
    return;
  }

  if (accion === "historial") {
    const historial = await obtenerConversacionConHistorial(
      conversacion.telefono,
      100,
    );
    await socket.sendMessage(jid, { text: formatearHistorial(historial) });
    return;
  }

  const modo = accion === "humano" ? "HUMANO" : "BOT";
  await cambiarModoConversacion(conversacion.id, modo);
  await socket.sendMessage(jid, {
    text:
      modo === "HUMANO"
        ? `✅ ${codigo} ahora está en modo HUMANO.`
        : `✅ ${codigo} volvió al modo BOT.`,
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

  const nombreArchivo = `${Date.now()}-${telefono}.${extension}`;

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

  await socket.sendMessage(jid, {
    text:
      `Recibí tu comprobante ✅\n` +
      `${pagos.length === 1 ? "Código de revisión" : "Códigos de revisión"}: ${pagos
        .map((pago) => pago.codigo)
        .join(", ")}\n` +
      `En cuanto el hotel lo confirme, te aviso por aquí.`,
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
