import { obtenerWhatsAppSocket } from "../whatsapp/client.js";

import {
  obtenerResumenDiario,
  obtenerResumenMensual,
} from "./service.js";

import {
  generarPdfDiario,
  generarPdfMensual,
} from "./pdf.js";

const INTERVALO_REVISION_MS = 60 * 1000;
const HORA_ENVIO = 20;

const OWNER_PHONE = String(
  process.env.OWNER_PHONE ?? ""
)
  .replace(/\D/g, "")
  .trim();

let intervalo = null;
let ejecutando = false;

let ultimoDiaEnviado = null;
let ultimoMesEnviado = null;

function obtenerFechaHoraHonduras() {
  const formateador = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "America/Tegucigalpa",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hour12: false,
    }
  );

  const partes = Object.fromEntries(
    formateador
      .formatToParts(new Date())
      .map((parte) => [
        parte.type,
        parte.value,
      ])
  );

  return {
    fechaISO:
      `${partes.year}-${partes.month}-${partes.day}`,
    anio: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    hora: Number(partes.hour),
  };
}

function obtenerMesAnterior(anio, mes) {
  if (mes === 1) {
    return {
      anio: anio - 1,
      mes: 12,
    };
  }

  return {
    anio,
    mes: mes - 1,
  };
}

async function enviarReporteDiario(
  socket,
  fechaISO
) {
  const resumen =
    await obtenerResumenDiario(fechaISO);

  const buffer =
    await generarPdfDiario(resumen);

  await socket.sendMessage(
    `${OWNER_PHONE}@s.whatsapp.net`,
    {
      document: buffer,
      mimetype: "application/pdf",
      fileName:
        `resumen-diario-${fechaISO}.pdf`,
      caption:
        `📋 Resumen diario — ${fechaISO}`,
    }
  );

  console.log(
    `✅ Resumen diario enviado (${fechaISO})`
  );
}

async function enviarReporteMensual(
  socket,
  anio,
  mes
) {
  const resumen =
    await obtenerResumenMensual(anio, mes);

  const buffer =
    await generarPdfMensual(resumen);

  const mesFormateado = String(mes).padStart(
    2,
    "0"
  );

  await socket.sendMessage(
    `${OWNER_PHONE}@s.whatsapp.net`,
    {
      document: buffer,
      mimetype: "application/pdf",
      fileName:
        `resumen-mensual-${anio}-${mesFormateado}.pdf`,
      caption:
        `📊 Resumen mensual — ${mesFormateado}/${anio}`,
    }
  );

  console.log(
    `✅ Resumen mensual enviado (${mesFormateado}/${anio})`
  );
}

async function revisarYEnviar() {
  if (ejecutando || !OWNER_PHONE) {
    return;
  }

  ejecutando = true;

  try {
    const {
      fechaISO,
      anio,
      mes,
      dia,
      hora,
    } = obtenerFechaHoraHonduras();

    if (hora !== HORA_ENVIO) {
      return;
    }

    let socket;

    try {
      socket = obtenerWhatsAppSocket();
    } catch {
      console.log(
        "⚠️ Reportes pendientes: WhatsApp no está conectado"
      );

      return;
    }

    if (ultimoDiaEnviado !== fechaISO) {
      await enviarReporteDiario(
        socket,
        fechaISO
      );

      ultimoDiaEnviado = fechaISO;
    }

    if (dia === 1) {
      const mesAnterior =
        obtenerMesAnterior(anio, mes);

      const claveMes =
        `${mesAnterior.anio}-${String(
          mesAnterior.mes
        ).padStart(2, "0")}`;

      if (ultimoMesEnviado !== claveMes) {
        await enviarReporteMensual(
          socket,
          mesAnterior.anio,
          mesAnterior.mes
        );

        ultimoMesEnviado = claveMes;
      }
    }
  } catch (error) {
    console.error(
      "❌ Error procesando reportes automáticos:",
      error
    );
  } finally {
    ejecutando = false;
  }
}

export function iniciarSchedulerReportes() {
  if (intervalo) {
    return;
  }

  console.log(
    "✅ Scheduler de reportes iniciado: revisión cada 1 minuto"
  );

  revisarYEnviar().catch(console.error);

  intervalo = setInterval(() => {
    revisarYEnviar().catch(console.error);
  }, INTERVALO_REVISION_MS);
}

export function detenerSchedulerReportes() {
  if (!intervalo) {
    return;
  }

  clearInterval(intervalo);
  intervalo = null;

  console.log(
    "🛑 Scheduler de reportes detenido"
  );
}