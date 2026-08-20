import { prisma } from "../lib/prisma.js";
import { obtenerRangoHoyHonduras, crearFechaHonduras } from "../lib/fecha.js";
import { hotelInfo } from "../config/hotelInfo.js";
import { registrarAuditoria } from "../auditoria/service.js";

// Edita el número y la capacidad de una habitación ya creada (desde la
// pantalla de "Editar habitación" en la app). No toca el estado de
// mantenimiento ni la disponibilidad — eso sigue siendo aparte.
export async function editarHabitacion(habitacionId, { numero, capacidad }) {
  const habitacion = await prisma.habitacion.findUnique({
    where: { id: habitacionId },
  });

  if (!habitacion) {
    throw new Error("Habitación no encontrada");
  }

  const numeroLimpio = String(numero ?? "").trim();
  const capacidadNumero = Number(capacidad);

  if (!numeroLimpio) {
    throw new Error("El número de habitación es obligatorio");
  }

  if (!Number.isInteger(capacidadNumero) || capacidadNumero < 1) {
    throw new Error("La capacidad no es válida");
  }

  let habitacionActualizada;
  try {
    habitacionActualizada = await prisma.habitacion.update({
      where: { id: habitacionId },
      data: {
        numero: numeroLimpio,
        capacidad: capacidadNumero,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error(`Ya existe una habitación con el número "${numeroLimpio}"`);
    }
    throw error;
  }

  await registrarAuditoria({
    accion: "EDITAR_HABITACION",
    entidad: "Habitacion",
    entidadId: habitacionActualizada.id,
    detalle: `Hab. ${habitacion.numero} → número "${numeroLimpio}", capacidad ${capacidadNumero}`,
  });

  return habitacionActualizada;
}

export async function listarHabitacionesConEstado() {
  const { fin } = obtenerRangoHoyHonduras();
  const ahora = new Date();
  const salidaMinimaConfirmada = new Date(
    ahora.getTime() -
      hotelInfo.horarios.horaCheckOut * 60 * 60 * 1000
  );

  const habitaciones = await prisma.habitacion.findMany({
    where: { activa: true },
    orderBy: { numero: "asc" },
  });

  const reservasDeHoy = await prisma.reserva.findMany({
    where: {
      OR: [
        {
          estado: "CHECK_IN",
        },
        {
          estado: "CONFIRMADA",
          fechaEntrada: { lt: fin },
          fechaSalida: { gt: salidaMinimaConfirmada },
        },
        {
          estado: "PENDIENTE_PAGO",
          fechaEntrada: { lt: fin },
          OR: [
            { expiraEn: null },
            { expiraEn: { gt: ahora } },
          ],
        },
      ],
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
        tipoEstadia: reserva.tipoEstadia,
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