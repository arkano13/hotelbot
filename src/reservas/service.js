import { prisma } from "../lib/prisma.js";

import { crearOActualizarCliente } from "../clientes/service.js";

import {
  consultarDisponibilidad,
  consultarDisponibilidadMultiple,
} from "../disponibilidad/service.js";

import { obtenerTarifaPorPersonas } from "../tarifas/service.js";

const MINUTOS_EXPIRACION = 30;

function crearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`);
}

function calcularNoches(fechaEntrada, fechaSalida) {
  const diferencia =
    fechaSalida.getTime() - fechaEntrada.getTime();

  return Math.round(
    diferencia / (1000 * 60 * 60 * 24)
  );
}

function generarCodigoReserva() {
  const anio = new Date().getFullYear();

  const numero = Math.floor(
    100000 + Math.random() * 900000
  );

  return `RES-${anio}-${numero}`;
}

async function generarCodigoUnico(tx = prisma) {
  let codigo;
  let existente;

  do {
    codigo = generarCodigoReserva();

    existente = await tx.reserva.findUnique({
      where: {
        codigo,
      },
      select: {
        id: true,
      },
    });
  } while (existente);

  return codigo;
}

function validarDatosReserva({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const nombreLimpio = String(nombre ?? "").trim();
  const telefonoLimpio = String(telefono ?? "").trim();
  const cantidadPersonas = Number(personas);

  if (!nombreLimpio) {
    throw new Error(
      "El nombre y apellido son obligatorios"
    );
  }

  if (!telefonoLimpio) {
    throw new Error(
      "El teléfono es obligatorio"
    );
  }

  if (!fechaEntrada || !fechaSalida) {
    throw new Error(
      "Las fechas de entrada y salida son obligatorias"
    );
  }

  if (
    !Number.isInteger(cantidadPersonas) ||
    cantidadPersonas < 1
  ) {
    throw new Error(
      "La cantidad de personas no es válida"
    );
  }

  const entrada = crearFecha(fechaEntrada);
  const salida = crearFecha(fechaSalida);

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

  return {
    nombreLimpio,
    telefonoLimpio,
    cantidadPersonas,
    entrada,
    salida,
  };
}

export async function crearReservaTemporal({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
  observaciones,
}) {
  const {
    nombreLimpio,
    telefonoLimpio,
    cantidadPersonas,
    entrada,
    salida,
  } = validarDatosReserva({
    nombre,
    telefono,
    fechaEntrada,
    fechaSalida,
    personas,
  });

  if (cantidadPersonas > 3) {
    throw new Error(
      "Para más de 3 personas se deben crear varias habitaciones"
    );
  }

  const disponibilidad =
    await consultarDisponibilidad({
      fechaEntrada,
      fechaSalida,
      personas: cantidadPersonas,
    });

  if (
    !disponibilidad.disponible ||
    !disponibilidad.habitacion
  ) {
    throw new Error(
      "No hay habitaciones disponibles para esas fechas"
    );
  }

  const tarifa =
    await obtenerTarifaPorPersonas(
      cantidadPersonas
    );

  const cantidadNoches = calcularNoches(
    entrada,
    salida
  );

  const precioPorNoche = Number(
    tarifa.precio
  );

  const precioTotal =
    precioPorNoche * cantidadNoches;

  const cliente =
    await crearOActualizarCliente({
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
    });

  const expiraEn = new Date(
    Date.now() +
      MINUTOS_EXPIRACION * 60 * 1000
  );

  return prisma.$transaction(async (tx) => {
    const conflicto = await tx.reserva.findFirst({
      where: {
        habitacionId:
          disponibilidad.habitacion.id,

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

      select: {
        id: true,
      },
    });

    if (conflicto) {
      throw new Error(
        "La habitación dejó de estar disponible. Intenta nuevamente"
      );
    }

    const codigo = await generarCodigoUnico(tx);

    const reserva = await tx.reserva.create({
      data: {
        codigo,
        clienteId: cliente.id,

        habitacionId:
          disponibilidad.habitacion.id,

        fechaEntrada: entrada,
        fechaSalida: salida,

        cantidadPersonas,
        cantidadNoches,

        precioPorNoche,
        precioTotal,

        estado: "PENDIENTE_PAGO",
        expiraEn,

        observaciones: observaciones
          ? String(observaciones).trim()
          : null,
      },
    });

    const pago = await tx.pago.create({
      data: {
        reservaId: reserva.id,
        monto: precioTotal,
        estado: "NO_GENERADO",
      },
    });

    return {
      ...reserva,
      cliente,
      habitacion:
        disponibilidad.habitacion,
      pago,
    };
  });
}

export async function crearReservaWalkIn({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const {
    nombreLimpio,
    telefonoLimpio,
    cantidadPersonas,
    entrada,
    salida,
  } = validarDatosReserva({
    nombre,
    telefono,
    fechaEntrada,
    fechaSalida,
    personas,
  });

  if (cantidadPersonas > 3) {
    throw new Error(
      "Para más de 3 personas se necesitan varias habitaciones. Usa /ocupar una vez por cada habitación."
    );
  }

  const disponibilidad =
    await consultarDisponibilidad({
      fechaEntrada,
      fechaSalida,
      personas: cantidadPersonas,
    });

  if (
    !disponibilidad.disponible ||
    !disponibilidad.habitacion
  ) {
    throw new Error(
      "No hay habitaciones disponibles para esas fechas"
    );
  }

  const tarifa =
    await obtenerTarifaPorPersonas(
      cantidadPersonas
    );

  const cantidadNoches = calcularNoches(
    entrada,
    salida
  );

  const precioPorNoche = Number(
    tarifa.precio
  );

  const precioTotal =
    precioPorNoche * cantidadNoches;

  const cliente =
    await crearOActualizarCliente({
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
    });

  return prisma.$transaction(async (tx) => {
    const conflicto = await tx.reserva.findFirst({
      where: {
        habitacionId:
          disponibilidad.habitacion.id,

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

      select: {
        id: true,
      },
    });

    if (conflicto) {
      throw new Error(
        "La habitación dejó de estar disponible. Intenta nuevamente"
      );
    }

    const codigo = await generarCodigoUnico(tx);

    const reserva = await tx.reserva.create({
      data: {
        codigo,
        clienteId: cliente.id,

        habitacionId:
          disponibilidad.habitacion.id,

        fechaEntrada: entrada,
        fechaSalida: salida,

        cantidadPersonas,
        cantidadNoches,

        precioPorNoche,
        precioTotal,

        estado: "CONFIRMADA",
        expiraEn: null,

        observaciones: "Walk-in, pago en efectivo",
      },
    });

    const pago = await tx.pago.create({
      data: {
        reservaId: reserva.id,
        monto: precioTotal,
        proveedor: "EFECTIVO",
        estado: "APROBADO",
        fechaPago: new Date(),
      },
    });

    return {
      ...reserva,
      cliente,
      habitacion:
        disponibilidad.habitacion,
      pago,
    };
  });
}

export async function crearReservasMultiples({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
}) {
  const {
    nombreLimpio,
    telefonoLimpio,
    cantidadPersonas,
    entrada,
    salida,
  } = validarDatosReserva({
    nombre,
    telefono,
    fechaEntrada,
    fechaSalida,
    personas,
  });

  if (cantidadPersonas < 4) {
    throw new Error(
      "Las reservas múltiples son para grupos de 4 personas o más"
    );
  }

  const disponibilidad =
    await consultarDisponibilidadMultiple({
      fechaEntrada,
      fechaSalida,
      personas: cantidadPersonas,
    });

  if (
    !disponibilidad.disponible ||
    disponibilidad.habitaciones.length === 0
  ) {
    throw new Error(
      "No hay suficientes habitaciones disponibles para esas fechas"
    );
  }

  const cantidadNoches = calcularNoches(
    entrada,
    salida
  );

  const cliente =
    await crearOActualizarCliente({
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
    });

  const expiraEn = new Date(
    Date.now() +
      MINUTOS_EXPIRACION * 60 * 1000
  );

  return prisma.$transaction(async (tx) => {
    const reservas = [];

    for (
      let indice = 0;
      indice <
      disponibilidad.habitaciones.length;
      indice++
    ) {
      const habitacion =
        disponibilidad.habitaciones[indice];

      const personasAsignadas =
        disponibilidad.distribucion[indice];

      const conflicto =
        await tx.reserva.findFirst({
          where: {
            habitacionId: habitacion.id,

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

          select: {
            id: true,
          },
        });

      if (conflicto) {
        throw new Error(
          "Una de las habitaciones dejó de estar disponible. Intenta nuevamente"
        );
      }

      const tarifa =
        await obtenerTarifaPorPersonas(
          personasAsignadas
        );

      const precioPorNoche = Number(
        tarifa.precio
      );

      const precioTotal =
        precioPorNoche * cantidadNoches;

      const codigo =
        await generarCodigoUnico(tx);

      const reserva =
        await tx.reserva.create({
          data: {
            codigo,
            clienteId: cliente.id,
            habitacionId: habitacion.id,

            fechaEntrada: entrada,
            fechaSalida: salida,

            cantidadPersonas:
              personasAsignadas,

            cantidadNoches,
            precioPorNoche,
            precioTotal,

            estado: "PENDIENTE_PAGO",
            expiraEn,
          },
        });

      const pago = await tx.pago.create({
        data: {
          reservaId: reserva.id,
          monto: precioTotal,
          estado: "NO_GENERADO",
        },
      });

      reservas.push({
        ...reserva,
        habitacion,
        pago,
      });
    }

    return reservas;
  });
}

export async function obtenerReservaMasRecientePorTelefono(
  telefono
) {
  const telefonoLimpio = String(telefono ?? "")
    .replace(/\D/g, "")
    .trim();

  if (!telefonoLimpio) {
    throw new Error("El teléfono es obligatorio");
  }

  return prisma.reserva.findFirst({
    where: {
      cliente: {
        telefono: telefonoLimpio,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      cliente: true,
      habitacion: true,
      pago: true,
    },
  });
}

export async function obtenerReservaPorCodigo(
  codigo
) {
  const codigoLimpio = String(
    codigo ?? ""
  )
    .trim()
    .toUpperCase();

  if (!codigoLimpio) {
    throw new Error(
      "El código de reserva es obligatorio"
    );
  }

  const reserva =
    await prisma.reserva.findUnique({
      where: {
        codigo: codigoLimpio,
      },

      include: {
        cliente: true,
        habitacion: true,
        pago: true,
      },
    });

  if (!reserva) {
    throw new Error(
      "Reserva no encontrada"
    );
  }

  return reserva;
}