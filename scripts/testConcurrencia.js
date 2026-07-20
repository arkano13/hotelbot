// ⚠️ Este script crea y borra reservas de prueba.
// Córrelo solo contra tu base de datos de DESARROLLO, nunca en producción.

import { prisma } from "../src/lib/prisma.js";
import { crearReservaTemporal } from "../src/reservas/service.js";

const FECHA_ENTRADA = "2027-01-10";
const FECHA_SALIDA = "2027-01-12";
const CANTIDAD_INTENTOS = 5;
const CAPACIDAD_PRUEBA = 1;

async function limpiar() {
  const clientes = await prisma.cliente.findMany({
    where: { telefono: { startsWith: "50499000" } },
    select: { id: true },
  });

  const clienteIds = clientes.map((c) => c.id);

  if (clienteIds.length > 0) {
    await prisma.pago.deleteMany({
      where: { reserva: { clienteId: { in: clienteIds } } },
    });

    await prisma.reserva.deleteMany({
      where: { clienteId: { in: clienteIds } },
    });

    await prisma.cliente.deleteMany({
      where: { id: { in: clienteIds } },
    });
  }
}

async function main() {
  console.log(
    `🧪 Simulando ${CANTIDAD_INTENTOS} clientes reservando al mismo tiempo`
  );
  console.log(
    `   (capacidad ${CAPACIDAD_PRUEBA}, ${FECHA_ENTRADA} → ${FECHA_SALIDA})\n`
  );

  await limpiar();

  const intentos = Array.from(
    { length: CANTIDAD_INTENTOS },
    (_, i) =>
      crearReservaTemporal({
        nombre: `Cliente Prueba ${i + 1}`,
        telefono: `50499000${String(i).padStart(3, "0")}`,
        fechaEntrada: FECHA_ENTRADA,
        fechaSalida: FECHA_SALIDA,
        personas: CAPACIDAD_PRUEBA,
      })
        .then((reserva) => ({
          ok: true,
          i,
          codigo: reserva.codigo,
          habitacion: reserva.habitacion.numero,
        }))
        .catch((error) => ({
          ok: false,
          i,
          error: error.message,
        }))
  );

  const resultados = await Promise.all(intentos);

  const exitosos = resultados.filter((r) => r.ok);
  const fallidos = resultados.filter((r) => !r.ok);

  console.log(`✅ Exitosos: ${exitosos.length}`);
  exitosos.forEach((r) =>
    console.log(
      `   Cliente ${r.i + 1} → ${r.codigo} (habitación ${r.habitacion})`
    )
  );

  console.log(`\n❌ Fallidos (esperado si no hay cupo): ${fallidos.length}`);
  fallidos.forEach((r) =>
    console.log(`   Cliente ${r.i + 1} → ${r.error}`)
  );

  const habitacionesUsadas = exitosos.map((r) => r.habitacion);
  const sinDuplicados =
    new Set(habitacionesUsadas).size === habitacionesUsadas.length;

  const habitacionesDisponiblesCapacidad = await prisma.habitacion.count({
    where: { capacidad: CAPACIDAD_PRUEBA, activa: true },
  });

  console.log(
    `\n${sinDuplicados ? "✅" : "🚨"} Ninguna habitación se asignó dos veces: ${sinDuplicados}`
  );
  console.log(
    `${
      exitosos.length <= habitacionesDisponiblesCapacidad ? "✅" : "🚨"
    } No se sobrevendió: ${exitosos.length}/${habitacionesDisponiblesCapacidad} habitaciones ocupadas`
  );

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