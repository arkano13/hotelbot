import fs from "fs/promises";
import path from "path";

import {
  obtenerResumenDiario,
  obtenerResumenMensual,
} from "./service.js";

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

async function guardarEstado() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const temporal = `${RUTA_ESTADO}.tmp`;
  const contenido = JSON.stringify(
    {
      ultimaFechaDiaria,
      ultimoMesEnviado,
    },
    null,
    2
  );

  await fs.writeFile(temporal, contenido, "utf-8");
  await fs.rename(temporal, RUTA_ESTADO);
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

    // Al instalar esta versión después de la hora del reporte, asumimos
    // que el reporte del día ya fue enviado para evitar un duplicado.
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
      .map((parte) => [parte.type, parte.value])
  );

  return {
    fechaISO: `${partes.year}-${partes.month}-${partes.day}`,
    anio: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    hora: Number(partes.hour),
  };
}

function formatearReserva(reserva) {
  return (
    `Habitación ${reserva.habitacion.numero} — ` +
    `${reserva.cliente.nombre} (${reserva.codigo})`
  );
}

function crearTextoDiario(resumen) {
  const llegadas = resumen.llegan.length
    ? resumen.llegan.map(formatearReserva).join("\n")
    : "Ninguna";

  const salidas = resumen.salen.length
    ? resumen.salen.map(formatearReserva).join("\n")
    : "Ninguna";

  const pagos = resumen.pagosPendientes.length
    ? resumen.pagosPendientes
        .map((pago) => `${pago.codigo || "SIN-CÓDIGO"} — ${pago.reserva.cliente.nombre}`)
        .join("\n")
    : "Ninguno";

  return (
    `📋 Reporte diario — ${resumen.fecha}\n\n` +
    `🟢 Llegadas:\n${llegadas}\n\n` +
    `🚪 Salidas:\n${salidas}\n\n` +
    `💳 Pagos pendientes:\n${pagos}`
  );
}

function crearTextoMensual(resumen) {
  return (
    `📊 Reporte mensual — ${resumen.mes}/${resumen.anio}\n\n` +
    `Reservas: ${resumen.totalReservas}\n` +
    `Noches vendidas: ${resumen.nochesVendidas}\n` +
    `Ingresos: L. ${resumen.ingresos.toFixed(2)}\n` +
    `Canceladas/expiradas: ${resumen.canceladas}\n` +
    `Ocupación: ${resumen.ocupacionPorcentaje.toFixed(1)}%`
  );
}

async function enviarAlJefe(texto) {
  if (!OWNER_PHONE) {
    throw new Error("OWNER_PHONE no está configurado");
  }

  const socket = obtenerWhatsAppSocket();
  await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, { text: texto });
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
      const diario = await obtenerResumenDiario(datos.fechaISO);
      await enviarAlJefe(crearTextoDiario(diario));
      ultimaFechaDiaria = datos.fechaISO;
      await guardarEstado();
      console.log(`📋 Reporte diario enviado: ${datos.fechaISO}`);
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
      const mensual = await obtenerResumenMensual(anioAnterior, mesAnterior);
      await enviarAlJefe(crearTextoMensual(mensual));
      ultimoMesEnviado = claveMes;
      await guardarEstado();
      console.log(`📊 Reporte mensual enviado: ${mesAnterior}/${anioAnterior}`);
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
    `✅ Scheduler de reportes iniciado: reporte diario desde las ${HORA_REPORTE}:00 Honduras`
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
