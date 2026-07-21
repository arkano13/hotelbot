import { prisma } from "../lib/prisma.js";

export async function consultarDisponibilidad({
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const entrada = new Date(`${fechaEntrada}T00:00:00`);
  const salida = new Date(`${fechaSalida}T00:00:00`);

  const cantidad = Number(personas);

  const hoy = new Date();

  const hoyLocal = new Date(
    hoy.toLocaleString("en-US", {
      timeZone: "America/Tegucigalpa",
    }),
  );

  hoyLocal.setHours(0, 0, 0, 0);

  if (entrada < hoyLocal) {
    throw new Error("La fecha de entrada no puede estar en el pasado");
  }
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

export async function consultarDisponibilidadMultiple({
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const entrada = new Date(`${fechaEntrada}T00:00:00`);
  const salida = new Date(`${fechaSalida}T00:00:00`);
  const cantidadPersonas = Number(personas);

  if (
    Number.isNaN(entrada.getTime()) ||
    Number.isNaN(salida.getTime())
  ) {
    throw new Error("Las fechas no son válidas");
  }

  if (salida <= entrada) {
    throw new Error(
      "La fecha de salida debe ser posterior a la entrada"
    );
  }

  if (!Number.isInteger(cantidadPersonas) || cantidadPersonas < 4) {
    throw new Error("Esta consulta es para grupos de 4 personas o más");
  }

  const habitacionesDisponibles =
    await prisma.habitacion.findMany({
      where: {
        activa: true,
        estado: "DISPONIBLE",
        reservas: {
          none: {
            estado: {
              in: [
                "PENDIENTE_PAGO",
                "CONFIRMADA",
                "CHECK_IN",
              ],
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

  // Empaquetado dinámico: se llenan las habitaciones realmente libres ese
  // rango de fechas, de mayor a menor capacidad, con hasta 3 personas por
  // habitación (límite de las tarifas). Así, si un día no hay habitación
  // de capacidad 3 libre pero sí hay de 2 y de 1, el sistema las combina
  // (ej. 2+1) en vez de fallar por no encontrar una habitación "exacta".
  const ordenadasPorCapacidad = [...habitacionesDisponibles].sort(
    (a, b) => b.capacidad - a.capacidad
  );

  const seleccionadas = [];
  let restantes = cantidadPersonas;

  for (const habitacion of ordenadasPorCapacidad) {
    if (restantes <= 0) break;

    const capacidadAsignada = Math.min(habitacion.capacidad, restantes, 3);

    if (capacidadAsignada < 1) continue;

    seleccionadas.push({
      id: habitacion.id,
      numero: habitacion.numero,
      capacidadAsignada,
      capacidadMaxima: habitacion.capacidad,
    });

    restantes -= capacidadAsignada;
  }

  if (restantes > 0) {
    return {
      disponible: false,
      personas: cantidadPersonas,
      distribucion: [],
      totalHabitaciones: 0,
      habitaciones: [],
    };
  }

  return {
    disponible: true,
    personas: cantidadPersonas,
    distribucion: seleccionadas.map((h) => h.capacidadAsignada),
    totalHabitaciones: seleccionadas.length,
    habitaciones: seleccionadas,
  };
}