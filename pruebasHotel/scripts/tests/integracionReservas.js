import assert from "node:assert/strict";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    "Define TEST_DATABASE_URL con una base PostgreSQL exclusiva para pruebas",
  );
}

const nombreBase = new URL(testDatabaseUrl)
  .pathname
  .replace(/^\//, "")
  .toLowerCase();

if (
  !nombreBase.includes("test") ||
  process.env.ALLOW_TEST_DATABASE_RESET !== "SI"
) {
  throw new Error(
    "Protección activada: la base debe contener 'test' en el nombre y ALLOW_TEST_DATABASE_RESET=SI",
  );
}

process.env.DATABASE_URL = testDatabaseUrl;

const { prisma } = await import(
  "../../../src/lib/prisma.js"
);

const {
  crearReservaTemporal,
  crearReservaWalkIn,
  crearReservasMultiples,
  cancelarReservaPorId,
  registrarCheckoutPorHabitacion,
} = await import(
  "../../../src/reservas/service.js"
);

const {
  registrarComprobante,
  aprobarPagoPorCodigo,
} = await import(
  "../../../src/pagos/service.js"
);

const { expirarReservasPendientes } = await import(
  "../../../src/reservas/expirationService.js"
);

function fechaHonduras() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function sumarDias(fecha, dias) {
  const valor = new Date(`${fecha}T12:00:00Z`);

  valor.setUTCDate(
    valor.getUTCDate() + dias,
  );

  return valor.toISOString().slice(0, 10);
}

async function limpiarTransacciones() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.auditoria.deleteMany();
  await prisma.cliente.deleteMany();
}

async function limpiarTodo() {
  await limpiarTransacciones();

  await prisma.imagenHabitacion.deleteMany();
  await prisma.tarifa.deleteMany();
  await prisma.habitacion.deleteMany();
}

async function prepararCatalogos() {
  const capacidades = {
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
  };

  for (
    const [numero, capacidad] of
    Object.entries(capacidades)
  ) {
    await prisma.habitacion.create({
      data: {
        numero,
        capacidad,
        estado: "DISPONIBLE",
        activa: true,
      },
    });
  }

  const tarifas = [
    [1, 700],
    [2, 900],
    [3, 1100],
  ];

  for (const [personas, precio] of tarifas) {
    await prisma.tarifa.create({
      data: {
        personas,
        precio,
        activa: true,
      },
    });
  }
}

async function escenario(nombre, prueba) {
  process.stdout.write(`🧪 ${nombre}... `);

  await limpiarTransacciones();

  await prisma.habitacion.updateMany({
    data: {
      estado: "DISPONIBLE",
      activa: true,
    },
  });

  await prueba();

  console.log("OK");
}

const hoy = fechaHonduras();
const entrada = sumarDias(hoy, 2);
const salida = sumarDias(hoy, 4);

