import { prisma } from "../lib/prisma.js";
import { registrarAuditoria } from "../auditoria/service.js";
import { obtenerRangoHoyHonduras, crearFechaHonduras, ajustarEntradaWalkInMadrugada } from "../lib/fecha.js";
 
import { crearOActualizarCliente } from "../clientes/service.js";
 
import {
  consultarDisponibilidad,
  consultarDisponibilidadMultiple,
} from "../disponibilidad/service.js";
 
import { obtenerTarifaPorPersonas } from "../tarifas/service.js";
import { enviarNotificacionATodos } from "../notificaciones/service.js";
 
// Las reservas pendientes de pago ya no vencen (decisión del hotel) —
// se quitaron las constantes de tiempo de expiración que se usaban antes.
 
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

// La restricción "no_solape_habitacion" (EXCLUDE constraint a nivel de
// Postgres) es la última línea de defensa contra dobles reservas: aunque
// a alguna función se le olvide el chequeo manual, Postgres rechaza el
// INSERT/UPDATE igual. Este helper detecta ese rechazo específico para
// convertirlo en un mensaje entendible en vez de un error crudo de SQL.
function esErrorDeSolapeHabitacion(error) {
  return (
    typeof error?.message === "string" &&
    error.message.includes("no_solape_habitacion")
  );
}
 
function normalizarClaveIdempotencia(valor) {
  const clave = String(valor ?? "").trim();
  if (!clave) return null;
  if (clave.length > 200) throw new Error("La clave de la operación no es válida.");
  return clave;
}

