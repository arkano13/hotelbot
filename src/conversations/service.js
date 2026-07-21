import { prisma } from "../lib/prisma.js";

function limpiarTelefono(telefono) {
  return String(telefono ?? "")
    .replace(/\D/g, "")
    .trim();
}

async function generarCodigoConversacion() {
  while (true) {
    const codigo = `C${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const existente =
      await prisma.conversation.findUnique({
        where: {
          codigo,
        },
        select: {
          id: true,
        },
      });

    if (!existente) {
      return codigo;
    }
  }
}

export async function obtenerOCrearConversacion(
  telefono
) {
  const telefonoLimpio =
    limpiarTelefono(telefono);

  if (!telefonoLimpio) {
    throw new Error(
      "El teléfono es obligatorio"
    );
  }

  const conversacionExistente =
    await prisma.conversation.findUnique({
      where: {
        telefono: telefonoLimpio,
      },
    });

  if (conversacionExistente) {
    return prisma.conversation.update({
      where: {
        id: conversacionExistente.id,
      },
      data: {
        status: "ACTIVA",
      },
    });
  }

  const codigo =
    await generarCodigoConversacion();

  return prisma.conversation.create({
    data: {
      codigo,
      telefono: telefonoLimpio,
      mode: "BOT",
      status: "ACTIVA",
      step: "INICIO",
    },
  });
}

export async function obtenerConversacionConHistorial(
  telefono,
  limite = 15
) {
  const telefonoLimpio =
    limpiarTelefono(telefono);

  if (!telefonoLimpio) {
    throw new Error(
      "El teléfono es obligatorio"
    );
  }

  const conversacion =
    await prisma.conversation.findUnique({
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

  if (!conversacion) {
    return null;
  }

  return {
    ...conversacion,
    messages:
      conversacion.messages.reverse(),
  };
}

export async function obtenerConversacionPorId(
  id
) {
  if (!id) {
    throw new Error(
      "El ID de la conversación es obligatorio"
    );
  }

  const conversacion =
    await prisma.conversation.findUnique({
      where: {
        id,
      },
    });

  if (!conversacion) {
    throw new Error(
      "Conversación no encontrada"
    );
  }

  return conversacion;
}

export async function obtenerConversacionPorCodigo(
  codigo
) {
  const codigoLimpio = String(
    codigo ?? ""
  )
    .trim()
    .toUpperCase();

  if (!codigoLimpio) {
    throw new Error(
      "El código de conversación es obligatorio"
    );
  }

  const conversacion =
    await prisma.conversation.findUnique({
      where: {
        codigo: codigoLimpio,
      },
    });

  if (!conversacion) {
    throw new Error(
      "Conversación no encontrada"
    );
  }

  return conversacion;
}

export async function actualizarEstadoConversacion(
  conversationId,
  data
) {
  if (!conversationId) {
    throw new Error(
      "El ID de la conversación es obligatorio"
    );
  }

  return prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data,
  });
}

export async function cambiarModoConversacion(
  conversationId,
  mode
) {
  const modo = String(mode ?? "")
    .trim()
    .toUpperCase();

  if (!["BOT", "HUMANO"].includes(modo)) {
    throw new Error(
      "Modo de conversación inválido"
    );
  }

  return prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      mode: modo,
      status: "ACTIVA",
      necesitaHumano: false,
      motivoEscalar: null,
    },
  });
}

export async function listarConversacionesActivas() {
  return prisma.conversation.findMany({
    where: {
      status: "ACTIVA",
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 20,
  });
}

export async function listarEscalacionesPendientes() {
  return prisma.conversation.findMany({
    where: {
      necesitaHumano: true,
    },
    orderBy: {
      escaladaEn: "asc",
    },
  });
}

export async function listarConversacionesEnModoHumano() {
  return prisma.conversation.findMany({
    where: {
      mode: "HUMANO",
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function reiniciarDatosReserva(
  conversationId
) {
  if (!conversationId) {
    throw new Error(
      "El ID de la conversación es obligatorio"
    );
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
      reservaIds: null,
      ultimaDisponibilidadAt: null,
      status: "ACTIVA",
    },
  });
}

export async function finalizarConversacion(
  conversationId
) {
  if (!conversationId) {
    throw new Error(
      "El ID de la conversación es obligatorio"
    );
  }

  return prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      status: "FINALIZADA",
    },
  });
}

export async function reactivarConversacion(
  conversationId
) {
  if (!conversationId) {
    throw new Error(
      "El ID de la conversación es obligatorio"
    );
  }

  return prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      status: "ACTIVA",
    },
  });
}