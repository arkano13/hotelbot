import { enviarCorreo } from "../lib/email.js";

export async function enviarBackupPorCorreo({ buffer, fechaISO }) {
  await enviarCorreo({
    asunto: `Backup hotel — ${fechaISO}`,
    texto: `Backup automático semanal generado el ${fechaISO}. Adjunto encontrarás el archivo comprimido con todos los datos.`,
    adjuntos: [
      {
        filename: `backup-hotel-${fechaISO}.json.gz`,
        content: buffer,
      },
    ],
  });
}