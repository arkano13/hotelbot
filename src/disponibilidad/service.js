import { prisma } from "../lib/prisma.js";
import { crearFechaHonduras } from "../lib/fecha.js";

export async function consultarDisponibilidad({
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const entrada = crearFechaHonduras(fechaEntrada);
  const salida = crearFechaHonduras(fechaSalida);

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

  if (![1, 2, 3, 4].includes(cantidad)) {
    throw new Error("La cantidad de personas debe ser 1, 2, 3 o 4");
  }

  // Las habitaciones de capacidad 3 tienen 3 camas (2 sencillas + 1
  // doble) y caben hasta 4 personas sin problema — para la búsqueda, 4
  // personas cuenta como si necesitara capacidad 3, no una habitación
  // "más grande" de verdad.
  const capacidadNecesaria = cantidad === 4 ? 3 : cantidad;

  const habitaciones = await prisma.habitacion.findMany({
    where: {
      activa: true,
      estado: "DISPONIBLE",
      capacidad: {
        gte: capacidadNecesaria,
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
    esHabitacionMasGrande: habitacion ? habitacion.capacidad > capacidadNecesaria : false,
  };
}

export async function consultarDisponibilidadMultiple({
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const entrada = crearFechaHonduras(fechaEntrada);
  const salida = crearFechaHonduras(fechaSalida);
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

  // Calcula los "bloques" ideales en los que se va a repartir al grupo.
  // Las habitaciones de capacidad 3 en realidad tienen 3 camas (2
  // sencillas + 1 doble) y caben hasta 4 personas sin costo extra — por
  // eso el bloque más grande que se intenta es 4, no 3. Esto reduce
  // cuántas habitaciones hacen falta para grupos grandes.
  // Ejemplo: 4 personas -> [4] (una sola habitación, no dos de 2).
  //          7 personas -> [4, 3] (dos habitaciones, no tres).
  function calcularBloquesIdeales(total) {
    const bloques = [];
    let restante = total;

    while (restante > 4) {
      bloques.push(4);
      restante -= 4;
    }

    if (restante > 0) {
      bloques.push(restante);
    }

    return bloques;
  }

  // Una habitación de capacidad 3 sirve tanto para un bloque de 3 como
  // para uno de 4 (por las 3 camas). Para cualquier otro tamaño de
  // bloque, la capacidad exacta de la habitación debe coincidir tal cual.
  function capacidadDeHabitacionParaBloque(capacidadBloque) {
    return capacidadBloque === 4 ? 3 : capacidadBloque;
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
      const capacidadHabitacionBuscada =
        capacidadDeHabitacionParaBloque(capacidadNecesaria);

      // Primero busca una habitación de capacidad EXACTA; si no hay, la más
      // pequeña que alcance (nunca al revés, para no desperdiciar).
      const habitacion =
        disponiblesOrdenadas.find(
          (h) => !usadasIds.has(h.id) && h.capacidad === capacidadHabitacionBuscada
        ) ??
        disponiblesOrdenadas.find(
          (h) => !usadasIds.has(h.id) && h.capacidad > capacidadHabitacionBuscada
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
  // grandes, el reparto "ideal" de arriba puede no encontrar suficientes
  // habitaciones exactas. En ese caso, se cae a un empaquetado más
  // flexible que sí siempre encuentra una combinación válida si la
  // capacidad total alcanza — aunque no reparta tan parejo, es mejor que
  // decir "no hay disponibilidad" cuando en realidad sí caben.
  function intentarConEmpaquetadoFlexible() {
    const ordenadasPorCapacidadDesc = [...habitacionesDisponibles].sort(
      (a, b) => b.capacidad - a.capacidad
    );

    const seleccionadas = [];
    let restantes = cantidadPersonas;

    for (const habitacion of ordenadasPorCapacidadDesc) {
      if (restantes <= 0) break;

      // Una habitación de capacidad 3 aguanta hasta 4 (3 camas: 2
      // sencillas + 1 doble); las demás, su capacidad tal cual.
      const limiteHabitacion = habitacion.capacidad === 3 ? 4 : habitacion.capacidad;
      const capacidadAsignada = Math.min(limiteHabitacion, restantes);

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