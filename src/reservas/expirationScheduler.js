import {
  expirarReservasPendientes,
  procesarCheckoutsAutomaticos,
} from "./expirationService.js";

const INTERVALO_REVISION_MS =
  60 * 1000;

let intervalo = null;
let ejecutando = false;

async function revisarReservas() {
  if (ejecutando) {
    return;
  }

  ejecutando = true;

  try {
    await expirarReservasPendientes();
  } catch (error) {
    console.error(
      "❌ Error verificando reservas expiradas:",
      error
    );
  }

  try {
    await procesarCheckoutsAutomaticos();
  } catch (error) {
    console.error(
      "❌ Error procesando checkouts automáticos:",
      error
    );
  } finally {
    ejecutando = false;
  }
}

export function iniciarExpiracionReservas() {
  if (intervalo) {
    return;
  }

  console.log(
    "✅ Scheduler de reservas iniciado: revisión cada 1 minuto"
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

  console.log(
    "🛑 Scheduler de reservas detenido"
  );
}