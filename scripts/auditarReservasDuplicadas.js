import { prisma } from "../src/lib/prisma.js";

const ESTADOS_ACTIVOS = [
  "PENDIENTE_PAGO",
  "CONFIRMADA",
  "CHECK_IN",
];

function seSuperponen(primera, segunda) {
  return (
    primera.fechaEntrada < segunda.fechaSalida &&
    primera.fechaSalida > segunda.fechaEntrada
  );
}

function fechaCorta(fecha) {
  return new Date(fecha).toLocaleDateString("es-HN");
}

async function main() {
  const reservas = await prisma.reserva.findMany({
    where: {
      estado: {
        in: ESTADOS_ACTIVOS,
      },
    },
    orderBy: [
      { habitacionId: "asc" },
      { fechaEntrada: "asc" },
    ],
    include: {
      habitacion: true,
      cliente: true,
      pago: true,
    },
  });

  const duplicados = [];

  for (let primero = 0; primero < reservas.length; primero++) {
    for (let segundo = primero + 1; segundo < reservas.length; segundo++) {
      const reservaA = reservas[primero];
      const reservaB = reservas[segundo];

      if (reservaA.habitacionId !== reservaB.habitacionId) {
        continue;
      }

      if (seSuperponen(reservaA, reservaB)) {
        duplicados.push({ reservaA, reservaB });
      }
    }
  }

  if (duplicados.length === 0) {
    console.log("✅ No se encontraron reservas activas duplicadas.");
    return;
  }

  console.log(`⚠️ Se encontraron ${duplicados.length} conflictos:\n`);

  duplicados.forEach(({ reservaA, reservaB }, indice) => {
    console.log(`Conflicto ${indice + 1} — Habitación ${reservaA.habitacion.numero}`);
    console.log(
      `  ${reservaA.codigo} | ${reservaA.cliente.nombre} | ` +
      `${fechaCorta(reservaA.fechaEntrada)} → ${fechaCorta(reservaA.fechaSalida)} | ` +
      `${reservaA.estado}`
    );
    console.log(
      `  ${reservaB.codigo} | ${reservaB.cliente.nombre} | ` +
      `${fechaCorta(reservaB.fechaEntrada)} → ${fechaCorta(reservaB.fechaSalida)} | ` +
      `${reservaB.estado}\n`
    );
  });

  console.log("Este auditor no modificó ningún registro.");
}

main()
  .catch((error) => {
    console.error("❌ Error auditando reservas:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
