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
    orderBy: [
      {
        capacidad: "asc",
      },
      {
        numero: "asc",
      },
    ],
  });

  const habitacion = habitaciones[0] ?? null;

  return {
    disponible: habitaciones.length > 0,
    totalDisponibles: habitaciones.length,
    habitacion,
    esHabitacionMasGrande: habitacion ? habitacion.capacidad > cantidad : false,
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

  if (!Number.isInteger(cantidadPersonas) || cantidadPersonas < 2) {
    throw new Error("Esta consulta es para grupos de 2 personas o más");
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

  // Calcula los "bloques" ideales en los que se va a repartir al grupo,
  // evitando dejar un sobrante de 1 sola persona (eso desperdiciaría una
  // habitación de 3 en alguien que cabría perfecto en una de 1 o 2).
  // Ejemplo: 4 personas -> [2, 2] en vez de [3, 1].
  //          7 personas -> [3, 2, 2] en vez de [3, 3, 1].
  function calcularBloquesIdeales(total) {
    const bloques = [];
    let restante = total;

    while (restante > 3) {
      bloques.push(3);
      restante -= 3;
    }

    if (restante === 1 && bloques.length > 0) {
      bloques.pop();
      bloques.push(2, 2);
    } else if (restante > 0) {
      bloques.push(restante);
    }

    return bloques;
  }

  const disponiblesOrdenadas = [...habitacionesDisponibles].sort(
    (a, b) => a.capacidad - b.capacidad || Number(a.numero) - Number(b.numero)
  );

  function intentarConBloquesIdeales() {
    const bloques = calcularBloquesIdeales(cantidadPersonas)
      // Se procesan los bloques más grandes primero, para que reserven su
      // habitación de capacidad exacta antes que un bloque chico termine
      // "robándosela" por no encontrar nada más pequeño libre.
      .sort((a, b) => b - a);

    const usadasIds = new Set();
    const seleccionadas = [];

    for (const capacidadNecesaria of bloques) {
      // Primero busca una habitación de capacidad EXACTA; si no hay, la más
      // pequeña que alcance (nunca al revés, para no desperdiciar).
      const habitacion =
        disponiblesOrdenadas.find(
          (h) => !usadasIds.has(h.id) && h.capacidad === capacidadNecesaria
        ) ??
        disponiblesOrdenadas.find(
          (h) => !usadasIds.has(h.id) && h.capacidad > capacidadNecesaria
        );

      if (!habitacion) return null;

      usadasIds.add(habitacion.id);

      seleccionadas.push({
        id: habitacion.id,
        numero: habitacion.numero,
        capacidadAsignada: capacidadNecesaria,
        capacidadMaxima: habitacion.capacidad,
      });
    }

    return seleccionadas;
  }

  // Plan B: para grupos grandes que agotan el inventario de habitaciones
  // grandes (ej. piden 9 personas pero solo hay 2 de capacidad 3), el
  // reparto "ideal" de arriba puede no encontrar suficientes habitaciones
  // exactas. En ese caso, se cae a un empaquetado más flexible que sí
  // siempre encuentra una combinación válida si la capacidad total alcanza
  // — aunque no reparta tan parejo, es mejor que decir "no hay
  // disponibilidad" cuando en realidad sí caben.
  function intentarConEmpaquetadoFlexible() {
    const ordenadasPorCapacidadDesc = [...habitacionesDisponibles].sort(
      (a, b) => b.capacidad - a.capacidad
    );

    const seleccionadas = [];
    let restantes = cantidadPersonas;

    for (const habitacion of ordenadasPorCapacidadDesc) {
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

    return restantes > 0 ? null : seleccionadas;
  }

  const seleccionadas =
    intentarConBloquesIdeales() ?? intentarConEmpaquetadoFlexible();

  if (!seleccionadas) {
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