import { prisma } from "../lib/prisma.js";

export async function obtenerOCrearConversacion(telefono) {
  const telefonoLimpio = String(telefono ?? "").trim();

  if (!telefonoLimpio) {
    throw new Error("El teléfono es obligatorio");
  }

  return prisma.conversation.upsert({
    where: {
      telefono: telefonoLimpio,
    },
    update: {},
    create: {
      telefono: telefonoLimpio,
      mode: "BOT",
      step: "INICIO",
    },
  });
}

export async function obtenerConversacionConHistorial(
  telefono,
  limite = 15
) {
  const telefonoLimpio = String(telefono ?? "").trim();

  const conversation = await prisma.conversation.findUnique({
    where: {
      telefono: telefonoLimpio,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: limite,
      },
    },
  });

  if (!conversation) {
    return null;
  }

  return {
    ...conversation,
    messages: conversation.messages.reverse(),
  };
}

export async function actualizarEstadoConversacion(
  conversationId,
  data
) {
  return prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data,
  });
}

export async function obtenerConversacionPorId(id) {
  const conversacion = await prisma.conversation.findUnique({
    where: {
      id,
    },
  });

  if (!conversacion) {
    throw new Error("Conversación no encontrada");
  }

  return conversacion;
}
export async function reiniciarDatosReserva(conversationId) {
  if (!conversationId) {
    throw new Error("El ID de la conversación es obligatorio");
  }

  return prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      step: "INICIO",
      fechaEntrada: null,
      fechaSalida: null,
      cantidadPersonas: null,
      nombreCliente: null,
      reservaId: null,
      ultimaDisponibilidadAt: null,
    },
  });
}