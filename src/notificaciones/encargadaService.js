import { prisma } from "../lib/prisma.js";
import { obtenerWhatsAppSocket } from "../whatsapp/client.js";

// Horario de trabajo de la encargada (hora de Honduras). Configurable por
// variables de entorno — mientras no se definan, usa 6am-5pm como
// ejemplo razonable. HORA_FIN es exclusiva (17 significa "hasta las
// 4:59pm", no hasta las 5:00pm en punto).
function obtenerHorarioEncargada() {
  const inicio = Number(process.env.ENCARGADA_HORA_INICIO ?? 6);
  const fin = Number(process.env.ENCARGADA_HORA_FIN ?? 17);
  return { inicio, fin };
}

function horaActualHonduras() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Tegucigalpa",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date())
  );
}

function dentroDeHorarioEncargada() {
  const { inicio, fin } = obtenerHorarioEncargada();
  const horaActual = horaActualHonduras();
  return horaActual >= inicio && horaActual < fin;
}

function enviarPorWhatsApp(telefono, texto) {
  try {
    const socket = obtenerWhatsAppSocket();
    if (socket && telefono) {
      return socket
        .sendMessage(`${telefono}@s.whatsapp.net`, { text: texto })
        .catch(() => {});
    }
  } catch {
    // Si WhatsApp no está conectado en este momento, no es motivo para
    // fallar — el mensaje ya se puede haber guardado como pendiente.
  }
}

// Notifica a la encargada de habitaciones (ENCARGADA_PHONE) de que una
// habitación quedó ocupada. Si es dentro de su horario, se manda de una
// vez; si no, se guarda para mandarse sola apenas empiece su siguiente
// turno.
export async function notificarEncargadaHabitacionOcupada({
  numero,
  cliente,
  personas,
  fechaSalida,
}) {
  const encargadaPhone = String(process.env.ENCARGADA_PHONE || "").trim();
  if (!encargadaPhone) return;

  const fechaSalidaTexto = fechaSalida
    ? new Date(fechaSalida).toLocaleDateString("es-HN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "N/D";

  const texto =
    `🛏️ Se ocupó la Habitación ${numero}\n` +
    `Huésped: ${cliente}\n` +
    `${personas ? `Personas: ${personas}\n` : ""}` +
    `Sale: ${fechaSalidaTexto}`;

  if (dentroDeHorarioEncargada()) {
    enviarPorWhatsApp(encargadaPhone, texto);
    return;
  }

  await prisma.notificacionEncargadaPendiente
    .create({
      data: {
        telefono: encargadaPhone,
        mensaje: texto,
      },
    })
    .catch((error) =>
      console.error("❌ Error guardando notificación pendiente de encargada:", error)
    );
}

// Se llama cada minuto desde el scheduler. Si ya estamos dentro del
// horario de la encargada, manda todo lo que se quedó pendiente de fuera
// de turno.
export async function procesarNotificacionesPendientesEncargada() {
  if (!dentroDeHorarioEncargada()) return;

  const pendientes = await prisma.notificacionEncargadaPendiente.findMany({
    where: { enviada: false },
    orderBy: { createdAt: "asc" },
  });

  if (pendientes.length === 0) return;

  for (const pendiente of pendientes) {
    enviarPorWhatsApp(pendiente.telefono, pendiente.mensaje);

    await prisma.notificacionEncargadaPendiente
      .update({
        where: { id: pendiente.id },
        data: { enviada: true, enviadaEn: new Date() },
      })
      .catch(() => {});
  }

  console.log(
    `🛏️ ${pendientes.length} notificación(es) pendiente(s) de la encargada enviadas al empezar su turno.`
  );
}