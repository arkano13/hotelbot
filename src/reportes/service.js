import { prisma } from "../lib/prisma.js";

const ZONA_HORARIA = "America/Tegucigalpa";
const MILISEGUNDOS_DIA = 24 * 60 * 60 * 1000;

const FILTRO_PAGO_COBRADO = {
  estado: "APROBADO",
  OR: [
    { proveedor: "EFECTIVO" },
    { comprobanteUrl: { not: null } },
  ],
};

function validarFechaISO(fechaISO) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fechaISO ?? ""))) {
    throw new Error("La fecha debe tener formato YYYY-MM-DD");
  }
}

function rangoDelDiaHonduras(fechaISO) {
  validarFechaISO(fechaISO);

  // Honduras usa UTC-6 durante todo el año.
  const inicio = new Date(`${fechaISO}T06:00:00.000Z`);
  const fin = new Date(inicio.getTime() + MILISEGUNDOS_DIA);

  return { inicio, fin };
}

function rangoDelMesHonduras(anio, mes) {
  if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new Error("El año o mes del reporte no es válido");
  }

  const inicio = new Date(Date.UTC(anio, mes - 1, 1, 6));
  const fin = new Date(Date.UTC(anio, mes, 1, 6));

  return { inicio, fin };
}

function fechaISOHonduras(fecha) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(fecha));
}

function metodoDePago(pago) {
  return pago.proveedor === "EFECTIVO" ? "EFECTIVO" : "TRANSFERENCIA";
}

function convertirPago(pago) {
  return {
    id: pago.id,
    codigoPago:
      pago.codigo ?? (pago.proveedor === "EFECTIVO" ? "EFECTIVO" : "SIN-CODIGO"),
    codigoReserva: pago.reserva.codigo,
    fechaPago: pago.fechaPago,
    metodo: metodoDePago(pago),
    monto: Number(pago.monto),
    moneda: pago.moneda,
    comprobanteUrl: pago.comprobanteUrl,
    cliente: pago.reserva.cliente.nombre,
    telefono: pago.reserva.cliente.telefono,
    habitacion: pago.reserva.habitacion.numero,
    personas: pago.reserva.cantidadPersonas,
    noches: pago.reserva.cantidadNoches,
    fechaEntrada: pago.reserva.fechaEntrada,
    fechaSalida: pago.reserva.fechaSalida,
    estadoReserva: pago.reserva.estado,
    canceladaSinReembolso: pago.reserva.estado === "CANCELADA",
  };
}

function resumirPagos(pagos) {
  const detalles = pagos.map(convertirPago);
  const transferencias = detalles.filter(
    (pago) => pago.metodo === "TRANSFERENCIA",
  );
  const efectivos = detalles.filter((pago) => pago.metodo === "EFECTIVO");

  const sumarMonto = (lista) =>
    lista.reduce((total, pago) => total + pago.monto, 0);

  const ingresosTransferencia = sumarMonto(transferencias);
  const ingresosEfectivo = sumarMonto(efectivos);
  const ingresosTotal = ingresosTransferencia + ingresosEfectivo;

  return {
    pagos: detalles,
    transferencias,
    efectivos,
    cantidadPagos: detalles.length,
    cantidadTransferencias: transferencias.length,
    cantidadEfectivos: efectivos.length,
    ingresosTotal,
    ingresosTransferencia,
    ingresosEfectivo,
    ticketPromedio: detalles.length ? ingresosTotal / detalles.length : 0,
    huespedes: detalles.reduce((total, pago) => total + pago.personas, 0),
    nochesVendidas: detalles.reduce((total, pago) => total + pago.noches, 0),
    habitacionesVendidas: new Set(detalles.map((pago) => pago.habitacion)).size,
    cancelacionesSinReembolso: detalles.filter(
      (pago) => pago.canceladaSinReembolso,
    ),
  };
}

async function consultarPagosCobrados(inicio, fin) {
  return prisma.pago.findMany({
    where: {
      ...FILTRO_PAGO_COBRADO,
      fechaPago: { gte: inicio, lt: fin },
    },
    include: {
      reserva: {
        include: {
          cliente: true,
          habitacion: true,
        },
      },
    },
    orderBy: { fechaPago: "asc" },
  });
}

