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

  if (!Number.isInteger(cantidad) || ![1, 2, 3, 4].includes(cantidad)) {
    throw new Error("La cantidad de personas debe ser 1, 2, 3 o 4");
  }

  // Las habitaciones de capacidad 3 en realidad tienen 3 camas (2
  // sencillas + 1 doble) y caben hasta 4 personas sin costo adicional —
  // por eso 4 personas cobra exactamente la misma tarifa que 3.
  const cantidadParaTarifa = cantidad === 4 ? 3 : cantidad;

  const tarifa = await prisma.tarifa.findUnique({
    where: {
      personas: cantidadParaTarifa,
    },
  });

  if (!tarifa || !tarifa.activa) {
    throw new Error(
      `No existe una tarifa activa para ${cantidadParaTarifa} persona(s)`
    );
  }

  return tarifa;
}