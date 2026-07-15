import { prisma } from "../lib/prisma.js";
import { consultarDisponibilidad } from "../disponibilidad/service.js";
import { obtenerTarifaPorPersonas } from "../tarifas/service.js";
import { crearOActualizarCliente } from "../clientes/service.js";

function calcularNoches(fechaEntrada, fechaSalida) {
  const diferencia = fechaSalida.getTime() - fechaEntrada.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

function generarCodigoReserva() {
  const fecha = new Date();
  const numero = Math.floor(100000 + Math.random() * 900000);

  return `RES-${fecha.getFullYear()}-${numero}`;
}

export async function crearReservaTemporal({
  nombre,
  telefono,
  fechaEntrada,
  fechaSalida,
  personas,
  observaciones,
}) {
  const cantidadPersonas = Number(personas);

  const disponibilidad = await consultarDisponibilidad({
    fechaEntrada,
    fechaSalida,
    personas: cantidadPersonas,
  });

  if (!disponibilidad.disponible || !disponibilidad.habitacion) {
    throw new Error("No hay habitaciones disponibles para esas fechas");
  }

  const tarifa = await obtenerTarifaPorPersonas(cantidadPersonas);

  const entrada = new Date(`${fechaEntrada}T00:00:00`);
  const salida = new Date(`${fechaSalida}T00:00:00`);

  const cantidadNoches = calcularNoches(entrada, salida);
  const precioPorNoche = Number(tarifa.precio);
  const precioTotal = precioPorNoche * cantidadNoches;

  const cliente = await crearOActualizarCliente({
    nombre,
    telefono,
  });

  const expiraEn = new Date(Date.now() +  30 * 60 * 1000);

return prisma.$transaction(async (tx) => {
  const reserva = await tx.reserva.create({
    data: {
      codigo: generarCodigoReserva(),
      clienteId: cliente.id,
      habitacionId: disponibilidad.habitacion.id,
      fechaEntrada: entrada,
      fechaSalida: salida,
      cantidadPersonas,
      cantidadNoches,
      precioPorNoche,
      precioTotal,
      estado: "PENDIENTE_PAGO",
      expiraEn,
      observaciones: observaciones
        ? String(observaciones).trim()
        : null,
    },
  });

  const pago = await tx.pago.create({
    data: {
      reservaId: reserva.id,
      monto: precioTotal,
      estado: "NO_GENERADO",
    },
  });

  return {
    ...reserva,
    pago,
  };
});
}

export async function obtenerReservaPorCodigo(codigo) {
  const codigoLimpio = String(codigo ?? "").trim().toUpperCase();

  if (!codigoLimpio) {
    throw new Error("El código de reserva es obligatorio");
  }

  const reserva = await prisma.reserva.findUnique({
    where: {
      codigo: codigoLimpio,
    },
    include: {
      cliente: true,
      habitacion: true,
      pago: true,
    },
  });

  if (!reserva) {
    throw new Error("Reserva no encontrada");
  }

  return reserva;
}