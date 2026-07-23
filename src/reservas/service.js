import { prisma } from "../lib/prisma.js";
import { registrarAuditoria } from "../auditoria/service.js";
import { obtenerRangoHoyHonduras, crearFechaHonduras } from "../lib/fecha.js";

import { crearOActualizarCliente } from "../clientes/service.js";

import {
  consultarDisponibilidad,
  consultarDisponibilidadMultiple,
} from "../disponibilidad/service.js";

import { obtenerTarifaPorPersonas } from "../tarifas/service.js";
import { enviarNotificacionATodos } from "../notificaciones/service.js";

const MINUTOS_EXPIRACION = 30;
const MINUTOS_EXPIRACION_EFECTIVO = 24 * 60;

async function ejecutarTransaccionSerializable(operacion, intentosMaximos = 3) {
  for (let intento = 1; intento <= intentosMaximos; intento++) {
    try {
      return await prisma.$transaction(operacion, {
        isolationLevel: "Serializable",
        maxWait: 10000,
        timeout: 20000,
      });
    } catch (error) {
      const conflictoConcurrente = error?.code === "P2034";

      if (!conflictoConcurrente || intento === intentosMaximos) {
        throw error;
      }
    }
  }

  throw new Error("No se pudo completar la reserva por concurrencia.");
}

function crearFecha(fecha) {
  return crearFechaHonduras(fecha);
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
  documento,
  metodoPago,
  telefonoObligatorio = true,
  documentoObligatorio = true,
  metodoPagoObligatorio = true,
}) {
  const nombreLimpio = String(nombre ?? "").trim();
  const telefonoLimpio = String(telefono ?? "").trim();
  const documentoLimpio = String(documento ?? "").trim();
  const metodoPagoLimpio = String(metodoPago ?? "").trim().toUpperCase();
  const cantidadPersonas = Number(personas);

  if (!nombreLimpio) {
    throw new Error(
      "El nombre y apellido son obligatorios"
    );
  }

  if (telefonoObligatorio && !telefonoLimpio) {
    throw new Error(
      "El teléfono es obligatorio"
    );
  }

  if (documentoObligatorio && !documentoLimpio) {
    throw new Error(
      "El número de identidad es obligatorio"
    );
  }

  if (metodoPagoObligatorio || metodoPagoLimpio) {
    if (!["EFECTIVO", "TRANSFERENCIA"].includes(metodoPagoLimpio)) {
      throw new Error(
        'El método de pago debe ser "efectivo" o "transferencia"'
      );
    }
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
    documentoLimpio,
    metodoPagoLimpio,
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
  documento,
  metodoPago,
  observaciones,
}) {
  const {
    nombreLimpio,
    telefonoLimpio,
    documentoLimpio,
    metodoPagoLimpio: metodo,
    cantidadPersonas,
    entrada,
    salida,
  } = validarDatosReserva({
    nombre,
    telefono,
    fechaEntrada,
    fechaSalida,
    personas,
    documento,
    metodoPago,
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
      documento: documentoLimpio,
    });

  const expiraEn = new Date(
    Date.now() +
      (metodo === "EFECTIVO" ? MINUTOS_EXPIRACION_EFECTIVO : MINUTOS_EXPIRACION) * 60 * 1000
  );

  return ejecutarTransaccionSerializable(async (tx) => {
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

        requiereAprobacion: disponibilidad.esHabitacionMasGrande,

        observaciones: observaciones
          ? String(observaciones).trim()
          : null,
      },
      include: {
        habitacion: true,
        cliente: true,
      },
    });

    const pago = await tx.pago.create({
      data: {
        reservaId: reserva.id,
        monto: precioTotal,
        proveedor: metodo,
        estado: metodo === "EFECTIVO" ? "PENDIENTE" : "NO_GENERADO",
      },
    });

    return {
      ...reserva,
      cliente,
      habitacion:
        disponibilidad.habitacion,
      pago,
    };
  }).then(async (resultado) => {
    if (resultado.requiereAprobacion) {
      await enviarNotificacionATodos({
        titulo: "🛏️ Necesita tu aprobación",
        cuerpo: `${resultado.cliente?.nombre ?? "Un cliente"} pidió para ${resultado.cantidadPersonas} y se le asignó la Hab. ${resultado.habitacion?.numero} (capacidad ${resultado.habitacion?.capacidad}) — no había del tamaño exacto.`,
        datos: { tipo: "aprobacion_habitacion" },
      });
    }

    return resultado;
  });
}

