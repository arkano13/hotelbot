// Prueba de concurrencia REAL contra Postgres (no mockeada).
// Replica exactamente la lógica de crearReservaTemporal() en reservas/service.js:
//   1) SELECT reservas conflictivas para esa habitación/fechas dentro de una
//      transacción SERIALIZABLE
//   2) Si no hay conflicto, INSERT la nueva reserva
//   3) Si Postgres detecta un conflicto de serialización (SQLSTATE 40001),
//      reintenta hasta 3 veces (igual que ejecutarTransaccionSerializable)
//
// Objetivo: lanzar N intentos EXACTAMENTE al mismo tiempo por la MISMA
// habitación y fechas, y verificar que Postgres solo deja pasar UNA reserva.

import pg from "pg";

const { Pool } = pg;

// Usa la misma DATABASE_URL que ya tienes en tu .env de la base de prueba.
// Corre así: DATABASE_URL="postgresql://..." HABITACION_ID="el-id-real" node scripts-test/concurrencia_reservas.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const HABITACION_ID = process.env.HABITACION_ID || "hab-1";
const ENTRADA = "2027-01-10T00:00:00.000Z";
const SALIDA = "2027-01-12T00:00:00.000Z";
const INTENTOS_CONCURRENTES = 20;

async function intentarReservar(numeroIntento) {
  const client = await pool.connect();

  try {
    for (let intento = 1; intento <= 3; intento++) {
      try {
        await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");

        const conflicto = await client.query(
          `SELECT id FROM reservas
           WHERE "habitacionId" = $1
             AND estado IN ('PENDIENTE_PAGO', 'CONFIRMADA', 'CHECK_IN')
             AND "fechaEntrada" < $3
             AND "fechaSalida" > $2
           LIMIT 1`,
          [HABITACION_ID, ENTRADA, SALIDA]
        );

        if (conflicto.rows.length > 0) {
          await client.query("ROLLBACK");
          return { numeroIntento, resultado: "RECHAZADA_CONFLICTO" };
        }

        // Cliente dummy reutilizable (uno por intento para no chocar con
        // el @unique de telefono)
        const clienteId = `cliente-concurrencia-${numeroIntento}`;

        await client.query(
          `INSERT INTO clientes (id, nombre, telefono, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, now(), now())
           ON CONFLICT (id) DO NOTHING`,
          [clienteId, `Cliente Test ${numeroIntento}`, `999${String(numeroIntento).padStart(6, "0")}`]
        );

        const reservaId = `reserva-concurrencia-${numeroIntento}`;
        const codigo = `RES-TEST-${numeroIntento}`;

        await client.query(
          `INSERT INTO reservas (
             id, codigo, "clienteId", "habitacionId",
             "fechaEntrada", "fechaSalida", "cantidadPersonas", "cantidadNoches",
             "precioPorNoche", "precioTotal", estado, "expiraEn",
             "createdAt", "updatedAt"
           ) VALUES ($1,$2,$3,$4,$5,$6,2,2,500,1000,'PENDIENTE_PAGO', now() + interval '30 minutes', now(), now())`,
          [reservaId, codigo, clienteId, HABITACION_ID, ENTRADA, SALIDA]
        );

        await client.query("COMMIT");
        return { numeroIntento, resultado: "RESERVADA_OK" };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});

        const esConflictoSerializacion = error.code === "40001";

        if (!esConflictoSerializacion || intento === 3) {
          return {
            numeroIntento,
            resultado: "ERROR",
            detalle: error.message,
          };
        }
        // reintentar (igual que hace el código real)
      }
    }
  } finally {
    client.release();
  }
}

async function limpiarCorridasAnteriores() {
  await pool.query(
    `DELETE FROM reservas WHERE id LIKE 'reserva-concurrencia-%'`
  );
  await pool.query(
    `DELETE FROM clientes WHERE id LIKE 'cliente-concurrencia-%'`
  );
}

async function main() {
  await limpiarCorridasAnteriores();

  console.log(
    `Lanzando ${INTENTOS_CONCURRENTES} intentos simultáneos de reservar la misma habitación...\n`
  );

  const resultados = await Promise.all(
    Array.from({ length: INTENTOS_CONCURRENTES }, (_, i) => intentarReservar(i + 1))
  );

  const exitosas = resultados.filter((r) => r.resultado === "RESERVADA_OK");
  const rechazadas = resultados.filter((r) => r.resultado === "RECHAZADA_CONFLICTO");
  const errores = resultados.filter((r) => r.resultado === "ERROR");

  console.log("Resultados:");
  console.table(resultados);

  const { rows } = await pool.query(
    `SELECT count(*)::int AS total FROM reservas WHERE "habitacionId" = $1
     AND estado IN ('PENDIENTE_PAGO','CONFIRMADA','CHECK_IN')`,
    [HABITACION_ID]
  );

  console.log(`\nReservas realmente creadas en la BD para esa habitación: ${rows[0].total}`);
  console.log(`Exitosas: ${exitosas.length} | Rechazadas por conflicto: ${rechazadas.length} | Errores: ${errores.length}`);

  if (rows[0].total === 1 && exitosas.length === 1) {
    console.log("\n✅ PASA: solo se creó UNA reserva. No hubo doble reserva.");
  } else {
    console.log("\n❌ FALLA: se detectó más de una reserva activa para la misma habitación/fechas (DOBLE RESERVA).");
    process.exitCode = 1;
  }

  await pool.end();
}

main().catch((error) => {
  console.error("Error fatal en la prueba:", error);
  process.exit(1);
});