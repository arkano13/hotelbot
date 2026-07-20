// ⚠️ Este script crea y borra reservas de prueba.
// Córrelo solo contra tu base de datos de DESARROLLO, nunca en producción.

import { prisma } from "../src/lib/prisma.js";
import { crearReservaTemporal } from "../src/reservas/service.js";
import { expirarReservasPendientes } from "../src/reservas/expirationService.js";
import {
  registrarComprobante,
  aprobarPagoPorCodigo,
} from "../src/pagos/service.js";

const FECHA_ENTRADA = "2027-03-10";
const FECHA_SALIDA = "2027-03-12";
const TELEFONO = "50499111222";

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
  console.log("🧪 Test: expiración automática de reservas\n");

  await limpiar();

  const reserva = await crearReservaTemporal({
    nombre: "Cliente Expiración",
    telefono: TELEFONO,
    fechaEntrada: FECHA_ENTRADA,
    fechaSalida: FECHA_SALIDA,
    personas: 1,
  });

  console.log(
    `✅ Reserva creada: ${reserva.codigo} (habitación ${reserva.habitacion.numero})`
  );

  // Forzamos que ya haya vencido, como si hubieran pasado los 30 minutos
  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { expiraEn: new Date(Date.now() - 60 * 1000) },
  });

  console.log("⏪ Se forzó expiraEn al pasado (simulando que venció)");

  const cantidadExpirada = await expirarReservasPendientes();

  const reservaActualizada = await prisma.reserva.findUnique({
    where: { id: reserva.id },
    include: { pago: true },
  });

  console.log(
    `\n${
      reservaActualizada.estado === "EXPIRADA" ? "✅" : "🚨"
    } Estado de la reserva tras el scheduler: ${reservaActualizada.estado}`
  );
  console.log(`   Reservas expiradas procesadas en esta corrida: ${cantidadExpirada}`);

  // ¿La habitación quedó libre de verdad? Probamos crear otra reserva ahí mismo.
  const telefonoOtroCliente = "50499111333";

  try {
    const nuevaReserva = await crearReservaTemporal({
      nombre: "Cliente Después de la Expiración",
      telefono: telefonoOtroCliente,
      fechaEntrada: FECHA_ENTRADA,
      fechaSalida: FECHA_SALIDA,
      personas: 1,
    });

    console.log(
      `✅ La habitación quedó libre: se pudo crear ${nuevaReserva.codigo} en las mismas fechas`
    );

    await prisma.pago.deleteMany({
      where: { reservaId: nuevaReserva.id },
    });
    await prisma.reserva.delete({ where: { id: nuevaReserva.id } });
    await prisma.cliente.deleteMany({
      where: { telefono: telefonoOtroCliente },
    });
  } catch (error) {
    console.log(`🚨 La habitación NO quedó libre: ${error.message}`);
  }

  // Caso extra: ¿qué pasa si alguien intenta aprobar el pago de una reserva
  // que YA expiró? (ej. el cliente mandó el comprobante tarde)
  console.log(
    "\n🧪 Extra: intentar aprobar el pago de una reserva ya EXPIRADA\n"
  );

  try {
    const pago = await registrarComprobante({
      reservaId: reserva.id,
      comprobanteUrl: "http://localhost/fake-comprobante.jpg",
    });

    console.log(`   Comprobante registrado sobre reserva expirada: ${pago.codigo}`);

    const resultado = await aprobarPagoPorCodigo(pago.codigo);

    console.log(
      `   ⚠️ El sistema SÍ dejó aprobar el pago. Reserva quedó en: ${resultado.reserva.estado}, habitación: ${resultado.reserva.habitacion.numero}`
    );
    console.log(
      "   Esto puede ser correcto (recuperar un pago legítimo que llegó tarde) o no, según lo que tú quieras — vale la pena que lo decidas a propósito."
    );
  } catch (error) {
    console.log(
      `   ✅ El sistema bloqueó la aprobación: ${error.message}`
    );
  }

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