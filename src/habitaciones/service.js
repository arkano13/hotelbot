import { prisma } from "../lib/prisma.js";
import { obtenerRangoHoyHonduras, crearFechaHonduras } from "../lib/fecha.js";

export async function listarHabitacionesConEstado() {
  const { inicio, fin } = obtenerRangoHoyHonduras();

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
    // Si hay más de una para la misma habitación (no debería con el
    // control de conflictos, pero por si acaso), nos quedamos con la
    // primera por orden de entrada.
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

// Para el walk-in: dado un rango de fechas y una capacidad mínima, muestra
// TODAS las habitaciones (no solo las libres) con su estado, para que en la
// app se puedan ver en rojo (ocupada/confirmada) o amarillo (reservada pero
// sin pagar) en vez de simplemente no aparecer.
export async function listarHabitacionesPorCapacidadConEstado({
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const entrada = crearFechaHonduras(fechaEntrada);
  const salida = crearFechaHonduras(fechaSalida);
  const cantidadPersonas = Number(personas);

  if (Number.isNaN(entrada.getTime()) || Number.isNaN(salida.getTime())) {
    throw new Error("Las fechas no son válidas");
  }

  if (salida <= entrada) {
    throw new Error("La fecha de salida debe ser posterior a la entrada");
  }

  const habitaciones = await prisma.habitacion.findMany({
    where: {
      activa: true,
      estado: { not: "MANTENIMIENTO" },
      capacidad: { gte: cantidadPersonas },
    },
    orderBy: [{ capacidad: "asc" }, { numero: "asc" }],
  });

  const reservasEnRango = await prisma.reserva.findMany({
    where: {
      habitacionId: { in: habitaciones.map((h) => h.id) },
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
      fechaEntrada: { lt: salida },
      fechaSalida: { gt: entrada },
    },
    include: { cliente: true },
    orderBy: { fechaEntrada: "asc" },
  });

  const reservaPorHabitacion = new Map();
  for (const reserva of reservasEnRango) {
    if (!reservaPorHabitacion.has(reserva.habitacionId)) {
      reservaPorHabitacion.set(reserva.habitacionId, reserva);
    }
  }

  return habitaciones.map((habitacion) => {
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

    // Confirmada o ya con alguien adentro = bloqueada de verdad (rojo).
    // Pendiente de pago = reservada pero se podría liberar cancelándola
    // primero (amarillo).
    const estado =
      reserva.estado === "PENDIENTE_PAGO" ? "RESERVADA_PENDIENTE" : "OCUPADA";

    return {
      id: habitacion.id,
      numero: habitacion.numero,
      capacidad: habitacion.capacidad,
      estado,
      reserva: {
        id: reserva.id,
        codigo: reserva.codigo,
        cliente: reserva.cliente?.nombre ?? null,
      },
    };
  });
}