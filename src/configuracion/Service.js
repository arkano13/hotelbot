import { prisma } from "../lib/prisma.js";

const ID_CONFIGURACION = "global";

export async function obtenerConfiguracionBot() {
  const configuracion = await prisma.configuracionBot.upsert({
    where: { id: ID_CONFIGURACION },
    update: {},
    create: { id: ID_CONFIGURACION, activo: true },
  });

  return configuracion;
}

export async function establecerBotActivo(activo) {
  return prisma.configuracionBot.upsert({
    where: { id: ID_CONFIGURACION },
    update: { activo: Boolean(activo) },
    create: { id: ID_CONFIGURACION, activo: Boolean(activo) },
  });
}