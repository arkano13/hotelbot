import { prisma } from "../lib/prisma.js";

export async function obtenerImagenesHabitacion(tipo = "HABITACION") {
  const imagenes = await prisma.imagenHabitacion.findMany({
    where: {
      activa: true,
      tipo,
    },
    orderBy: {
      orden: "asc",
    },
  });

  if (imagenes.length === 0) {
    throw new Error(
      tipo === "GENERAL"
        ? "No hay fotos generales del hotel disponibles todavía"
        : "No hay fotografías de habitaciones disponibles todavía"
    );
  }

  return imagenes;
}