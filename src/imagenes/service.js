import { prisma } from "../lib/prisma.js";

export async function obtenerImagenesHabitacion() {
  const imagenes =
    await prisma.imagenHabitacion.findMany({
      where: {
        activa: true,
      },
      orderBy: {
        orden: "asc",
      },
    });

  if (imagenes.length === 0) {
    throw new Error(
      "No hay fotografías disponibles"
    );
  }

  return imagenes;
}