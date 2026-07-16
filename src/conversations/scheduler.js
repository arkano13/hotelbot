import { prisma } from "../lib/prisma.js";

const INTERVALO_REVISION_MS = 10 * 60 * 1000;
const TIEMPO_INACTIVIDAD_MS = 60 * 60 * 1000;

let intervalo = null;
let ejecutando = false;

export async function finalizarConversacionesInactivas() {
  if (ejecutando) {
    return;
  }

  ejecutando = true;

  try {
    const haceUnaHora = new Date(
      Date.now() - TIEMPO_INACTIVIDAD_MS
    );

    const resultado =
      await prisma.conversation.updateMany({
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
    console.error(
      "❌ Error finalizando conversaciones inactivas:",
      error
    );
  } finally {
    ejecutando = false;
  }
}

export function iniciarSchedulerConversaciones() {
  if (intervalo) {
    return;
  }

  console.log(
    "✅ Scheduler de conversaciones iniciado: revisión cada 20 minutos"
  );

  finalizarConversacionesInactivas().catch(
    console.error
  );

  intervalo = setInterval(() => {
    finalizarConversacionesInactivas().catch(
      console.error
    );
  }, INTERVALO_REVISION_MS);
}

export function detenerSchedulerConversaciones() {
  if (!intervalo) {
    return;
  }

  clearInterval(intervalo);
  intervalo = null;

  console.log(
    "🛑 Scheduler de conversaciones detenido"
  );
}