export async function obtenerResumenDiario(fechaISO) {
  const { inicio, fin } = rangoDelDiaHonduras(fechaISO);
  const pagos = await consultarPagosCobrados(inicio, fin);

  return {
    tipo: "DIARIO",
    fecha: fechaISO,
    ...resumirPagos(pagos),
  };
}

function agruparPorDia(pagos) {
  const grupos = new Map();

  for (const pago of pagos) {
    const fecha = fechaISOHonduras(pago.fechaPago);
    const actual = grupos.get(fecha) ?? {
      fecha,
      cantidadPagos: 0,
      transferencias: 0,
      efectivos: 0,
      huespedes: 0,
      total: 0,
    };

    actual.cantidadPagos += 1;
    actual.huespedes += pago.personas;
    actual.total += pago.monto;

    if (pago.metodo === "EFECTIVO") {
      actual.efectivos += pago.monto;
    } else {
      actual.transferencias += pago.monto;
    }

    grupos.set(fecha, actual);
  }

  return [...grupos.values()].sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function agruparPorHabitacion(pagos) {
  const grupos = new Map();

  for (const pago of pagos) {
    const actual = grupos.get(pago.habitacion) ?? {
      habitacion: pago.habitacion,
      pagos: 0,
      huespedes: 0,
      nochesVendidas: 0,
      ingresos: 0,
    };

    actual.pagos += 1;
    actual.huespedes += pago.personas;
    actual.nochesVendidas += pago.noches;
    actual.ingresos += pago.monto;
    grupos.set(pago.habitacion, actual);
  }

  return [...grupos.values()].sort(
    (a, b) => b.ingresos - a.ingresos || String(a.habitacion).localeCompare(String(b.habitacion)),
  );
}

function calcularNochesOcupadas(reserva, inicioMes, finMes) {
  const entrada = Math.max(reserva.fechaEntrada.getTime(), inicioMes.getTime());
  const salida = Math.min(reserva.fechaSalida.getTime(), finMes.getTime());

  if (salida <= entrada) {
    return 0;
  }

  return Math.round((salida - entrada) / MILISEGUNDOS_DIA);
}

export async function obtenerResumenMensual(anio, mes) {
  const rangoPagos = rangoDelMesHonduras(anio, mes);
  const inicioEstadia = new Date(Date.UTC(anio, mes - 1, 1));
  const finEstadia = new Date(Date.UTC(anio, mes, 1));

  const [pagosDb, reservasOcupadas, habitacionesActivas] = await Promise.all([
    consultarPagosCobrados(rangoPagos.inicio, rangoPagos.fin),
    prisma.reserva.findMany({
      where: {
        estado: { in: ["CONFIRMADA", "CHECK_IN", "CHECK_OUT"] },
        fechaEntrada: { lt: finEstadia },
        fechaSalida: { gt: inicioEstadia },
        pago: { is: FILTRO_PAGO_COBRADO },
      },
      select: {
        fechaEntrada: true,
        fechaSalida: true,
      },
    }),
    prisma.habitacion.count({ where: { activa: true } }),
  ]);

  const resumen = resumirPagos(pagosDb);
  const pagosPorDia = agruparPorDia(resumen.pagos);
  const rendimientoHabitaciones = agruparPorHabitacion(resumen.pagos);
  const nochesOcupadas = reservasOcupadas.reduce(
    (total, reserva) =>
      total + calcularNochesOcupadas(reserva, inicioEstadia, finEstadia),
    0,
  );
  const diasDelMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const nochesDisponibles = habitacionesActivas * diasDelMes;
  const ocupacionPorcentaje = nochesDisponibles
    ? (nochesOcupadas / nochesDisponibles) * 100
    : 0;
  const mejorDia = pagosPorDia.reduce(
    (mejor, dia) => (!mejor || dia.total > mejor.total ? dia : mejor),
    null,
  );

  return {
    tipo: "MENSUAL",
    anio,
    mes,
    ...resumen,
    pagosPorDia,
    rendimientoHabitaciones,
    nochesOcupadas,
    nochesDisponibles,
    ocupacionPorcentaje,
    mejorDia,
  };
}
