import { prisma } from "../lib/prisma.js";

const ESTADOS_VALIDOS = [
  "NO_GENERADO",
  "PENDIENTE",
  "APROBADO",
  "RECHAZADO",
  "VENCIDO",
  "REEMBOLSADO",
];

async function generarCodigoPago() {
  while (true) {
    const codigo = `P${Math.floor(1000 + Math.random() * 9000)}`;

    const existente = await prisma.pago.findUnique({
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

export async function registrarComprobante({ reservaId, comprobanteUrl }) {
  const reserva = await prisma.reserva.findUnique({
    where: {
      id: reservaId,
    },
    include: {
      pago: true,
      cliente: true,
    },
  });

  if (!reserva) {
    throw new Error("Reserva no encontrada");
  }

  if (reserva.estado === "CANCELADA" || reserva.estado === "EXPIRADA") {
    throw new Error("La reserva ya no puede recibir comprobantes");
  }

  let pago = reserva.pago;

  if (!pago) {
    pago = await prisma.pago.create({
      data: {
        reservaId: reserva.id,
        monto: reserva.precioTotal,
        estado: "NO_GENERADO",
      },
    });
  }

  if (pago.estado === "APROBADO") {
    throw new Error("Este pago ya fue aprobado anteriormente");
  }

  const codigo = pago.codigo ?? (await generarCodigoPago());

  return prisma.pago.update({
    where: {
      id: pago.id,
    },
    data: {
      codigo,
      comprobanteUrl,
      estado: "PENDIENTE",
      motivoRechazo: null,
    },
    include: {
      reserva: {
        include: {
          cliente: true,
        },
      },
    },
  });
}

export async function obtenerPagoPorCodigo(codigo) {
  const codigoLimpio = String(codigo ?? "").trim().toUpperCase();

  if (!codigoLimpio) {
    throw new Error("El código de pago es obligatorio");
  }

  const pago = await prisma.pago.findUnique({
    where: {
      codigo: codigoLimpio,
    },
    include: {
      reserva: {
        include: {
          cliente: true,
        },
      },
    },
  });

  if (!pago) {
    throw new Error("Pago no encontrado");
  }

  return pago;
}

export async function aprobarPagoPorCodigo(codigo) {
  const pago = await obtenerPagoPorCodigo(codigo);

  if (pago.estado === "APROBADO") {
    throw new Error("Este pago ya fue aprobado anteriormente");
  }

  return actualizarEstadoPago(pago.id, "APROBADO");
}

export async function rechazarPagoPorCodigo(codigo, motivo) {
  const pago = await obtenerPagoPorCodigo(codigo);

  if (pago.estado === "APROBADO") {
    throw new Error("Este pago ya fue aprobado, no se puede rechazar");
  }

  return prisma.pago.update({
    where: {
      id: pago.id,
    },
    data: {
      estado: "RECHAZADO",
      motivoRechazo: motivo?.trim() || "Sin motivo especificado",
    },
    include: {
      reserva: {
        include: {
          cliente: true,
        },
      },
    },
  });
}

export async function crearPago(reservaId) {
  const reserva = await prisma.reserva.findUnique({
    where: {
      id: reservaId,
    },
    include: {
      pago: true,
    },
  });

  if (!reserva) {
    throw new Error("Reserva no encontrada");
  }

  if (reserva.pago) {
    return reserva.pago;
  }

  return prisma.pago.create({
    data: {
      reservaId: reserva.id,
      monto: reserva.precioTotal,
      estado: "NO_GENERADO",
    },
  });
}

export async function generarLinkPagoSimulado(id) {
  const pago = await prisma.pago.findUnique({
    where: {
      id,
    },
    include: {
      reserva: true,
    },
  });

  if (!pago) {
    throw new Error("Pago no encontrado");
  }

  if (pago.estado === "APROBADO") {
    throw new Error("El pago ya fue aprobado");
  }

  if (
    pago.reserva.estado === "CANCELADA" ||
    pago.reserva.estado === "EXPIRADA"
  ) {
    throw new Error("La reserva ya no puede pagarse");
  }

  const referenciaExterna = `SIM-${Date.now()}`;
  const urlPago = `http://localhost:3000/pago-simulado/${pago.id}`;

  return prisma.pago.update({
    where: {
      id,
    },
    data: {
      referenciaExterna,
      urlPago,
      estado: "PENDIENTE",
    },
  });
}

export async function obtenerPago(id) {
  const pago = await prisma.pago.findUnique({
    where: {
      id,
    },
    include: {
      reserva: {
        include: {
          cliente: true,
          habitacion: true,
        },
      },
    },
  });

  if (!pago) {
    throw new Error("Pago no encontrado");
  }

  return pago;
}

export async function actualizarEstadoPago(id, estado) {
  const estadoNormalizado = String(estado ?? "")
    .trim()
    .toUpperCase();

  if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
    throw new Error("Estado de pago inválido");
  }

  const pago = await prisma.pago.findUnique({
    where: {
      id,
    },
    include: {
      reserva: {
        include: {
          cliente: true,
        },
      },
    },
  });

  if (!pago) {
    throw new Error("Pago no encontrado");
  }

  return prisma.$transaction(async (tx) => {
    const pagoActualizado = await tx.pago.update({
      where: {
        id,
      },
      data: {
        estado: estadoNormalizado,
        fechaPago:
          estadoNormalizado === "APROBADO"
            ? new Date()
            : pago.fechaPago,
      },
    });

    let reservaActualizada = pago.reserva;

    if (estadoNormalizado === "APROBADO") {
      reservaActualizada = await tx.reserva.update({
        where: {
          id: pago.reservaId,
        },
        data: {
          estado: "CONFIRMADA",
          expiraEn: null,
        },
        include: {
          cliente: true,
        },
      });
    }

    if (
      estadoNormalizado === "VENCIDO" &&
      pago.reserva.estado === "PENDIENTE_PAGO"
    ) {
      reservaActualizada = await tx.reserva.update({
        where: {
          id: pago.reservaId,
        },
        data: {
          estado: "EXPIRADA",
        },
      });
    }

    return {
      pago: pagoActualizado,
      reserva: reservaActualizada,
    };
  });
}