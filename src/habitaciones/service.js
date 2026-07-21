import { prisma } from "../lib/prisma.js";

export async function listarHabitacionesConEstado() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  const habitaciones = await prisma.habitacion.findMany({
    where: { activa: true },
    orderBy: { numero: "asc" },
  });

  const reservasDeHoy = await prisma.reserva.findMany({
    where: {
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
      fechaEntrada: { lt: fin },
      fechaSalida: { gt: inicio },
    },
    include: {
      cliente: true,
      pago: true,
    },
    orderBy: { fechaEntrada: "asc" },
  });

  const reservaPorHabitacion = new Map();
  for (const reserva of reservasDeHoy) {
    if (!reservaPorHabitacion.has(reserva.habitacionId)) {
      reservaPorHabitacion.set(reserva.habitacionId, reserva);
    }
  }

  return habitaciones.map((habitacion) => {
    if (habitacion.estado === "MANTENIMIENTO") {
      return {
        id: habitacion.id,
        numero: habitacion.numero,
        capacidad: habitacion.capacidad,
        estado: "MANTENIMIENTO",
        reserva: null,
      };
    }

    const reserva = reservaPorHabitacion.get(habitacion.id);

    if (!reserva) {
      return {
        id: habitacion.id,
        numero: habitacion.numero,
        capacidad: habitacion.capacidad,
        estado: "LIBRE",
        reserva: null,
      };
    }

    const estado = reserva.estado === "CHECK_IN" ? "OCUPADA" : "RESERVADA";

    return {
      id: habitacion.id,
      numero: habitacion.numero,
      capacidad: habitacion.capacidad,
      estado,
      reserva: {
        id: reserva.id,
        codigo: reserva.codigo,
        estado: reserva.estado,
        cliente: reserva.cliente?.nombre ?? null,
        telefono: reserva.cliente?.telefono ?? null,
        fechaEntrada: reserva.fechaEntrada,
        fechaSalida: reserva.fechaSalida,
        metodoPago: reserva.pago?.proveedor ?? null,
        estadoPago: reserva.pago?.estado ?? null,
      },
    };
  });
}
