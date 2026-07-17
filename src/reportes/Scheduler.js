import { obtenerWhatsAppSocket } from "../whatsapp/client.js";
import { obtenerResumenDiario, obtenerResumenMensual } from "./service.js";
import { generarPdfDiario, generarPdfMensual } from "./pdf.js";

const INTERVALO_REVISION_MS = 1 * 60 * 1000;
const HORA_ENVIO = 20;

const OWNER_PHONE = String(process.env.OWNER_PHONE ?? "")
  .replace(/\D/g, "")
  .trim();

let intervalo = null;
let ultimoDiaEnviado = null;
let ultimoMesEnviado = null;

function obtenerFechaHoraHonduras() {
  const formateador = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const partes = Object.fromEntries(
    formateador.formatToParts(new Date()).map((p) => [p.type, p.value])
  );

  return {
    fechaISO: `${partes.year}-${partes.month}-${partes.day}`,
    hora: Number(partes.hour),
    anio: Number(partes.year),
    mes: Number(partes.month),
  };
}

function diaAnterior(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() - 1);
  return { anio: fecha.getUTCFullYear(), mes: fecha.getUTCMonth() + 1 };
}

async function enviarReporteDiario(socket, fechaISO) {
  try {
    const resumen = await obtenerResumenDiario(fechaISO);
    const buffer = await generarPdfDiario(resumen);

    await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, {
      document: buffer,
      mimetype: "application/pdf",
      fileName: `resumen-diario-${fechaISO}.pdf`,
      caption: `📋 Resumen diario — ${fechaISO}`,
    });

    console.log(`✅ Resumen diario enviado (${fechaISO})`);
  } catch (error) {
    console.error("❌ Error enviando resumen diario:", error);
  }
}

async function enviarReporteMensual(socket, anio, mes) {
  try {
    const resumen = await obtenerResumenMensual(anio, mes);
    const buffer = await generarPdfMensual(resumen);

    await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, {
      document: buffer,
      mimetype: "application/pdf",
      fileName: `resumen-mensual-${anio}-${String(mes).padStart(2, "0")}.pdf`,
      caption: `📊 Resumen mensual — ${mes}/${anio}`,
    });

    console.log(`✅ Resumen mensual enviado (${mes}/${anio})`);
  } catch (error) {
    console.error("❌ Error enviando resumen mensual:", error);
  }
}

async function revisarYEnviar() {
  if (!OWNER_PHONE) {
    return;
  }

  const { fechaISO, hora, anio, mes } = obtenerFechaHoraHonduras();

  if (hora !== HORA_ENVIO) {
    return;
  }

  let socket;

  try {
    socket = obtenerWhatsAppSocket();
  } catch {
    return;
  }

  if (ultimoDiaEnviado !== fechaISO) {
    ultimoDiaEnviado = fechaISO;
    await enviarReporteDiario(socket, fechaISO);
  }

  const diaDelMes = Number(fechaISO.slice(8, 10));
  const claveMes = `${anio}-${mes}`;

  if (diaDelMes === 1 && ultimoMesEnviado !== claveMes) {
    ultimoMesEnviado = claveMes;

    const { anio: anioAnterior, mes: mesAnterior } = diaAnterior(fechaISO);
    await enviarReporteMensual(socket, anioAnterior, mesAnterior);
  }
}

export function iniciarSchedulerReportes() {
  if (intervalo) {
    return;
  }

  console.log("✅ Scheduler de reportes iniciado: revisión cada 5 minutos");

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

  console.log("🛑 Scheduler de reportes detenido");
}