async function main() {
  await prisma.$connect();

  await limpiarTodo();
  await prepararCatalogos();

  await escenario(
    "asignación individual según capacidad",
    async () => {
      for (const personas of [1, 2, 3]) {
        const reserva =
          await crearReservaTemporal({
            nombre: `Cliente ${personas}`,
            telefono: `5049000000${personas}`,
            fechaEntrada: entrada,
            fechaSalida: salida,
            personas,
          });

        assert.equal(
          reserva.habitacion.capacidad,
          personas,
        );

        assert.equal(
          reserva.estado,
          "PENDIENTE_PAGO",
        );

        assert.equal(
          reserva.pago.estado,
          "NO_GENERADO",
        );
      }
    },
  );

  await escenario(
    "expiración de reserva y pago",
    async () => {
      const reserva =
        await crearReservaTemporal({
          nombre: "Cliente Expiración",
          telefono: "50490000101",
          fechaEntrada: entrada,
          fechaSalida: salida,
          personas: 1,
        });

      await prisma.reserva.update({
        where: {
          id: reserva.id,
        },
        data: {
          expiraEn: new Date(
            Date.now() - 60_000,
          ),
        },
      });

      assert.equal(
        await expirarReservasPendientes(),
        1,
      );

      const actual =
        await prisma.reserva.findUnique({
          where: {
            id: reserva.id,
          },
          include: {
            pago: true,
          },
        });

      assert.equal(
        actual.estado,
        "EXPIRADA",
      );

      assert.equal(
        actual.pago.estado,
        "VENCIDO",
      );
    },
  );

  await escenario(
    "aprobar, confirmar y cancelar sin reembolso",
    async () => {
      const reserva =
        await crearReservaTemporal({
          nombre: "Cliente Pago",
          telefono: "50490000102",
          fechaEntrada: entrada,
          fechaSalida: salida,
          personas: 2,
        });

      const pago =
        await registrarComprobante({
          reservaId: reserva.id,
          comprobanteUrl:
            "https://example.test/comprobante.jpg",
        });

      const aprobado =
        await aprobarPagoPorCodigo(
          pago.codigo,
        );

      assert.equal(
        aprobado.reserva.estado,
        "CONFIRMADA",
      );

      assert.equal(
        aprobado.pago.estado,
        "APROBADO",
      );

      const cancelada =
        await cancelarReservaPorId(
          reserva.id,
        );

      assert.equal(
        cancelada.estado,
        "CANCELADA",
      );

      assert.equal(
        cancelada.pago.estado,
        "APROBADO",
      );
    },
  );

  await escenario(
    "walk-in y checkout manual",
    async () => {
      const walkIn =
        await crearReservaWalkIn({
          nombre: "Cliente Walk In",
          telefono: null,
          fechaEntrada: hoy,
          fechaSalida: sumarDias(hoy, 1),
          personas: 1,
        });

      assert.equal(
        walkIn.estado,
        "CHECK_IN",
      );

      assert.equal(
        walkIn.pago.estado,
        "APROBADO",
      );

      const checkout =
        await registrarCheckoutPorHabitacion(
          walkIn.habitacion.id,
        );

      assert.equal(
        checkout.estado,
        "CHECK_OUT",
      );
    },
  );

  await escenario(
    "dos clientes compiten por la última habitación",
    async () => {
      await prisma.habitacion.updateMany({
        where: {
          numero: {
            in: ["2", "3"],
          },
        },
        data: {
          estado: "MANTENIMIENTO",
        },
      });

      const resultados =
        await Promise.allSettled([
          crearReservaTemporal({
            nombre: "Concurrente A",
            telefono: "50490000201",
            fechaEntrada: entrada,
            fechaSalida: salida,
            personas: 1,
          }),
          crearReservaTemporal({
            nombre: "Concurrente B",
            telefono: "50490000202",
            fechaEntrada: entrada,
            fechaSalida: salida,
            personas: 1,
          }),
        ]);

      assert.equal(
        resultados.filter(
          (item) =>
            item.status === "fulfilled",
        ).length,
        1,
      );

      assert.equal(
        resultados.filter(
          (item) =>
            item.status === "rejected",
        ).length,
        1,
      );
    },
  );

  await escenario(
    "pago tardío con reasignación",
    async () => {
      const tardia =
        await crearReservaTemporal({
          nombre: "Cliente Tardío",
          telefono: "50490000301",
          fechaEntrada: entrada,
          fechaSalida: salida,
          personas: 1,
        });

      await prisma.reserva.update({
        where: {
          id: tardia.id,
        },
        data: {
          expiraEn: new Date(
            Date.now() - 60_000,
          ),
        },
      });

      await expirarReservasPendientes();

      await crearReservaTemporal({
        nombre: "Cliente Nuevo",
        telefono: "50490000302",
        fechaEntrada: entrada,
        fechaSalida: salida,
        personas: 1,
      });

      const pago =
        await registrarComprobante({
          reservaId: tardia.id,
          comprobanteUrl:
            "https://example.test/tardio.jpg",
        });

      const resultado =
        await aprobarPagoPorCodigo(
          pago.codigo,
        );

      assert.equal(
        resultado.reasignada,
        true,
      );

      assert.equal(
        resultado.reserva.estado,
        "CONFIRMADA",
      );
    },
  );

  await escenario(
    "pago tardío sin habitaciones no se aprueba",
    async () => {
      const tardia =
        await crearReservaTemporal({
          nombre: "Cliente Sin Cupo",
          telefono: "50490000401",
          fechaEntrada: entrada,
          fechaSalida: salida,
          personas: 1,
        });

      await prisma.reserva.update({
        where: {
          id: tardia.id,
        },
        data: {
          expiraEn: new Date(
            Date.now() - 60_000,
          ),
        },
      });

      await expirarReservasPendientes();

      for (
        let indice = 0;
        indice < 3;
        indice++
      ) {
        await crearReservaTemporal({
          nombre: `Cliente Ocupa ${indice}`,
          telefono: `5049000041${indice}`,
          fechaEntrada: entrada,
          fechaSalida: salida,
          personas: 1,
        });
      }

      const pago =
        await registrarComprobante({
          reservaId: tardia.id,
          comprobanteUrl:
            "https://example.test/sin-cupo.jpg",
        });

      await assert.rejects(
        aprobarPagoPorCodigo(pago.codigo),
        /no hay una habitación disponible/i,
      );
    },
  );

  await escenario(
    "grupo de cuatro personas usa dos habitaciones",
    async () => {
      const reservas =
        await crearReservasMultiples({
          nombre: "Grupo Prueba",
          telefono: "50490000501",
          fechaEntrada: entrada,
          fechaSalida: salida,
          personas: 4,
        });

      assert.equal(
        reservas.length,
        2,
      );

      assert.deepEqual(
        reservas
          .map(
            (reserva) =>
              reserva.cantidadPersonas,
          )
          .sort(),
        [1, 3],
      );

      assert.ok(
        reservas.every(
          (reserva) =>
            reserva.pago.estado ===
            "NO_GENERADO",
        ),
      );
    },
  );

  console.log(
    "\n✅ Todas las pruebas de integración terminaron correctamente.",
  );
}

main()
  .catch((error) => {
    console.error(
      "\n❌ Falló la integración:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await limpiarTodo().catch(() => {});
    await prisma.$disconnect();
  });