import { prisma } from "../lib/prisma.js";

export async function registrarAuditoria({
  accion,
  entidad,
  entidadId,
  detalle,
}) {
  try {
    await prisma.auditoria.create({
      data: {
        accion,
        entidad,
        entidadId: entidadId ?? null,
        detalle: detalle ?? null,
      },
    });
  } catch (error) {
    console.error("❌ Error registrando auditoría:", error);
  }
}

export async function listarAuditoriaReciente(limite = 20) {
  return prisma.auditoria.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limite,
  });
}