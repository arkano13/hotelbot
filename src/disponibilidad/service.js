import { prisma } from "../lib/prisma.js";

export async function consultarDisponibilidad({
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const entrada = new Date(`${fechaEntrada}T00:00:00`);
  const salida = new Date(`${fechaSalida}T00:00:00`);
  const cantidad = Number(personas);

  if (Number.isNaN(entrada.getTime()) || Number.isNaN(salida.getTime())) {
    throw new Error("Las fechas no son válidas");
  }

  if (salida <= entrada) {
    throw new Error("La fecha de salida debe ser posterior a la entrada");
  }

  if (![1, 2, 3].includes(cantidad)) {
    throw new Error("La cantidad de personas debe ser 1, 2 o 3");
  }

  const habitaciones = await prisma.habitacion.findMany({
    where: {
      activa: true,
      estado: "DISPONIBLE",
      capacidad: {
        gte: cantidad,
      },
      reservas: {
        none: {
          estado: {
            in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"],
          },
          fechaEntrada: {
            lt: salida,
          },
          fechaSalida: {
            gt: entrada,
          },
        },
      },
    },
    orderBy: {
      numero: "asc",
    },
  });

  return {
    disponible: habitaciones.length > 0,
    totalDisponibles: habitaciones.length,
    habitacion: habitaciones[0] ?? null,
  };
}