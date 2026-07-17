import { prisma } from "../lib/prisma.js";

const ZONA_HORARIA = "America/Tegucigalpa";
const HORA_CHECKOUT = 11;

function obtenerFechaHoraHonduras() {
  const formateador = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const partes = Object.fromEntries(
    formateador
      .formatToParts(new Date())
      .filter((parte) => parte.type !== "literal")
      .map((parte) => [parte.type, parte.value])
  );

  return {
    fechaISO: `${partes.year}-${partes.month}-${partes.day}`,
    hora: Number(partes.hour),
    minuto: Number(partes.minute),
  };
}

export async function expirarReservasPendientes() {
  const ahora = new Date();

  const reservasVencidas = await prisma.reserva.findMany({
    where: {
      estado: "PENDIENTE_PAGO",
      expiraEn: {
        not: null,
        lte: ahora,
      },
    },
    include: {
      pago: true,
    },
  });

  let cantidadExpirada = 0;

  for (const reserva of reservasVencidas) {
    const actualizada = await prisma.$transaction(async (tx) => {
      const resultado = await tx.reserva.updateMany({
        where: {
          id: reserva.id,
          estado: "PENDIENTE_PAGO",
          expiraEn: {
            not: null,
            lte: ahora,
          },
        },
        data: {
          estado: "EXPIRADA",
        },
      });

      if (resultado.count === 0) {
        return false;
      }

      if (
        reserva.pago &&
        ["NO_GENERADO", "PENDIENTE", "RECHAZADO"].includes(
          reserva.pago.estado
        )
      ) {
        await tx.pago.update({
          where: {
            id: reserva.pago.id,
          },
          data: {
            estado: "VENCIDO",
          },
        });
      }

      return true;
    });

    if (actualizada) {
      cantidadExpirada++;
      console.log(`⌛ Reserva expirada: ${reserva.codigo}`);
    }
  }

  return cantidadExpirada;
}

export async function procesarCheckoutsAutomaticos() {
  const { fechaISO, hora } = obtenerFechaHoraHonduras();

  if (hora < HORA_CHECKOUT) {
    return 0;
  }

  const finDelDiaEnHonduras = new Date(
    `${fechaISO}T23:59:59.999-06:00`
  );

  const reservasParaCheckout = await prisma.reserva.findMany({
    where: {
      estado: "CHECK_IN",
      fechaSalida: {
        lte: finDelDiaEnHonduras,
      },
    },
    select: {
      id: true,
      codigo: true,
    },
  });

  let cantidadCheckout = 0;

  for (const reserva of reservasParaCheckout) {
    const resultado = await prisma.reserva.updateMany({
      where: {
        id: reserva.id,
        estado: "CHECK_IN",
      },
      data: {
        estado: "CHECK_OUT",
      },
    });

    if (resultado.count > 0) {
      cantidadCheckout++;
      console.log(`🚪 Checkout automático: ${reserva.codigo}`);
    }
  }

  return cantidadCheckout;
}