export async function crearReservaWalkIn({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
  habitacionId,
  documento,
  metodoPago,
}) {
  const metodo = String(metodoPago ?? "EFECTIVO").trim().toUpperCase();

  if (!["EFECTIVO", "TRANSFERENCIA", "TARJETA"].includes(metodo)) {
    throw new Error('El método de pago debe ser "efectivo", "transferencia" o "tarjeta"');
  }

  const datos = validarDatosReserva({
    nombre,
    telefono,
    fechaEntrada,
    fechaSalida,
    personas,
    documento,
    telefonoObligatorio: false,
    documentoObligatorio: false,
    metodoPagoObligatorio: false,
  });

  const { nombreLimpio, telefonoLimpio, documentoLimpio, cantidadPersonas, entrada, salida } = datos;
  if (cantidadPersonas > 3) {
    throw new Error("Para más de 3 personas se necesitan varias habitaciones.");
  }

  let habitacion;

  if (habitacionId) {
    habitacion = await prisma.habitacion.findFirst({
      where: { id: habitacionId, activa: true, estado: "DISPONIBLE" },
    });
  } else {
    const disponibles = await listarHabitacionesDisponiblesWalkIn({
      fechaEntrada,
      fechaSalida,
      personas: cantidadPersonas,
    });
    habitacion = disponibles[0];
  }

  if (!habitacion || habitacion.capacidad < cantidadPersonas) {
    throw new Error("La habitación seleccionada no está disponible.");
  }

  const conflicto = await prisma.reserva.findFirst({
    where: {
      habitacionId: habitacion.id,
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
      fechaEntrada: { lt: salida },
      fechaSalida: { gt: entrada },
    },
  });
  if (conflicto) throw new Error("La habitación dejó de estar disponible.");

  const tarifa = await obtenerTarifaPorPersonas(cantidadPersonas);
  const cantidadNoches = calcularNoches(entrada, salida);
  const precioPorNoche = Number(tarifa.precio);
  const precioTotal = precioPorNoche * cantidadNoches;

  const cliente = telefonoLimpio
    ? await crearOActualizarCliente({ nombre: nombreLimpio, telefono: telefonoLimpio, documento: documentoLimpio })
    : await prisma.cliente.create({ data: { nombre: nombreLimpio, telefono: null, documento: documentoLimpio || null } });

  return ejecutarTransaccionSerializable(async (tx) => {
    const conflictoDentroDeTransaccion = await tx.reserva.findFirst({
      where: {
        habitacionId: habitacion.id,
        estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
        fechaEntrada: { lt: salida },
        fechaSalida: { gt: entrada },
      },
      select: { id: true },
    });

    if (conflictoDentroDeTransaccion) {
      throw new Error("La habitación dejó de estar disponible.");
    }

    const codigo = await generarCodigoUnico(tx);
    const reserva = await tx.reserva.create({
      data: {
        codigo,
        clienteId: cliente.id,
        habitacionId: habitacion.id,
        fechaEntrada: entrada,
        fechaSalida: salida,
        cantidadPersonas,
        cantidadNoches,
        precioPorNoche,
        precioTotal,
        estado: "CHECK_IN",
        expiraEn: null,
        observaciones: `Walk-in, pago en ${metodo.toLowerCase()}`,
      },
    });
    const pago = await tx.pago.create({
      data: {
        reservaId: reserva.id,
        monto: precioTotal,
        proveedor: metodo,
        estado: "APROBADO",
        fechaPago: new Date(),
      },
    });
    return { ...reserva, cliente, habitacion, pago };
  }).then(async (resultado) => {
    await registrarAuditoria({
      accion: "OCUPAR_WALKIN",
      entidad: "Reserva",
      entidadId: resultado.id,
      detalle: `${resultado.codigo} · Hab. ${resultado.habitacion.numero} · ${resultado.cliente.nombre}`,
    });

    return resultado;
  });
}

