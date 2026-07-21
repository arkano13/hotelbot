import { prisma } from "../lib/prisma.js";

const URL_PUSH_EXPO = "https://exp.host/--/api/v2/push/send";

export async function registrarDispositivo(token) {
  const tokenLimpio = String(token ?? "").trim();

  if (!tokenLimpio) {
    throw new Error("El token del dispositivo es obligatorio");
  }

  return prisma.dispositivoNotificacion.upsert({
    where: { token: tokenLimpio },
    update: {},
    create: { token: tokenLimpio },
  });
}

export async function eliminarDispositivo(token) {
  const tokenLimpio = String(token ?? "").trim();

  if (!tokenLimpio) return;

  await prisma.dispositivoNotificacion
    .delete({ where: { token: tokenLimpio } })
    .catch(() => {});
}

// Manda una notificación push a TODOS los dispositivos registrados (todos
// los celulares donde esté instalada la app). Si el envío falla para algún
// token individual, no revienta el resto — solo se registra en consola.
// Esto nunca debe tumbar el flujo principal (aprobar pago, escalar, etc.),
// por eso todo va envuelto en try/catch silencioso.
export async function enviarNotificacionATodos({ titulo, cuerpo, datos }) {
  try {
    const dispositivos = await prisma.dispositivoNotificacion.findMany({
      select: { token: true },
    });

    if (dispositivos.length === 0) return;

    const mensajes = dispositivos.map((dispositivo) => ({
      to: dispositivo.token,
      sound: "default",
      title: titulo,
      body: cuerpo,
      data: datos ?? {},
    }));

    const respuesta = await fetch(URL_PUSH_EXPO, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mensajes),
    });

    if (!respuesta.ok) {
      console.error(
        "❌ Error mandando notificación push:",
        respuesta.status,
        await respuesta.text().catch(() => "")
      );
      return;
    }

    const resultado = await respuesta.json().catch(() => null);

    // Si algún token ya no es válido (usuario desinstaló la app, etc.),
    // Expo lo marca como DeviceNotRegistered — lo limpiamos de la base.
    const tickets = resultado?.data ?? [];
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (
        ticket?.status === "error" &&
        ticket?.details?.error === "DeviceNotRegistered"
      ) {
        await eliminarDispositivo(dispositivos[i]?.token);
      }
    }
  } catch (error) {
    console.error("❌ Error mandando notificación push:", error);
  }
}