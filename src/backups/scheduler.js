import zlib from "zlib";

import { generarBackupCompleto } from "./service.js";
import { enviarBackupPorCorreo } from "./email.js";

const INTERVALO_REVISION_MS = 5 * 60 * 1000;
const HORA_ENVIO = 2;

let intervalo = null;
let ultimaFechaEnviada = null;

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

  const fechaISO = `${partes.year}-${partes.month}-${partes.day}`;

  const diaSemana = new Date(`${fechaISO}T00:00:00Z`).getUTCDay();

  return {
    fechaISO,
    hora: Number(partes.hour),
    diaSemana,
  };
}

async function enviarBackup(fechaISO) {
  try {
    const backup = await generarBackupCompleto();

    const json = JSON.stringify(backup, null, 2);

    const comprimido = zlib.gzipSync(Buffer.from(json, "utf-8"));

    await enviarBackupPorCorreo({ buffer: comprimido, fechaISO });

    console.log(`✅ Backup semanal enviado por correo (${fechaISO})`);
  } catch (error) {
    console.error("❌ Error enviando backup semanal:", error);
  }
}

async function revisarYEnviar() {
  const { fechaISO, hora, diaSemana } = obtenerFechaHoraHonduras();

  // diaSemana: 0 = domingo
  if (diaSemana !== 0 || hora !== HORA_ENVIO) {
    return;
  }

  if (ultimaFechaEnviada === fechaISO) {
    return;
  }

  ultimaFechaEnviada = fechaISO;

  await enviarBackup(fechaISO);
}

export function iniciarSchedulerBackups() {
  if (intervalo) {
    return;
  }

  console.log(
    "✅ Scheduler de backups iniciado: domingos 2:00 AM (hora Honduras) — por correo"
  );

  intervalo = setInterval(() => {
    revisarYEnviar().catch(console.error);
  }, INTERVALO_REVISION_MS);
}

export function detenerSchedulerBackups() {
  if (!intervalo) {
    return;
  }

  clearInterval(intervalo);
  intervalo = null;

  console.log("🛑 Scheduler de backups detenido");
}