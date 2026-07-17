import { prisma } from "../lib/prisma.js";

function rangoDelDia(fechaISO) {
  const inicio = new Date(`${fechaISO}T00:00:00Z`);
  const fin = new Date(inicio);
  fin.setUTCDate(fin.getUTCDate() + 1);

  return { inicio, fin };
}

export async function obtenerResumenDiario(fechaISO) {
  const { inicio, fin } = rangoDelDia(fechaISO);

  const [llegan, salen, pagosPendientes] = await Promise.all([
    prisma.reserva.findMany({
      where: {
        fechaEntrada: { gte: inicio, lt: fin },
        estado: { notIn: ["CANCELADA", "EXPIRADA"] },
      },
      include: { cliente: true, habitacion: true },
      orderBy: { habitacion: { numero: "asc" } },
    }),

    prisma.reserva.findMany({
      where: {
        fechaSalida: { gte: inicio, lt: fin },
        estado: { notIn: ["CANCELADA", "EXPIRADA"] },
      },
      include: { cliente: true, habitacion: true },
      orderBy: { habitacion: { numero: "asc" } },
    }),

    prisma.pago.findMany({
      where: { estado: "PENDIENTE" },
      include: { reserva: { include: { cliente: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return { fecha: fechaISO, llegan, salen, pagosPendientes };
}

export async function obtenerResumenMensual(anio, mes) {
  const inicio = new Date(Date.UTC(anio, mes - 1, 1));
  const fin = new Date(Date.UTC(anio, mes, 1));

  const [reservasDelMes, pagosAprobados, canceladas, habitacionesActivas] =
    await Promise.all([
      prisma.reserva.findMany({
        where: {
          createdAt: { gte: inicio, lt: fin },
          estado: { notIn: ["CANCELADA", "EXPIRADA"] },
        },
        select: { cantidadNoches: true, precioTotal: true },
      }),

      prisma.pago.aggregate({
        where: {
          estado: "APROBADO",
          fechaPago: { gte: inicio, lt: fin },
        },
        _sum: { monto: true },
        _count: true,
      }),

      prisma.reserva.count({
        where: {
          createdAt: { gte: inicio, lt: fin },
          estado: { in: ["CANCELADA", "EXPIRADA"] },
        },
      }),

      prisma.habitacion.count({
        where: { activa: true },
      }),
    ]);

  const nochesVendidas = reservasDelMes.reduce(
    (total, r) => total + r.cantidadNoches,
    0
  );

  const diasDelMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const nochesDisponibles = habitacionesActivas * diasDelMes;

  const ocupacionPorcentaje =
    nochesDisponibles > 0
      ? (nochesVendidas / nochesDisponibles) * 100
      : 0;

  return {
    anio,
    mes,
    totalReservas: reservasDelMes.length,
    nochesVendidas,
    ingresos: Number(pagosAprobados._sum.monto ?? 0),
    pagosAprobadosCantidad: pagosAprobados._count,
    canceladas,
    ocupacionPorcentaje,
  };
}