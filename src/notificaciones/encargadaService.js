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

// Devuelve true SOLO si el mensaje de verdad se mandó. Antes, esta
// función no confirmaba nada — si WhatsApp estaba a medio reconectar
// justo en ese momento, el mensaje se perdía en silencio y el sistema
// igual lo marcaba como "enviado", sin volver a intentarlo nunca.
async function enviarPorWhatsApp(telefono, texto) {
  try {
    const socket = obtenerWhatsAppSocket();
    if (!socket || !telefono) {
      return false;
    }

    await socket.sendMessage(`${telefono}@s.whatsapp.net`, { text: texto });
    return true;
  } catch (error) {
    console.error("❌ No se pudo mandar el WhatsApp a la encargada (se reintentará):", error.message);
    return false;
  }
}

// Notifica a la encargada de habitaciones (ENCARGADA_PHONE) de que una
// habitación quedó ocupada. Si es dentro de su horario, se intenta mandar
// de una vez; si falla (o está fuera de horario), se guarda como
// pendiente para reintentarse — así nunca se pierde en silencio.
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
    const enviado = await enviarPorWhatsApp(encargadaPhone, texto);
    if (enviado) return;
    // Si estaba en horario pero el envío falló (WhatsApp reconectando,
    // etc.), no se pierde — se guarda pendiente para el próximo minuto.
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
// horario de la encargada, intenta mandar todo lo pendiente — solo se
// marca como enviado lo que de verdad se confirmó; lo que falla se
// queda pendiente para reintentarse el próximo minuto.
export async function procesarNotificacionesPendientesEncargada() {
  if (!dentroDeHorarioEncargada()) return;

  const pendientes = await prisma.notificacionEncargadaPendiente.findMany({
    where: { enviada: false },
    orderBy: { createdAt: "asc" },
  });

  if (pendientes.length === 0) return;

  let cantidadEnviada = 0;

  for (const pendiente of pendientes) {
    const enviado = await enviarPorWhatsApp(pendiente.telefono, pendiente.mensaje);

    if (!enviado) {
      continue; // se queda enviada=false, se reintenta el próximo minuto
    }

    await prisma.notificacionEncargadaPendiente
      .update({
        where: { id: pendiente.id },
        data: { enviada: true, enviadaEn: new Date() },
      })
      .catch(() => {});

    cantidadEnviada++;
  }

  if (cantidadEnviada > 0) {
    console.log(
      `🛏️ ${cantidadEnviada}/${pendientes.length} notificación(es) pendiente(s) de la encargada enviadas.`
    );
  }
}