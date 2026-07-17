import {
  expirarReservasPendientes,
  procesarCheckoutsAutomaticos,
} from "./expirationService.js";

const INTERVALO_REVISION_MS = 60 * 1000;

let intervalo = null;
let ejecutando = false;

async function revisarReservas() {
  if (ejecutando) {
    return;
  }

  ejecutando = true;

  try {
    await expirarReservasPendientes();
    await procesarCheckoutsAutomaticos();
  } catch (error) {
    console.error("❌ Error ejecutando scheduler de reservas:", error);
  } finally {
    ejecutando = false;
  }
}

export function iniciarExpiracionReservas() {
  if (intervalo) {
    return;
  }

  console.log(
    "✅ Scheduler de reservas iniciado: expiraciones cada minuto y checkout a las 11:00 AM Honduras"
  );

  revisarReservas().catch(console.error);

  intervalo = setInterval(() => {
    revisarReservas().catch(console.error);
  }, INTERVALO_REVISION_MS);
}

export function detenerExpiracionReservas() {
  if (!intervalo) {
    return;
  }

  clearInterval(intervalo);
  intervalo = null;

  console.log("🛑 Scheduler de reservas detenido");
}
