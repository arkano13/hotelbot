import nodemailer from "nodemailer";

let transportador = null;

function obtenerTransportador() {
  if (transportador) {
    return transportador;
  }

  transportador = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    // Railway tiene la salida por IPv6 desactivada por defecto — si Node
    // intenta conectar por ahí primero, se cuelga hasta hacer timeout en
    // vez de caer directo a IPv4. Forzarlo evita ese cuelgue.
    family: 4,
    connectionTimeout: 20000,
  });

  return transportador;
}

export async function enviarCorreo({ asunto, texto, adjuntos = [] }) {
  const destinatario =
    process.env.ALERTA_EMAIL_TO || process.env.BACKUP_EMAIL_TO;

  if (!destinatario) {
    throw new Error(
      "Falta configurar ALERTA_EMAIL_TO o BACKUP_EMAIL_TO en las variables de entorno"
    );
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error(
      "Falta configurar EMAIL_USER y EMAIL_APP_PASSWORD en las variables de entorno"
    );
  }

  const transporte = obtenerTransportador();

  await transporte.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: texto,
    attachments: adjuntos,
  });
}