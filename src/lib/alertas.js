import { enviarCorreo } from "./email.js";

const COOLDOWN_MS = 30 * 60 * 1000;

const ultimosEnvios = new Map();

export async function enviarAlerta(clave, asunto, mensaje) {
  const ahora = Date.now();
  const ultimoEnvio = ultimosEnvios.get(clave);

  if (ultimoEnvio && ahora - ultimoEnvio < COOLDOWN_MS) {
    return;
  }

  ultimosEnvios.set(clave, ahora);

  try {
    await enviarCorreo({
      asunto: `⚠️ ${asunto}`,
      texto: mensaje,
    });

    console.log(`📧 Alerta enviada por correo: ${clave}`);
  } catch (error) {
    console.error("❌ Error enviando alerta por correo:", error);
  }
}