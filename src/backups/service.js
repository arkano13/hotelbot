import { prisma } from "../lib/prisma.js";

export async function generarBackupCompleto() {
  const [
    habitaciones,
    clientes,
    tarifas,
    reservas,
    pagos,
    conversaciones,
    mensajes,
    imagenes,
  ] = await Promise.all([
    prisma.habitacion.findMany(),
    prisma.cliente.findMany(),
    prisma.tarifa.findMany(),
    prisma.reserva.findMany(),
    prisma.pago.findMany(),
    prisma.conversation.findMany(),
    prisma.message.findMany(),
    prisma.imagenHabitacion.findMany(),
  ]);

  return {
    generadoEn: new Date().toISOString(),
    habitaciones,
    clientes,
    tarifas,
    reservas,
    pagos,
    conversaciones,
    mensajes,
    imagenes,
  };
}