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

function calcularDistribucion(personas) {
  const cantidad = Number(personas);

  if (!Number.isInteger(cantidad) || cantidad < 4) {
    throw new Error("Esta consulta es para grupos de 4 personas o más");
  }

  const distribucion = [];
  let restantes = cantidad;

  while (restantes > 0) {
    if (restantes >= 3) {
      distribucion.push(3);
      restantes -= 3;
    } else {
      distribucion.push(restantes);
      restantes = 0;
    }
  }

  return distribucion;
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

  const distribucion = calcularDistribucion(
    cantidadPersonas
  );

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

  const seleccionadas = [];
  const usadas = new Set();

  for (const capacidadNecesaria of distribucion) {
    const habitacion = habitacionesDisponibles.find(
      (item) =>
        !usadas.has(item.id) &&
        item.capacidad >= capacidadNecesaria
    );

    if (!habitacion) {
      return {
        disponible: false,
        personas: cantidadPersonas,
        distribucion,
        totalHabitaciones: distribucion.length,
        habitaciones: [],
      };
    }

    usadas.add(habitacion.id);

    seleccionadas.push({
      id: habitacion.id,
      numero: habitacion.numero,
      capacidadAsignada: capacidadNecesaria,
      capacidadMaxima: habitacion.capacidad,
    });
  }

  return {
    disponible: true,
    personas: cantidadPersonas,
    distribucion,
    totalHabitaciones: seleccionadas.length,
    habitaciones: seleccionadas,
  };
}
