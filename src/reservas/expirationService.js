import { prisma } from "../lib/prisma.js";

export async function expirarReservasPendientes() {
  const ahora = new Date();

  const reservasVencidas = await prisma.reserva.findMany({
    where: {
      estado: "PENDIENTE_PAGO",
      expiraEn: {
        lte: ahora,
      },
    },
    include: {
      pago: true,
    },
  });

  for (const reserva of reservasVencidas) {
    await prisma.$transaction(async (tx) => {
      await tx.reserva.update({
        where: {
          id: reserva.id,
        },
        data: {
          estado: "EXPIRADA",
        },
      });

      if (
        reserva.pago &&
        ["NO_GENERADO", "PENDIENTE"].includes(reserva.pago.estado)
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
    });

    console.log(`⌛ Reserva expirada: ${reserva.codigo}`);
  }

  return reservasVencidas.length;
}