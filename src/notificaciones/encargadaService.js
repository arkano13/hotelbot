import { obtenerWhatsAppSocket } from "../whatsapp/client.js";

// Horario de trabajo de la encargada en hora de Honduras.
// HORA_FIN es exclusiva: 17 significa hasta las 4:59 p. m.
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

async function enviarPorWhatsApp(telefono, texto) {
  try {
    const socket = obtenerWhatsAppSocket();
    await socket.sendMessage(`${telefono}@s.whatsapp.net`, { text: texto });
    return true;
  } catch (error) {
    console.error(
      "❌ No se pudo mandar el WhatsApp a la encargada:",
      error.message
    );
    return false;
  }
}

// Se llama exclusivamente cuando una habitación pasa a CHECK_IN:
// desde el check-in de una reserva o desde la acción Ocupar.
// Fuera del horario de la encargada no envía ni guarda notificaciones.
export async function notificarEncargadaHabitacionOcupada({
  numero,
  cliente,
  personas,
  fechaSalida,
}) {
  const encargadaPhone = String(process.env.ENCARGADA_PHONE ?? "")
    .replace(/\D/g, "")
    .trim();

  if (!encargadaPhone || !dentroDeHorarioEncargada()) return false;

  const fechaSalidaTexto = fechaSalida
    ? new Date(fechaSalida).toLocaleDateString("es-HN", {
        timeZone: "America/Tegucigalpa",
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

  return enviarPorWhatsApp(encargadaPhone, texto);
}
