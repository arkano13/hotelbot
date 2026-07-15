import { prisma } from "../src/lib/prisma.js";

async function crearTarifas() {
  const tarifas = [
    { personas: 1, precio: 700, activa: true },
    { personas: 2, precio: 900, activa: true },
    { personas: 3, precio: 1100, activa: true },
  ];

  for (const tarifa of tarifas) {
    await prisma.tarifa.upsert({
      where: {
        personas: tarifa.personas,
      },
      update: {
        precio: tarifa.precio,
        activa: tarifa.activa,
      },
      create: tarifa,
    });
  }

  console.log("✅ Tarifas creadas");
}

async function crearHabitaciones() {
  const habitaciones = ["1", "2", "3", "4", "5", "6", "7", "8"];

  for (const numero of habitaciones) {
    await prisma.habitacion.upsert({
      where: {
        numero,
      },
      update: {
        capacidad: 3,
        activa: true,
      },
      create: {
        numero,
        capacidad: 3,
        estado: "DISPONIBLE",
        activa: true,
      },
    });
  }

  console.log("✅ Habitaciones creadas");
}

async function main() {
  await crearTarifas();
  await crearHabitaciones();

  console.log("✅ Seed completado correctamente");
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });