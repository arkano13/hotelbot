import "dotenv/config";

import { prisma } from "../../../src/lib/prisma.js";

const errores = [];
const avisos = [];

function error(mensaje) {
  errores.push(mensaje);
}

function aviso(mensaje) {
  avisos.push(mensaje);
}

function seSuperponen(a, b) {
  return a.fechaEntrada < b.fechaSalida && a.fechaSalida > b.fechaEntrada;
}

function capacidadEsperada(numero) {
  if (["1", "2", "3"].includes(String(numero))) return 1;
  if (["4", "5", "6"].includes(String(numero))) return 2;
  if (["7", "8"].includes(String(numero))) return 3;
  return null;
}

async function auditarHabitaciones() {
  const habitaciones = await prisma.habitacion.findMany({
    orderBy: { numero: "asc" },
  });

  const esperadas = new Set([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ]);

  for (const habitacion of habitaciones) {
    const numero = String(habitacion.numero);
    const capacidad = capacidadEsperada(numero);

    if (!esperadas.has(numero)) {
      aviso(`Habitación inesperada: ${numero}`);
      continue;
    }

    esperadas.delete(numero);

    if (habitacion.capacidad !== capacidad) {
      error(
        `Habitación ${numero}: capacidad ${habitacion.capacidad}; debería ser ${capacidad}`,
      );
    }

    if (!habitacion.activa) {
      aviso(`Habitación ${numero} está marcada como inactiva`);
    }
  }

  for (const faltante of esperadas) {
    error(`Falta la habitación ${faltante}`);
  }
}

async function auditarTarifas() {
  const tarifas = await prisma.tarifa.findMany();

  for (const personas of [1, 2, 3]) {
    const tarifa = tarifas.find(
      (item) => item.personas === personas,
    );

    if (!tarifa) {
      error(`Falta la tarifa para ${personas} persona(s)`);
    } else if (!tarifa.activa || Number(tarifa.precio) <= 0) {
      error(`Tarifa inválida para ${personas} persona(s)`);
    }
  }
}

async function auditarReservas() {
  const estadosActivos = [
    "PENDIENTE_PAGO",
    "CONFIRMADA",
    "CHECK_IN",
  ];

  const reservas = await prisma.reserva.findMany({
    include: {
      habitacion: true,
      cliente: true,
      pago: true,
    },
    orderBy: [
      {
        habitacionId: "asc",
      },
      {
        fechaEntrada: "asc",
      },
    ],
  });

  const activas = reservas.filter((reserva) =>
    estadosActivos.includes(reserva.estado),
  );

  for (let i = 0; i < activas.length; i++) {
    for (let j = i + 1; j < activas.length; j++) {
      const a = activas[i];
      const b = activas[j];

      if (
        a.habitacionId === b.habitacionId &&
        seSuperponen(a, b)
      ) {
        error(
          `Doble reserva activa en habitación ${a.habitacion.numero}: ${a.codigo} y ${b.codigo}`,
        );
      }
    }
  }

  for (const reserva of reservas) {
    const nochesCalculadas = Math.round(
      (reserva.fechaSalida - reserva.fechaEntrada) /
        (24 * 60 * 60 * 1000),
    );

    if (
      nochesCalculadas < 1 ||
      reserva.cantidadNoches !== nochesCalculadas
    ) {
      error(
        `${reserva.codigo}: cantidadNoches=${reserva.cantidadNoches}, calculadas=${nochesCalculadas}`,
      );
    }

    if (
      reserva.cantidadPersonas >
      reserva.habitacion.capacidad
    ) {
      error(
        `${reserva.codigo}: ${reserva.cantidadPersonas} personas en habitación de capacidad ${reserva.habitacion.capacidad}`,
      );
    }

    if (!reserva.pago) {
      error(`${reserva.codigo}: no tiene registro de pago`);
      continue;
    }

    if (
      ["CONFIRMADA", "CHECK_IN", "CHECK_OUT"].includes(
        reserva.estado,
      ) &&
      reserva.pago.estado !== "APROBADO"
    ) {
      error(
        `${reserva.codigo}: está ${reserva.estado}, pero el pago está ${reserva.pago.estado}`,
      );
    }

    if (
      reserva.estado === "EXPIRADA" &&
      reserva.pago.estado !== "VENCIDO"
    ) {
      error(
        `${reserva.codigo}: está EXPIRADA, pero el pago está ${reserva.pago.estado}`,
      );
    }

    if (
      reserva.estado === "PENDIENTE_PAGO" &&
      reserva.expiraEn &&
      reserva.expiraEn <= new Date()
    ) {
      error(
        `${reserva.codigo}: debió expirar y todavía está PENDIENTE_PAGO`,
      );
    }

    if (
      reserva.pago.estado === "APROBADO" &&
      ["PENDIENTE_PAGO", "EXPIRADA"].includes(reserva.estado)
    ) {
      error(
        `${reserva.codigo}: pago APROBADO con reserva ${reserva.estado}`,
      );
    }
  }
}

async function auditarConversaciones() {
  const conversaciones =
    await prisma.conversation.findMany();

  for (const conversacion of conversaciones) {
    const ids = [];

    if (conversacion.reservaId) {
      ids.push(conversacion.reservaId);
    }

    if (Array.isArray(conversacion.reservaIds)) {
      ids.push(...conversacion.reservaIds);
    }

    if (
      Array.isArray(conversacion.reservaIds) &&
      conversacion.reservaIds.length > 0 &&
      !conversacion.reservaId
    ) {
      aviso(
        `${conversacion.codigo}: tiene reservas múltiples, pero el comprobante actual solo usa reservaId`,
      );
    }

    if (ids.length) {
      const idsUnicos = [...new Set(ids)];

      const existentes = await prisma.reserva.count({
        where: {
          id: {
            in: idsUnicos,
          },
        },
      });

      if (existentes !== idsUnicos.length) {
        error(
          `${conversacion.codigo}: referencia una reserva inexistente`,
        );
      }
    }
  }
}

async function auditarImagenes() {
  const imagenes =
    await prisma.imagenHabitacion.findMany();

  for (const imagen of imagenes) {
    if (
      !["HABITACION", "GENERAL"].includes(imagen.tipo)
    ) {
      error(
        `Imagen ${imagen.id}: tipo inválido ${imagen.tipo}`,
      );
    }

    if (
      imagen.activa &&
      !/^https?:\/\//i.test(imagen.url)
    ) {
      aviso(
        `Imagen activa ${imagen.id}: URL no pública (${imagen.url})`,
      );
    }
  }
}

async function main() {
  await prisma.$connect();

  await auditarHabitaciones();
  await auditarTarifas();
  await auditarReservas();
  await auditarConversaciones();
  await auditarImagenes();

  console.log(
    "\n=== AUDITORÍA DE HOTELBOT (SOLO LECTURA) ===",
  );

  for (const mensaje of errores) {
    console.log(`❌ ${mensaje}`);
  }

  for (const mensaje of avisos) {
    console.log(`⚠️ ${mensaje}`);
  }

  if (!errores.length && !avisos.length) {
    console.log(
      "✅ No se encontraron inconsistencias.",
    );
  } else {
    console.log(
      `\nResultado: ${errores.length} error(es), ${avisos.length} aviso(s).`,
    );
  }

  if (errores.length) {
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error(
      "❌ No se pudo completar la auditoría:",
      err,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });