import { prisma } from "../lib/prisma.js";
import { registrarAuditoria } from "../auditoria/service.js";
import { enviarNotificacionATodos } from "../notificaciones/service.js";

const ESTADOS_VALIDOS = [
  "NO_GENERADO",
  "PENDIENTE",
  "APROBADO",
  "RECHAZADO",
  "VENCIDO",
  "REEMBOLSADO",
];

async function ejecutarTransaccionSerializable(operacion, intentosMaximos = 3) {
  for (let intento = 1; intento <= intentosMaximos; intento++) {
    try {
      return await prisma.$transaction(operacion, {
        isolationLevel: "Serializable",
      });
    } catch (error) {
      const conflictoConcurrente = error?.code === "P2034";

      if (!conflictoConcurrente || intento === intentosMaximos) {
        throw error;
      }
    }
  }

  throw new Error("No se pudo aprobar el pago por concurrencia.");
}

async function generarCodigoPago(tx = prisma) {
  while (true) {
    const codigo = `P${Math.floor(1000 + Math.random() * 9000)}`;

    const existente = await tx.pago.findUnique({
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

async function buscarHabitacionDisponible(tx, reserva) {
  const habitaciones = await tx.habitacion.findMany({
    where: {
      activa: true,
      estado: "DISPONIBLE",
      capacidad: reserva.cantidadPersonas,
    },
    orderBy: {
      numero: "asc",
    },
  });

  const ordenadas = [
    ...habitaciones.filter((habitacion) => habitacion.id === reserva.habitacionId),
    ...habitaciones.filter((habitacion) => habitacion.id !== reserva.habitacionId),
  ];

  for (const habitacion of ordenadas) {
    const conflicto = await tx.reserva.findFirst({
      where: {
        id: {
          not: reserva.id,
        },
        habitacionId: habitacion.id,
        estado: {
          in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"],
        },
        fechaEntrada: {
          lt: reserva.fechaSalida,
        },
        fechaSalida: {
          gt: reserva.fechaEntrada,
        },
      },
      select: {
        id: true,
      },
    });

    if (!conflicto) {
      return habitacion;
    }
  }

  return null;
}

async function aprobarPagoSeguro(id) {
  return ejecutarTransaccionSerializable(async (tx) => {
    const pago = await tx.pago.findUnique({
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

    if (pago.estado === "APROBADO") {
      throw new Error("Este pago ya fue aprobado anteriormente");
    }

    const reserva = pago.reserva;

    if (["CANCELADA", "CHECK_IN", "CHECK_OUT"].includes(reserva.estado)) {
      throw new Error(
        `La reserva está en estado ${reserva.estado} y el pago no puede aprobarse`
      );
    }

    const habitacion = await buscarHabitacionDisponible(tx, reserva);

    if (!habitacion) {
      throw new Error(
        "El pago llegó tarde y ya no hay una habitación disponible para esas fechas. No lo apruebes."
      );
    }

    const pagoActualizado = await tx.pago.update({
      where: {
        id: pago.id,
      },
      data: {
        estado: "APROBADO",
        fechaPago: new Date(),
        motivoRechazo: null,
      },
    });

    const reservaActualizada = await tx.reserva.update({
      where: {
        id: reserva.id,
      },
      data: {
        habitacionId: habitacion.id,
        estado: "CONFIRMADA",
        expiraEn: null,
      },
      include: {
        cliente: true,
        habitacion: true,
        pago: true,
      },
    });

    return {
      pago: pagoActualizado,
      reserva: reservaActualizada,
      reasignada: habitacion.id !== reserva.habitacionId,
    };
  });
}

export async function registrarComprobantes({ reservaIds, comprobanteUrl }) {
  const ids = [...new Set((reservaIds ?? []).filter(Boolean))];

  if (ids.length === 0) {
    throw new Error("No se indicó ninguna reserva");
  }

  return ejecutarTransaccionSerializable(async (tx) => {
    const reservas = await tx.reserva.findMany({
      where: { id: { in: ids } },
      include: { pago: true, cliente: true, habitacion: true },
    });

    if (reservas.length !== ids.length) {
      throw new Error("Una o más reservas no fueron encontradas");
    }

    const porId = new Map(reservas.map((reserva) => [reserva.id, reserva]));
    const ordenadas = ids.map((id) => porId.get(id));

    for (const reserva of ordenadas) {
      if (["CANCELADA", "CHECK_IN", "CHECK_OUT"].includes(reserva.estado)) {
        throw new Error(`La reserva ${reserva.codigo} ya no puede recibir comprobantes`);
      }

      if (reserva.pago?.estado === "APROBADO") {
        throw new Error(`El pago de ${reserva.codigo} ya fue aprobado`);
      }
    }

    const pagos = [];
    const ahora = new Date();

    for (const reserva of ordenadas) {
      let pago = reserva.pago;

      if (!pago) {
        pago = await tx.pago.create({
          data: {
            reservaId: reserva.id,
            monto: reserva.precioTotal,
            estado: "NO_GENERADO",
          },
        });
      }

      const codigo = pago.codigo ?? (await generarCodigoPago(tx));
      const llegoATiempo =
        reserva.estado === "PENDIENTE_PAGO" &&
        (!reserva.expiraEn || reserva.expiraEn > ahora);

      if (llegoATiempo) {
        await tx.reserva.update({
          where: { id: reserva.id },
          data: { expiraEn: null },
        });
      }

      pagos.push(
        await tx.pago.update({
          where: { id: pago.id },
          data: {
            codigo,
            comprobanteUrl,
            estado: "PENDIENTE",
            motivoRechazo: null,
          },
          include: {
            reserva: {
              include: { cliente: true, habitacion: true },
            },
          },
        }),
      );
    }

    return pagos;
  }).then(async (pagos) => {
    const primero = pagos[0]?.reserva;
    await enviarNotificacionATodos({
      titulo: "💳 Nuevo comprobante",
      cuerpo:
        pagos.length > 1
          ? `${primero?.cliente?.nombre ?? "Un cliente"} envió comprobante para ${pagos.length} habitaciones`
          : `${primero?.cliente?.nombre ?? "Un cliente"} · Hab. ${primero?.habitacion?.numero ?? ""}`,
      datos: { tipo: "pago_pendiente" },
    });

    return pagos;
  });
}

export async function registrarComprobante({ reservaId, comprobanteUrl }) {
  const pagos = await registrarComprobantes({
    reservaIds: [reservaId],
    comprobanteUrl,
  });

  return pagos[0];
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
  const resultado = await aprobarPagoSeguro(pago.id);

  await registrarAuditoria({
    accion: "APROBAR_PAGO",
    entidad: "Pago",
    entidadId: pago.id,
    detalle: `${codigo} · ${resultado.reserva.codigo} · Hab. ${resultado.reserva.habitacion.numero}`,
  });

  return resultado;
}

export async function rechazarPagoPorCodigo(codigo, motivo) {
  const pago = await obtenerPagoPorCodigo(codigo);

  if (pago.estado === "APROBADO") {
    throw new Error("Este pago ya fue aprobado, no se puede rechazar");
  }

  const resultado = await prisma.$transaction(async (tx) => {
    if (pago.reserva.estado === "PENDIENTE_PAGO") {
      await tx.reserva.update({
        where: {
          id: pago.reservaId,
        },
        data: {
          expiraEn: new Date(Date.now() + 30 * 60 * 1000),
        },
      });
    }

    return tx.pago.update({
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
            habitacion: true,
          },
        },
      },
    });
  });

  await registrarAuditoria({
    accion: "RECHAZAR_PAGO",
    entidad: "Pago",
    entidadId: pago.id,
    detalle: `${codigo} · ${resultado.reserva.codigo} · motivo: ${motivo?.trim() || "sin motivo"}`,
  });

  return resultado;
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

  if (estadoNormalizado === "APROBADO") {
    return aprobarPagoSeguro(id);
  }

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

  return prisma.$transaction(async (tx) => {
    const pagoActualizado = await tx.pago.update({
      where: {
        id,
      },
      data: {
        estado: estadoNormalizado,
      },
    });

    let reservaActualizada = pago.reserva;

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
        include: {
          cliente: true,
          habitacion: true,
        },
      });
    }

    return {
      pago: pagoActualizado,
      reserva: reservaActualizada,
    };
  });
}

export async function listarPagosPendientes() {
  return prisma.pago.findMany({
    where: {
      estado: "PENDIENTE",
      comprobanteUrl: { not: null },
    },
    include: {
      reserva: {
        include: {
          cliente: true,
          habitacion: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}