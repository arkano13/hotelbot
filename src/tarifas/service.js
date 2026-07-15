import { prisma } from "../lib/prisma.js";

export async function obtenerTarifas() {
  return prisma.tarifa.findMany({
    where: {
      activa: true,
    },
    orderBy: {
      personas: "asc",
    },
  });
}

export async function obtenerTarifaPorPersonas(personas) {
  const cantidad = Number(personas);

  if (!Number.isInteger(cantidad) || ![1, 2, 3].includes(cantidad)) {
    throw new Error("La cantidad de personas debe ser 1, 2 o 3");
  }

  const tarifa = await prisma.tarifa.findUnique({
    where: {
      personas: cantidad,
    },
  });

  if (!tarifa || !tarifa.activa) {
    throw new Error(
      `No existe una tarifa activa para ${cantidad} persona(s)`
    );
  }

  return tarifa;
}