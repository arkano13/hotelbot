import { prisma } from "../lib/prisma.js";
import { obtenerWhatsAppSocket } from "../whatsapp/client.js";

const INTERVALO_REVISION_MS = 10 * 60 * 1000;
const TIEMPO_INACTIVIDAD_MS = 60 * 60 * 1000;
const TIEMPO_HUMANO_MS = 2 * 60 * 60 * 1000;

const OWNER_PHONE = String(process.env.OWNER_PHONE ?? "")
  .replace(/\D/g, "")
  .trim();

let intervalo = null;
let ejecutando = false;

export async function finalizarConversacionesInactivas() {
  if (ejecutando) {
    return;
  }

  ejecutando = true;

  try {
    const haceUnaHora = new Date(Date.now() - TIEMPO_INACTIVIDAD_MS);

    const resultado = await prisma.conversation.updateMany({
      where: {
        status: "ACTIVA",
        mode: "BOT",
        updatedAt: {
          lte: haceUnaHora,
        },
      },
      data: {
        status: "FINALIZADA",
      },
    });

    if (resultado.count > 0) {
      console.log(
        `💬 ${resultado.count} conversación(es) finalizada(s) por inactividad`
      );
    }
  } catch (error) {
    console.error("❌ Error finalizando conversaciones inactivas:", error);
  } finally {
    ejecutando = false;
  }
}

export async function revertirModoHumanoInactivo() {
  try {
    const hace2Horas = new Date(Date.now() - TIEMPO_HUMANO_MS);

    const conversacionesAtascadas = await prisma.conversation.findMany({
      where: {
        mode: "HUMANO",
        updatedAt: {
          lte: hace2Horas,
        },
      },
    });

    if (conversacionesAtascadas.length === 0) {
      return;
    }

    let socket;

    try {
      socket = obtenerWhatsAppSocket();
    } catch {
      console.log(
        "⚠️ No se pudo notificar el regreso a modo BOT: WhatsApp no está conectado todavía"
      );
      socket = null;
    }

    for (const conversacion of conversacionesAtascadas) {
      await prisma.conversation.update({
        where: {
          id: conversacion.id,
        },
        data: {
          mode: "BOT",
        },
      });

      console.log(
        `🤖 ${conversacion.codigo} volvió a modo BOT automático (2h sin actividad en modo HUMANO)`
      );

      if (!socket) {
        continue;
      }

      try {
        await socket.sendMessage(`${conversacion.telefono}@s.whatsapp.net`, {
          text: "Seguimos por aquí, ¿en qué más te ayudo? 🙂",
        });
      } catch (error) {
        console.error(
          `❌ Error avisando al cliente ${conversacion.codigo}:`,
          error
        );
      }

      if (OWNER_PHONE) {
        try {
          await socket.sendMessage(`${OWNER_PHONE}@s.whatsapp.net`, {
            text: `🤖 ${conversacion.codigo} volvió sola a modo BOT (llevaba 2h+ en HUMANO sin actividad).`,
          });
        } catch (error) {
          console.error("❌ Error avisando al jefe:", error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error revirtiendo modo HUMANO inactivo:", error);
  }
}

export function iniciarSchedulerConversaciones() {
  if (intervalo) {
    return;
  }

  console.log(
    "✅ Scheduler de conversaciones iniciado: revisión cada 10 minutos"
  );

  finalizarConversacionesInactivas().catch(console.error);
  revertirModoHumanoInactivo().catch(console.error);

  intervalo = setInterval(() => {
    finalizarConversacionesInactivas().catch(console.error);
    revertirModoHumanoInactivo().catch(console.error);
  }, INTERVALO_REVISION_MS);
}

export function detenerSchedulerConversaciones() {
  if (!intervalo) {
    return;
  }

  clearInterval(intervalo);
  intervalo = null;

  console.log("🛑 Scheduler de conversaciones detenido");
}