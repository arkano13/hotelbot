// ⚠️ Este script crea y borra reservas de prueba, y toca temporalmente
// el estado de una habitación real. Córrelo solo contra tu base de datos
// de DESARROLLO, nunca en producción.

import { prisma } from "../src/lib/prisma.js";
import { crearReservaTemporal } from "../src/reservas/service.js";
import {
  registrarComprobante,
  aprobarPagoPorCodigo,
} from "../src/pagos/service.js";

const FECHA_ENTRADA = "2027-02-10";
const FECHA_SALIDA = "2027-02-12";
const TELEFONO = "50499222333";

async function limpiar() {
  await prisma.pago.deleteMany({
    where: { reserva: { cliente: { telefono: TELEFONO } } },
  });

  await prisma.reserva.deleteMany({
    where: { cliente: { telefono: TELEFONO } },
  });

  await prisma.cliente.deleteMany({
    where: { telefono: TELEFONO },
  });
}

async function main() {
  console.log("🧪 Test: reasignación de habitación al aprobar un pago\n");

  await limpiar();

  const reserva = await crearReservaTemporal({
    nombre: "Cliente Reasignación",
    telefono: TELEFONO,
    fechaEntrada: FECHA_ENTRADA,
    fechaSalida: FECHA_SALIDA,
    personas: 2,
  });

  console.log(
    `✅ Reserva creada: ${reserva.codigo} en habitación ${reserva.habitacion.numero}`
  );

  const pago = await registrarComprobante({
    reservaId: reserva.id,
    comprobanteUrl: "http://localhost/fake-comprobante.jpg",
  });

  console.log(`✅ Comprobante registrado: ${pago.codigo}`);

  // Simulamos que justo antes de que el jefe apruebe, la habitación
  // original deja de estar disponible (ej. se puso en mantenimiento
  // por un problema real detectado ese día)
  await prisma.habitacion.update({
    where: { id: reserva.habitacionId },
    data: { estado: "MANTENIMIENTO" },
  });

  console.log(
    `🔧 Habitación ${reserva.habitacion.numero} puesta en mantenimiento (simulando que ya no está disponible)`
  );

  try {
    const resultado = await aprobarPagoPorCodigo(pago.codigo);

    const seReasigno = resultado.reasignada;
    const habitacionFinal = resultado.reserva.habitacion.numero;

    console.log(
      `\n${seReasigno ? "✅" : "ℹ️"} ¿Se reasignó a otra habitación?: ${seReasigno}`
    );
    console.log(
      `   Habitación final: ${habitacionFinal} (original era ${reserva.habitacion.numero})`
    );
    console.log(`   Estado de la reserva: ${resultado.reserva.estado}`);

    if (!seReasigno) {
      console.log(
        "   ⚠️ No se reasignó — revisa si esto es correcto (puede que no hubiera otra habitación libre de esa capacidad)"
      );
    }
  } catch (error) {
    console.log(
      `\nℹ️ El sistema no pudo aprobar el pago: ${error.message}`
    );
    console.log(
      "   Esto es correcto SI de verdad no había ninguna otra habitación disponible."
    );
  }

  // Restauramos la habitación a su estado normal
  await prisma.habitacion.update({
    where: { id: reserva.habitacionId },
    data: { estado: "DISPONIBLE" },
  });

  await limpiar();
  console.log("\n🧹 Datos de prueba limpiados.");
}

main()
  .catch((error) => {
    console.error("❌ Error en el test:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });