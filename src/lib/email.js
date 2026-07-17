import nodemailer from "nodemailer";

let transportador = null;

function obtenerTransportador() {
  if (transportador) {
    return transportador;
  }

  transportador = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
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