export async function crearReservasMultiples({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
  documento,
  metodoPago,
}) {
  const {
    nombreLimpio,
    telefonoLimpio,
    documentoLimpio,
    metodoPagoLimpio: metodo,
    cantidadPersonas,
    entrada,
    salida,
  } = validarDatosReserva({
    nombre,
    telefono,
    fechaEntrada,
    fechaSalida,
    personas,
    documento,
    metodoPago,
  });

  if (cantidadPersonas < 2) {
    throw new Error(
      "Las reservas múltiples son para grupos de 2 personas o más"
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
      documento: documentoLimpio,
    });

  const expiraEn = new Date(
    Date.now() +
      (metodo === "EFECTIVO"
        ? MINUTOS_EXPIRACION_EFECTIVO
        : MINUTOS_EXPIRACION) *
        60 *
        1000
  );

  return ejecutarTransaccionSerializable(async (tx) => {
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
          proveedor: metodo,
          estado: metodo === "EFECTIVO" ? "PENDIENTE" : "NO_GENERADO",
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

export async function listarHabitacionesDisponiblesWalkIn({ fechaEntrada, fechaSalida, personas }) {
  const entrada = crearFecha(fechaEntrada);
  const salida = crearFecha(fechaSalida);
  const ocupadas = await prisma.reserva.findMany({
    where: {
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
      fechaEntrada: { lt: salida },
      fechaSalida: { gt: entrada },
    },
    select: { habitacionId: true },
  });
  const ocupadasIds = new Set(ocupadas.map((reserva) => reserva.habitacionId));
  const habitaciones = await prisma.habitacion.findMany({
    where: { activa: true, estado: "DISPONIBLE", capacidad: { gte: Number(personas) } },
    orderBy: [{ capacidad: "asc" }, { numero: "asc" }],
  });
  return habitaciones.filter((habitacion) => !ocupadasIds.has(habitacion.id));
}

export async function listarReservasParaCheckIn() {
  const { inicio, fin } = obtenerRangoHoyHonduras();

  const reservas = await prisma.reserva.findMany({
    where: {
      estado: { in: ["CONFIRMADA", "PENDIENTE_PAGO"] },
      fechaEntrada: { lt: fin },
      fechaSalida: { gt: inicio },
    },
    orderBy: { fechaEntrada: "asc" },
    include: { habitacion: true, cliente: true, pago: true },
  });

  return Array.from(
    new Map(reservas.map((reserva) => [reserva.habitacionId, reserva])).values()
  );
}

export async function listarReservasParaCheckout() {
  const reservas = await prisma.reserva.findMany({
    where: { estado: "CHECK_IN" },
    orderBy: { fechaEntrada: "asc" },
    include: { habitacion: true, cliente: true },
  });

  return Array.from(
    new Map(reservas.map((reserva) => [reserva.habitacionId, reserva])).values()
  );
}

export async function listarReservasParaCancelar() {
  return prisma.reserva.findMany({
    where: {
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA"] },
    },
    orderBy: { fechaEntrada: "asc" },
    include: {
      habitacion: true,
      cliente: true,
      pago: true,
    },
  });
}

export async function cancelarReservaPorId(reservaId) {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: {
      habitacion: true,
      cliente: true,
      pago: true,
    },
  });

  if (!reserva) {
    throw new Error("Reserva no encontrada.");
  }

  if (!["PENDIENTE_PAGO", "CONFIRMADA"].includes(reserva.estado)) {
    throw new Error(`La reserva está en estado ${reserva.estado} y no se puede cancelar desde este menú.`);
  }

  const reservaActualizada = await prisma.reserva.update({
    where: { id: reserva.id },
    data: {
      estado: "CANCELADA",
      expiraEn: null,
    },
    include: {
      habitacion: true,
      cliente: true,
      pago: true,
    },
  });

  await registrarAuditoria({
    accion: "CANCELAR_RESERVA",
    entidad: "Reserva",
    entidadId: reservaActualizada.id,
    detalle: `${reservaActualizada.codigo} · Hab. ${reservaActualizada.habitacion.numero} · ${reservaActualizada.cliente.nombre}`,
  });

  return reservaActualizada;
}

// Para el modal de "Llegó" en la app: además de la habitación que ya tenía
// reservada, muestra qué otras habitaciones de la misma capacidad están
// libres AHORA, por si se quiere reasignar al momento de la entrada.
export async function listarAlternativasParaCheckIn(habitacionId) {
  const { inicio, fin } = obtenerRangoHoyHonduras();

  const reserva = await prisma.reserva.findFirst({
    where: {
      habitacionId,
      estado: { in: ["CONFIRMADA", "PENDIENTE_PAGO"] },
      fechaEntrada: { lt: fin },
      fechaSalida: { gt: inicio },
    },
    orderBy: { fechaEntrada: "asc" },
  });

  if (!reserva) throw new Error("No hay reserva confirmada para esa habitación.");

  const habitaciones = await prisma.habitacion.findMany({
    where: {
      activa: true,
      estado: { not: "MANTENIMIENTO" },
      capacidad: { gte: reserva.cantidadPersonas },
    },
    orderBy: [{ capacidad: "asc" }, { numero: "asc" }],
  });

  const ocupadas = await prisma.reserva.findMany({
    where: {
      id: { not: reserva.id },
      habitacionId: { in: habitaciones.map((h) => h.id) },
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
      fechaEntrada: { lt: reserva.fechaSalida },
      fechaSalida: { gt: reserva.fechaEntrada },
    },
    select: { habitacionId: true },
  });
  const ocupadasIds = new Set(ocupadas.map((r) => r.habitacionId));

  return habitaciones
    .filter((h) => !ocupadasIds.has(h.id))
    .map((h) => ({
      id: h.id,
      numero: h.numero,
      capacidad: h.capacidad,
      esLaOriginal: h.id === habitacionId,
    }));
}

export async function registrarCheckInPorHabitacion(
  habitacionId,
  metodoPago,
  nuevaHabitacionId
) {
  const { inicio, fin } = obtenerRangoHoyHonduras();

  const reserva = await prisma.reserva.findFirst({
    where: {
      habitacionId,
      estado: { in: ["CONFIRMADA", "PENDIENTE_PAGO"] },
      fechaEntrada: { lt: fin },
      fechaSalida: { gt: inicio },
    },
    orderBy: { fechaEntrada: "asc" },
    include: { habitacion: true, cliente: true, pago: true },
  });
  if (!reserva) throw new Error("No hay reserva confirmada para esa habitación.");

  const pendienteDePago = reserva.estado === "PENDIENTE_PAGO";

  let metodo = null;
  if (pendienteDePago) {
    metodo = String(metodoPago ?? "").trim().toUpperCase();
    if (!["EFECTIVO", "TRANSFERENCIA", "TARJETA"].includes(metodo)) {
      throw new Error('Indica cómo pagó: "efectivo", "transferencia" o "tarjeta"');
    }
  }

  let habitacionFinalId = reserva.habitacionId;

  if (nuevaHabitacionId && nuevaHabitacionId !== reserva.habitacionId) {
    const nuevaHabitacion = await prisma.habitacion.findFirst({
      where: {
        id: nuevaHabitacionId,
        activa: true,
        estado: { not: "MANTENIMIENTO" },
        capacidad: { gte: reserva.cantidadPersonas },
      },
    });

    if (!nuevaHabitacion) {
      throw new Error("La habitación elegida no existe o no tiene capacidad suficiente.");
    }

    const conflicto = await prisma.reserva.findFirst({
      where: {
        id: { not: reserva.id },
        habitacionId: nuevaHabitacionId,
        estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
        fechaEntrada: { lt: reserva.fechaSalida },
        fechaSalida: { gt: reserva.fechaEntrada },
      },
    });

    if (conflicto) {
      throw new Error("Esa habitación ya no está disponible para estas fechas.");
    }

    habitacionFinalId = nuevaHabitacionId;
  }

  const reservaActualizada = await prisma.reserva.update({
    where: { id: reserva.id },
    data: {
      habitacionId: habitacionFinalId,
      estado: "CHECK_IN",
      expiraEn: null,
      ...(pendienteDePago
        ? {
            pago: {
              update: {
                estado: "APROBADO",
                proveedor: metodo,
                fechaPago: new Date(),
              },
            },
          }
        : {}),
    },
    include: { habitacion: true, cliente: true },
  });

  await registrarAuditoria({
    accion: "CHECK_IN",
    entidad: "Reserva",
    entidadId: reservaActualizada.id,
    detalle: `${reservaActualizada.codigo} · Hab. ${reservaActualizada.habitacion.numero} · ${reservaActualizada.cliente.nombre}`,
  });

  return reservaActualizada;
}

export async function registrarCheckoutPorHabitacion(habitacionId) {
  const reserva = await prisma.reserva.findFirst({
    where: { habitacionId, estado: "CHECK_IN" },
    orderBy: { fechaEntrada: "asc" },
    include: { habitacion: true, cliente: true },
  });
  if (!reserva) throw new Error("No hay habitación ocupada con ese registro.");

  const reservaActualizada = await prisma.reserva.update({
    where: { id: reserva.id },
    data: { estado: "CHECK_OUT" },
    include: { habitacion: true, cliente: true },
  });

  await registrarAuditoria({
    accion: "CHECKOUT",
    entidad: "Reserva",
    entidadId: reservaActualizada.id,
    detalle: `${reservaActualizada.codigo} · Hab. ${reservaActualizada.habitacion.numero} · ${reservaActualizada.cliente.nombre}`,
  });

  return reservaActualizada;
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

export async function liberarReservaPorCodigo(codigo) {
  const codigoLimpio = String(codigo ?? "")
    .trim()
    .toUpperCase();

  if (!codigoLimpio) {
    throw new Error("El código de reserva es obligatorio");
  }

  const reserva = await prisma.reserva.findUnique({
    where: {
      codigo: codigoLimpio,
    },
    include: {
      cliente: true,
      habitacion: true,
    },
  });

  if (!reserva) {
    throw new Error("Reserva no encontrada");
  }

  if (!["CONFIRMADA", "CHECK_IN"].includes(reserva.estado)) {
    throw new Error(
      `Esta reserva está en estado ${reserva.estado} y no se puede liberar`
    );
  }

  const reservaActualizada = await prisma.reserva.update({
    where: {
      id: reserva.id,
    },
    data: {
      estado: "CHECK_OUT",
    },
    include: {
      cliente: true,
      habitacion: true,
    },
  });

  await registrarAuditoria({
    accion: "LIBERAR_MANUAL",
    entidad: "Reserva",
    entidadId: reservaActualizada.id,
    detalle: `${reservaActualizada.codigo} · Hab. ${reservaActualizada.habitacion.numero} · ${reservaActualizada.cliente.nombre}`,
  });

  return reservaActualizada;
}

export async function listarHabitacionesParaMantenimiento() {
  return prisma.habitacion.findMany({
    where: {
      activa: true,
    },
    orderBy: {
      numero: "asc",
    },
  });
}

export async function alternarMantenimientoHabitacion(habitacionId) {
  const habitacion = await prisma.habitacion.findUnique({
    where: {
      id: habitacionId,
    },
  });

  if (!habitacion) {
    throw new Error("Habitación no encontrada");
  }

  if (habitacion.estado === "DISPONIBLE") {
    const ocupada = await prisma.reserva.findFirst({
      where: {
        habitacionId: habitacion.id,
        estado: {
          in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"],
        },
        fechaSalida: {
          gt: new Date(),
        },
      },
    });

    if (ocupada) {
      throw new Error(
        `La habitación ${habitacion.numero} tiene una reserva activa (${ocupada.codigo}) y no se puede poner en mantenimiento`
      );
    }
  }

  const nuevoEstado =
    habitacion.estado === "MANTENIMIENTO" ? "DISPONIBLE" : "MANTENIMIENTO";

  const habitacionActualizada = await prisma.habitacion.update({
    where: {
      id: habitacion.id,
    },
    data: {
      estado: nuevoEstado,
    },
  });

  await registrarAuditoria({
    accion:
      nuevoEstado === "MANTENIMIENTO"
        ? "HABILITAR_MANTENIMIENTO"
        : "DESHABILITAR_MANTENIMIENTO",
    entidad: "Habitacion",
    entidadId: habitacionActualizada.id,
    detalle: `Habitación ${habitacionActualizada.numero}`,
  });

  return habitacionActualizada;
}

export async function listarReservasQueRequierenAprobacion() {
  return prisma.reserva.findMany({
    where: {
      requiereAprobacion: true,
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA"] },
    },
    orderBy: { createdAt: "asc" },
    include: {
      habitacion: true,
      cliente: true,
      pago: true,
    },
  });
}

export async function aprobarHabitacionMasGrande(reservaId) {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: { habitacion: true, cliente: true },
  });

  if (!reserva) throw new Error("Reserva no encontrada.");
  if (!reserva.requiereAprobacion) {
    throw new Error("Esta reserva no tiene ninguna aprobación pendiente.");
  }

  const actualizada = await prisma.reserva.update({
    where: { id: reservaId },
    data: { requiereAprobacion: false },
    include: { habitacion: true, cliente: true },
  });

  await registrarAuditoria({
    accion: "APROBAR_HABITACION_MAS_GRANDE",
    entidad: "Reserva",
    entidadId: reserva.id,
    detalle: `${reserva.codigo} · Hab. ${reserva.habitacion.numero}`,
  });

  return actualizada;
}

export async function rechazarHabitacionMasGrande(reservaId) {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: { habitacion: true, cliente: true, pago: true },
  });

  if (!reserva) throw new Error("Reserva no encontrada.");
  if (!reserva.requiereAprobacion) {
    throw new Error("Esta reserva no tiene ninguna aprobación pendiente.");
  }

  const actualizada = await prisma.reserva.update({
    where: { id: reservaId },
    data: {
      estado: "CANCELADA",
      requiereAprobacion: false,
      expiraEn: null,
    },
    include: { habitacion: true, cliente: true },
  });

  await registrarAuditoria({
    accion: "RECHAZAR_HABITACION_MAS_GRANDE",
    entidad: "Reserva",
    entidadId: reserva.id,
    detalle: `${reserva.codigo} · Hab. ${reserva.habitacion.numero}`,
  });

  return actualizada;
}