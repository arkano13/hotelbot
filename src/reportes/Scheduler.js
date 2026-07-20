import fs from "fs/promises";
import path from "path";

import {
  obtenerResumenDiario,
  obtenerResumenMensual,
} from "./service.js";
import {
  generarPdfDiario,
  generarPdfMensual,
} from "./pdf.js";

import { obtenerWhatsAppSocket } from "../whatsapp/client.js";
import { DATA_DIR } from "../lib/paths.js";

const ZONA_HORARIA = "America/Tegucigalpa";
const INTERVALO_REVISION_MS = 5 * 60 * 1000;
const HORA_REPORTE = Number(process.env.REPORT_HOUR || 7);
const RUTA_ESTADO = path.join(DATA_DIR, "scheduler-reportes.json");

const OWNER_PHONE = String(process.env.OWNER_PHONE ?? "")
  .replace(/\D/g, "")
  .trim();

let intervalo = null;
let ultimaFechaDiaria = null;
let ultimoMesEnviado = null;
let ejecutando = false;
let estadoCargado = false;

function formatearMoneda(valor) {
  return `L. ${Number(valor).toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function sumarDias(fechaISO, cantidad) {
  const fecha = new Date(`${fechaISO}T12:00:00.000Z`);
  fecha.setUTCDate(fecha.getUTCDate() + cantidad);
  return fecha.toISOString().slice(0, 10);
}

async function guardarEstado() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const temporal = `${RUTA_ESTADO}.tmp`;
  const contenido = JSON.stringify(
    { ultimaFechaDiaria, ultimoMesEnviado },
    null,
    2,
  );

  await fs.writeFile(temporal, contenido, "utf-8");
  await fs.rename(temporal, RUTA_ESTADO);
}

function obtenerFechaHoraHonduras() {
  const formateador = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });

  const partes = Object.fromEntries(
    formateador
      .formatToParts(new Date())
      .filter((parte) => parte.type !== "literal")
      .map((parte) => [parte.type, parte.value]),
  );

  return {
    fechaISO: `${partes.year}-${partes.month}-${partes.day}`,
    anio: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    hora: Number(partes.hour),
  };
}

async function cargarEstado() {
  if (estadoCargado) {
    return;
  }

  try {
    const contenido = await fs.readFile(RUTA_ESTADO, "utf-8");
    const estado = JSON.parse(contenido);
    ultimaFechaDiaria = estado.ultimaFechaDiaria || null;
    ultimoMesEnviado = estado.ultimoMesEnviado || null;
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("⚠️ No se pudo leer el estado de reportes:", error);
    }

    const datos = obtenerFechaHoraHonduras();

    if (datos.hora >= HORA_REPORTE) {
      ultimaFechaDiaria = datos.fechaISO;

      if (datos.dia === 1) {
        ultimoMesEnviado = `${datos.anio}-${String(datos.mes).padStart(2, "0")}`;
      }
    }

    await guardarEstado();
  }

  estadoCargado = true;
}

async function enviarDocumentoAlJefe({ buffer, nombreArchivo, texto }) {
  if (!OWNER_PHONE) {
    throw new Error("OWNER_PHONE no está configurado");
  }

  const socket = obtenerWhatsAppSocket();
  await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, {
    document: buffer,
    mimetype: "application/pdf",
    fileName: nombreArchivo,
    caption: texto,
  });
}

export async function enviarReporteDiario(fechaISO) {
  const resumen = await obtenerResumenDiario(fechaISO);
  const pdf = await generarPdfDiario(resumen);

  await enviarDocumentoAlJefe({
    buffer: pdf,
    nombreArchivo: `reporte-diario-${fechaISO}.pdf`,
    texto:
      `📋 Reporte diario de ingresos - ${fechaISO}\n` +
      `Total recibido: ${formatearMoneda(resumen.ingresosTotal)}\n` +
      `Transferencias: ${formatearMoneda(resumen.ingresosTransferencia)}\n` +
      `Efectivo: ${formatearMoneda(resumen.ingresosEfectivo)}\n` +
      `Pagos confirmados: ${resumen.cantidadPagos}`,
  });

  return resumen;
}

export async function enviarReporteMensual(anio, mes) {
  const resumen = await obtenerResumenMensual(anio, mes);
  const pdf = await generarPdfMensual(resumen);
  const mesTexto = String(mes).padStart(2, "0");

  await enviarDocumentoAlJefe({
    buffer: pdf,
    nombreArchivo: `reporte-mensual-${anio}-${mesTexto}.pdf`,
    texto:
      `📊 Reporte mensual de ingresos - ${mesTexto}/${anio}\n` +
      `Total recibido: ${formatearMoneda(resumen.ingresosTotal)}\n` +
      `Transferencias: ${formatearMoneda(resumen.ingresosTransferencia)}\n` +
      `Efectivo: ${formatearMoneda(resumen.ingresosEfectivo)}\n` +
      `Pagos confirmados: ${resumen.cantidadPagos}\n` +
      `Ocupación confirmada: ${resumen.ocupacionPorcentaje.toFixed(1)}%`,
  });

  return resumen;
}

async function revisarReportes() {
  if (ejecutando) {
    return;
  }

  ejecutando = true;

  try {
    await cargarEstado();
    const datos = obtenerFechaHoraHonduras();

    if (datos.hora >= HORA_REPORTE && ultimaFechaDiaria !== datos.fechaISO) {
      const fechaReporte = sumarDias(datos.fechaISO, -1);
      await enviarReporteDiario(fechaReporte);
      ultimaFechaDiaria = datos.fechaISO;
      await guardarEstado();
      console.log(`📋 Reporte diario PDF enviado: ${fechaReporte}`);
    }

    const claveMes = `${datos.anio}-${String(datos.mes).padStart(2, "0")}`;

    if (
      datos.dia === 1 &&
      datos.hora >= HORA_REPORTE &&
      ultimoMesEnviado !== claveMes
    ) {
      const fechaMesAnterior = new Date(Date.UTC(datos.anio, datos.mes - 2, 1));
      const anioAnterior = fechaMesAnterior.getUTCFullYear();
      const mesAnterior = fechaMesAnterior.getUTCMonth() + 1;

      await enviarReporteMensual(anioAnterior, mesAnterior);
      ultimoMesEnviado = claveMes;
      await guardarEstado();
      console.log(`📊 Reporte mensual PDF enviado: ${mesAnterior}/${anioAnterior}`);
    }
  } catch (error) {
    console.error("❌ Error generando reportes automáticos:", error);
  } finally {
    ejecutando = false;
  }
}

export function iniciarSchedulerReportes() {
  if (intervalo) {
    return;
  }

  console.log(
    `✅ Scheduler de reportes iniciado: PDF diario del día anterior desde las ${HORA_REPORTE}:00 Honduras`,
  );

  revisarReportes().catch(console.error);

  intervalo = setInterval(() => {
    revisarReportes().catch(console.error);
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