async function obtenerReservaPorClaveIdempotencia(idempotencyKey, db = prisma) {
  if (!idempotencyKey) return null;
  return db.reserva.findUnique({
    where: { idempotencyKey },
    include: { habitacion: true, cliente: true, pago: true },
  });
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
  habitacionPreferida,
  idempotencyKey,
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
 
  if (cantidadPersonas > 4) {
    throw new Error(
      "Para más de 4 personas se deben crear varias habitaciones"
    );
  }
 
  const claveIdempotencia = normalizarClaveIdempotencia(idempotencyKey);
  const reservaExistente = await obtenerReservaPorClaveIdempotencia(claveIdempotencia);
  if (reservaExistente) return reservaExistente;

  const disponibilidad =
    await consultarDisponibilidad({
      fechaEntrada,
      fechaSalida,
      personas: cantidadPersonas,
      habitacionPreferida,
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
 
  // Ya no vencen las reservas pendientes de pago (decisión del hotel) —
  // se deja de calcular expiraEn, siempre queda en null.
  const expiraEn = null;

  try {
  const resultado = await ejecutarTransaccionSerializable(async (tx) => {
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
        idempotencyKey: claveIdempotencia,
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

  return resultado;
  } catch (error) {
    if (error?.code === "P2002" && claveIdempotencia) {
      const existente = await obtenerReservaPorClaveIdempotencia(claveIdempotencia);
      if (existente) return existente;
    }

    if (esErrorDeSolapeHabitacion(error)) {
      throw new Error(
        "La habitación dejó de estar disponible. Intenta nuevamente"
      );
    }

    throw error;
  }
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
  tipoEstadia,
  modo,
  yaPago,
  precioPorNoche: precioPorNocheIngresado,
  idempotencyKey,
}) {
  // "OCUPAR" (por defecto): el huésped ya está físicamente ahí, la
  // habitación queda ocupada de inmediato (CHECK_IN), y siempre se cobra
  // al momento.
  // "RESERVAR": se aparta la habitación para una fecha (puede ser hoy o
  // más adelante), sin ocuparla todavía. Puede venir:
  //   - yaPago=true: se cobró de una vez -> queda CONFIRMADA, nunca vence.
  //   - yaPago=false (por defecto): paga hasta que llegue -> queda
  //     PENDIENTE_PAGO con 24 horas para llegar (igual que las reservas
  //     de WhatsApp en efectivo), si no, se libera sola.
  const soloReservar = String(modo ?? "OCUPAR").toUpperCase() === "RESERVAR";
  const reservaYaPagada = !soloReservar || Boolean(yaPago);
  const claveIdempotencia = normalizarClaveIdempotencia(idempotencyKey);
  const reservaExistente = await obtenerReservaPorClaveIdempotencia(claveIdempotencia);
  if (reservaExistente) return reservaExistente;
 
  const metodo = String(metodoPago ?? "EFECTIVO").trim().toUpperCase();
 
  if (reservaYaPagada && !["EFECTIVO", "TRANSFERENCIA", "TARJETA"].includes(metodo)) {
    throw new Error('El método de pago debe ser "efectivo", "transferencia" o "tarjeta"');
  }
 
  const esPorHoras = String(tipoEstadia ?? "NOCHE").toUpperCase() === "3_HORAS";
 
  if (esPorHoras && soloReservar) {
    throw new Error('Una estadía de 3 horas no se puede "solo reservar" — siempre ocupa de inmediato.');
  }
 
  const DURACION_3_HORAS_MS = 3 * 60 * 60 * 1000;

  // El precio ya no sale de la tabla de tarifas ni de un valor fijo — lo
  // escribe quien está creando la reserva desde la app (walk-in), a mano.
  const precioPorNocheManual = Number(precioPorNocheIngresado);
  if (!Number.isFinite(precioPorNocheManual) || precioPorNocheManual <= 0) {
    throw new Error("El precio es obligatorio y debe ser mayor a 0");
  }
 
  let nombreLimpio, telefonoLimpio, documentoLimpio, cantidadPersonas, entrada, salida;
 
  if (esPorHoras) {
    // Estadía de 3 horas: entra AHORA mismo (no tiene sentido agendarla
    // para otro día), sale exactamente 3 horas después. No usa noches ni
    // la tarifa normal — es un precio fijo.
    nombreLimpio = String(nombre ?? "").trim();
    telefonoLimpio = String(telefono ?? "").trim();
    documentoLimpio = String(documento ?? "").trim();
    cantidadPersonas = Number(personas);
 
    if (!nombreLimpio) throw new Error("El nombre y apellido son obligatorios");
    if (!Number.isInteger(cantidadPersonas) || cantidadPersonas < 1) {
      throw new Error("La cantidad de personas no es válida");
    }
 
    entrada = new Date();
    salida = new Date(entrada.getTime() + DURACION_3_HORAS_MS);
  } else {
    // Si están registrando el walk-in de madrugada (antes de las 6 AM) para
    // "hoy", esa noche en realidad ya pertenece a ayer — se recorre la
    // fecha para que le toque salir hoy a la hora de checkout, no mañana.
    const fechasAjustadas = ajustarEntradaWalkInMadrugada(fechaEntrada, fechaSalida);
    fechaEntrada = fechasAjustadas.fechaEntrada;
    fechaSalida = fechasAjustadas.fechaSalida;
 
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
 
    ({ nombreLimpio, telefonoLimpio, documentoLimpio, cantidadPersonas, entrada, salida } = datos);
  }
 
  if (cantidadPersonas > 4) {
    throw new Error("Para más de 4 personas se necesitan varias habitaciones.");
  }
 
  let habitacion;
 
  if (habitacionId) {
    habitacion = await prisma.habitacion.findFirst({
      where: { id: habitacionId, activa: true, estado: "DISPONIBLE" },
    });
  } else {
    const disponibles = await listarHabitacionesDisponiblesWalkIn({
      fechaEntrada: entrada.toISOString().slice(0, 10),
      fechaSalida: salida.toISOString().slice(0, 10),
      personas: cantidadPersonas,
    });
    habitacion = disponibles[0];
  }
 
  const capacidadMinimaNecesaria = cantidadPersonas === 4 ? 3 : cantidadPersonas;
  if (!habitacion || habitacion.capacidad < capacidadMinimaNecesaria) {
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
 
  let cantidadNoches, precioPorNoche, precioTotal;
 
  if (esPorHoras) {
    cantidadNoches = 0;
    precioPorNoche = precioPorNocheManual;
    precioTotal = precioPorNocheManual;
  } else {
    cantidadNoches = calcularNoches(entrada, salida);
    precioPorNoche = precioPorNocheManual;
    precioTotal = precioPorNoche * cantidadNoches;
  }
 
  const cliente = telefonoLimpio
    ? await crearOActualizarCliente({ nombre: nombreLimpio, telefono: telefonoLimpio, documento: documentoLimpio })
    : await prisma.cliente.create({ data: { nombre: nombreLimpio, telefono: null, documento: documentoLimpio || null } });
 
  try {
  const resultado = await ejecutarTransaccionSerializable(async (tx) => {
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
        idempotencyKey: claveIdempotencia,
        clienteId: cliente.id,
        habitacionId: habitacion.id,
        fechaEntrada: entrada,
        fechaSalida: salida,
        cantidadPersonas,
        cantidadNoches,
        tipoEstadia: esPorHoras ? "3_HORAS" : "NOCHE",
        precioPorNoche,
        precioTotal,
        estado: !soloReservar ? "CHECK_IN" : (reservaYaPagada ? "CONFIRMADA" : "PENDIENTE_PAGO"),
        // Ya no vencen las reservas pendientes de pago (decisión del hotel).
        expiraEn: null,
        observaciones: esPorHoras
          ? `Walk-in 3 horas, pago en ${metodo.toLowerCase()}`
          : !soloReservar
          ? `Walk-in, pago en ${metodo.toLowerCase()}`
          : reservaYaPagada
          ? `Reserva creada desde la app, pagada en ${metodo.toLowerCase()}`
          : "Reserva creada desde la app, sin pagar todavía — paga al llegar",
      },
    });
 
    // Solo se registra el pago si ya está pagada (ocupar siempre cobra;
    // reservar solo si eligieron "ya pagó").
    let pago = null;
    if (reservaYaPagada) {
      pago = await tx.pago.create({
        data: {
          reservaId: reserva.id,
          monto: precioTotal,
          proveedor: metodo,
          estado: "APROBADO",
          fechaPago: new Date(),
        },
      });
    }
 
    return { ...reserva, cliente, habitacion, pago };
  }).then(async (resultado) => {
    await registrarAuditoria({
      accion: soloReservar ? "CREAR_RESERVA_DESDE_APP" : "OCUPAR_WALKIN",
      entidad: "Reserva",
      entidadId: resultado.id,
      detalle: `${resultado.codigo} · Hab. ${resultado.habitacion.numero} · ${resultado.cliente.nombre}`,
    });
 
    return resultado;
  });

  return resultado;
  } catch (error) {
    if (error?.code === "P2002" && claveIdempotencia) {
      const existente = await obtenerReservaPorClaveIdempotencia(claveIdempotencia);
      if (existente) return existente;
    }

    if (esErrorDeSolapeHabitacion(error)) {
      throw new Error("La habitación dejó de estar disponible.");
    }

    throw error;
  }
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
 
  // Ya no vencen las reservas pendientes de pago (decisión del hotel).
  const expiraEn = null;

  try {
  return await ejecutarTransaccionSerializable(async (tx) => {
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
  } catch (error) {
    if (esErrorDeSolapeHabitacion(error)) {
      throw new Error(
        "Una de las habitaciones dejó de estar disponible. Intenta nuevamente"
      );
    }

    throw error;
  }
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
  const { fin } = obtenerRangoHoyHonduras();
 
  const reservas = await prisma.reserva.findMany({
    where: {
      estado: { in: ["CONFIRMADA", "PENDIENTE_PAGO"] },
      // Entrada de hoy, o de días anteriores que nunca llegaron a hacer
      // check-in — así no desaparecen solas de la lista si nadie las
      // procesó a tiempo. No hay límite por fecha de salida: mientras
      // sigan en estos dos estados (es decir, todavía no hicieron
      // check-in), se siguen mostrando sin importar si su salida
      // original ya pasó.
      fechaEntrada: { lt: fin },
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

// Para "Editar habitación" en la app: cuando hay una reserva activa ahí,
// permite corregir el nombre del cliente, la cantidad de noches (o las
// horas, si es una reserva de "3 horas") y el precio, sin tener que
// cancelar y volver a crear la reserva.
export async function editarReserva(
  reservaId,
  { nombreCliente, cantidadNoches, horas, precioPorNoche: precioIngresado }
) {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
  });

  if (!reserva) {
    throw new Error("Reserva no encontrada.");
  }

  if (!["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"].includes(reserva.estado)) {
    throw new Error(`La reserva está en estado ${reserva.estado} y ya no se puede editar.`);
  }

  const nombreLimpio =
    nombreCliente !== undefined && nombreCliente !== null
      ? String(nombreCliente).trim()
      : null;
  if (nombreCliente !== undefined && !nombreLimpio) {
    throw new Error("El nombre del cliente es obligatorio.");
  }

  const hayPrecio =
    precioIngresado !== undefined && precioIngresado !== null && precioIngresado !== "";
  const precioNumero = hayPrecio ? Number(precioIngresado) : null;
  if (hayPrecio && (!Number.isFinite(precioNumero) || precioNumero <= 0)) {
    throw new Error("El precio no es válido.");
  }

  const esPorHoras = reserva.tipoEstadia === "3_HORAS";
  const datosReserva = {};

  if (esPorHoras) {
    const hayHoras = horas !== undefined && horas !== null && horas !== "";
    if (hayHoras) {
      const horasNumero = Number(horas);
      if (!Number.isFinite(horasNumero) || horasNumero <= 0) {
        throw new Error("Las horas no son válidas.");
      }
      datosReserva.fechaSalida = new Date(
        reserva.fechaEntrada.getTime() + horasNumero * 60 * 60 * 1000
      );
    }
    if (precioNumero !== null) {
      datosReserva.precioPorNoche = precioNumero;
      datosReserva.precioTotal = precioNumero;
    }
  } else {
    const hayNoches =
      cantidadNoches !== undefined && cantidadNoches !== null && cantidadNoches !== "";
    let nochesFinal = reserva.cantidadNoches;
    if (hayNoches) {
      nochesFinal = Number(cantidadNoches);
      if (!Number.isInteger(nochesFinal) || nochesFinal < 1) {
        throw new Error("La cantidad de noches no es válida.");
      }
      datosReserva.cantidadNoches = nochesFinal;
      datosReserva.fechaSalida = new Date(
        reserva.fechaEntrada.getTime() + nochesFinal * 24 * 60 * 60 * 1000
      );
    }
    if (precioNumero !== null) {
      datosReserva.precioPorNoche = precioNumero;
    }
    if (hayNoches || precioNumero !== null) {
      const precioBase =
        precioNumero !== null ? precioNumero : Number(reserva.precioPorNoche);
      datosReserva.precioTotal = precioBase * nochesFinal;
    }
  }

  if (!nombreLimpio && Object.keys(datosReserva).length === 0) {
    throw new Error("No hay cambios para guardar.");
  }

  try {
  const resultado = await prisma.$transaction(async (tx) => {
    if (nombreLimpio) {
      await tx.cliente.update({
        where: { id: reserva.clienteId },
        data: { nombre: nombreLimpio },
      });
    }
    if (datosReserva.fechaSalida) {
      const conflicto = await tx.reserva.findFirst({
        where: {
          id: { not: reservaId },
          habitacionId: reserva.habitacionId,
          estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
          fechaEntrada: { lt: datosReserva.fechaSalida },
          fechaSalida: { gt: reserva.fechaEntrada },
        },
        select: { id: true },
      });

      if (conflicto) {
        throw new Error(
          "No se puede extender: la habitación ya tiene otra reserva en esas fechas."
        );
      }
    }
    if (Object.keys(datosReserva).length > 0) {
      await tx.reserva.update({ where: { id: reservaId }, data: datosReserva });
    }
    return tx.reserva.findUnique({
      where: { id: reservaId },
      include: { cliente: true, habitacion: true },
    });
  }, { isolationLevel: "Serializable" });

  await registrarAuditoria({
    accion: "EDITAR_RESERVA",
    entidad: "Reserva",
    entidadId: reservaId,
    detalle: `${resultado.codigo} · Hab. ${resultado.habitacion.numero} · ${resultado.cliente.nombre}`,
  });

  return resultado;
  } catch (error) {
    if (esErrorDeSolapeHabitacion(error)) {
      throw new Error(
        "No se puede extender: la habitación ya tiene otra reserva en esas fechas."
      );
    }

    throw error;
  }
}

// Para el modal de "Llegó" en la app: además de la habitación que ya tenía
// reservada, muestra qué otras habitaciones de la misma capacidad están
// libres AHORA, por si se quiere reasignar al momento de la entrada.
export async function listarAlternativasParaCheckIn(habitacionId) {
  const { fin } = obtenerRangoHoyHonduras();
 
  const reserva = await prisma.reserva.findFirst({
    where: {
      habitacionId,
      estado: { in: ["CONFIRMADA", "PENDIENTE_PAGO"] },
      fechaEntrada: { lt: fin },
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
 
// FIX: antes esta función hacía "leer conflicto -> escribir" con llamadas
// sueltas a prisma (sin transacción). Eso deja una ventana real donde dos
// check-ins simultáneos que reasignan la MISMA habitación nueva pueden
// pasar los dos la validación de conflicto (porque ninguno ha escrito
// todavía) y terminar los dos ocupando la misma habitación → doble
// reserva. Ahora todo el flujo (buscar reserva, validar la habitación
// nueva, revisar conflicto, y actualizar) corre dentro de la misma
// transacción Serializable que ya se usa para crear reservas, así que si
// dos check-ins chocan, uno de los dos se reintenta o falla con un error
// claro en vez de pisar al otro.
export async function registrarCheckInPorHabitacion(
  habitacionId,
  metodoPago,
  nuevaHabitacionId
) {
  const { fin } = obtenerRangoHoyHonduras();
 
  try {
  const reservaActualizada = await ejecutarTransaccionSerializable(async (tx) => {
    const reserva = await tx.reserva.findFirst({
      where: {
        habitacionId,
        estado: { in: ["CONFIRMADA", "PENDIENTE_PAGO"] },
        fechaEntrada: { lt: fin },
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
      const nuevaHabitacion = await tx.habitacion.findFirst({
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
 
      const conflicto = await tx.reserva.findFirst({
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
 
    return tx.reserva.update({
      where: { id: reserva.id },
      data: {
        habitacionId: habitacionFinalId,
        estado: "CHECK_IN",
        expiraEn: null,
        ...(pendienteDePago
          ? {
              pago: {
                upsert: {
                  create: {
                    monto: reserva.precioTotal,
                    proveedor: metodo,
                    estado: "APROBADO",
                    fechaPago: new Date(),
                  },
                  update: {
                    estado: "APROBADO",
                    proveedor: metodo,
                    fechaPago: new Date(),
                  },
                },
              },
            }
          : {}),
      },
      include: { habitacion: true, cliente: true },
    });
  });
 
  await registrarAuditoria({
    accion: "CHECK_IN",
    entidad: "Reserva",
    entidadId: reservaActualizada.id,
    detalle: `${reservaActualizada.codigo} · Hab. ${reservaActualizada.habitacion.numero} · ${reservaActualizada.cliente.nombre}`,
  });
 
  return reservaActualizada;
  } catch (error) {
    if (esErrorDeSolapeHabitacion(error)) {
      throw new Error("Esa habitación ya no está disponible para estas fechas.");
    }

    throw error;
  }
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
 
// Mueve una reserva activa (pendiente, confirmada, o ya con check-in) a
// otra habitación — para corregir errores ("me equivoqué y la puse en la
// 1, muévela a la 2") sin tener que tocar la base de datos a mano.
//
// FIX: igual que en registrarCheckInPorHabitacion, antes el chequeo de
// conflicto y el update vivían como dos llamadas sueltas a prisma, sin
// transacción — dos "mover" concurrentes hacia la misma habitación nueva
// podían pasar ambos la validación y terminar duplicando la ocupación.
// Ahora todo corre dentro de ejecutarTransaccionSerializable.
export async function moverReservaDeHabitacion(reservaId, nuevaHabitacionId) {
  try {
  const { actualizada, habitacionAnteriorNumero } = await ejecutarTransaccionSerializable(async (tx) => {
    const reserva = await tx.reserva.findUnique({
      where: { id: reservaId },
      include: { habitacion: true, cliente: true },
    });
 
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }
 
    if (!["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"].includes(reserva.estado)) {
      throw new Error("Solo se pueden mover reservas activas (pendientes, confirmadas, o con check-in).");
    }
 
    if (reserva.habitacionId === nuevaHabitacionId) {
      throw new Error("Esa reserva ya está en esa habitación.");
    }
 
    const nuevaHabitacion = await tx.habitacion.findFirst({
      where: { id: nuevaHabitacionId, activa: true, estado: "DISPONIBLE" },
    });
 
    if (!nuevaHabitacion) {
      throw new Error("La habitación de destino no existe o está en mantenimiento.");
    }
 
    const capacidadNecesaria = reserva.cantidadPersonas === 4 ? 3 : reserva.cantidadPersonas;
    if (nuevaHabitacion.capacidad < capacidadNecesaria) {
      throw new Error(
        `La habitación ${nuevaHabitacion.numero} no tiene capacidad suficiente para ${reserva.cantidadPersonas} persona(s).`
      );
    }
 
    const conflicto = await tx.reserva.findFirst({
      where: {
        id: { not: reservaId },
        habitacionId: nuevaHabitacionId,
        estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
        fechaEntrada: { lt: reserva.fechaSalida },
        fechaSalida: { gt: reserva.fechaEntrada },
      },
    });
 
    if (conflicto) {
      throw new Error(`La habitación ${nuevaHabitacion.numero} ya está ocupada o reservada para esas fechas.`);
    }
 
    const actualizada = await tx.reserva.update({
      where: { id: reservaId },
      data: { habitacionId: nuevaHabitacionId },
      include: { habitacion: true, cliente: true },
    });
 
    return { actualizada, habitacionAnteriorNumero: reserva.habitacion.numero };
  });
 
  await registrarAuditoria({
    accion: "MOVER_HABITACION",
    entidad: "Reserva",
    entidadId: actualizada.id,
    detalle: `${actualizada.codigo} · Hab. ${habitacionAnteriorNumero} → Hab. ${actualizada.habitacion.numero} · ${actualizada.cliente.nombre}`,
  });
 
  return actualizada;
  } catch (error) {
    if (esErrorDeSolapeHabitacion(error)) {
      throw new Error("No se puede mover: la habitación ya tiene otra reserva en esas fechas.");
    }

    throw error;
  }
}
 
// Lista las reservas activas (para elegir cuál mover), con su
// habitación actual — igual que "Salida", sin importar la fecha.
export async function listarReservasActivasParaMover() {
  const reservas = await prisma.reserva.findMany({
    where: {
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
    },
    orderBy: { fechaEntrada: "asc" },
    include: { habitacion: true, cliente: true },
  });
 
  return reservas.map((reserva) => ({
    id: reserva.id,
    codigo: reserva.codigo,
    estado: reserva.estado,
    cliente: reserva.cliente.nombre,
    habitacionActual: reserva.habitacion.numero,
    cantidadPersonas: reserva.cantidadPersonas,
    fechaEntrada: reserva.fechaEntrada,
    fechaSalida: reserva.fechaSalida,
  }));
}
 
// Para el modal de "mover": habitaciones libres para las MISMAS fechas
// que ya tiene la reserva (sin contar la habitación actual).
export async function listarHabitacionesLibresParaMover(reservaId) {
  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
 
  if (!reserva) {
    throw new Error("Reserva no encontrada");
  }
 
  const habitaciones = await prisma.habitacion.findMany({
    where: {
      activa: true,
      estado: "DISPONIBLE",
      id: { not: reserva.habitacionId },
      reservas: {
        none: {
          id: { not: reservaId },
          estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "CHECK_IN"] },
          fechaEntrada: { lt: reserva.fechaSalida },
          fechaSalida: { gt: reserva.fechaEntrada },
        },
      },
    },
    orderBy: { numero: "asc" },
  });
 
  return habitaciones;
}