import { expirarReservasPendientes } from "./expirationService.js";

const INTERVALO_REVISION = 60 * 1000;

export function iniciarExpiracionReservas() {
  console.log("✅ Verificador de reservas expiradas iniciado");

  expirarReservasPendientes().catch((error) => {
    console.error("Error verificando reservas expiradas:", error);
  });

  setInterval(async () => {
    try {
      await expirarReservasPendientes();
    } catch (error) {
      console.error("Error verificando reservas expiradas:", error);
    }
  }, INTERVALO_REVISION);
}