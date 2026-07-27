import {
  expirarReservasPendientes,
  procesarCheckoutsAutomaticos,
  procesarCheckoutsPorHoras,
} from "./expirationService.js";
import { obtenerHoraCheckOutTexto } from "../config/hotelInfo.js";
import { procesarNotificacionesPendientesEncargada } from "../notificaciones/encargadaService.js";

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
    await procesarCheckoutsPorHoras();
    await procesarNotificacionesPendientesEncargada();
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
    `✅ Scheduler de reservas iniciado: expiraciones cada minuto y checkout a las ${obtenerHoraCheckOutTexto()} Honduras`,
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