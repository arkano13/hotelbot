import { prisma } from "../src/lib/prisma.js";

async function crearTarifas() {
  const tarifas = [
    { personas: 1, precio: 500, activa: true },
    { personas: 2, precio: 650, activa: true },
    { personas: 3, precio: 800, activa: true },
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
  const habitaciones = [
    { numero: "1", capacidad: 1 },
    { numero: "6", capacidad: 1 },
    { numero: "7", capacidad: 1 },
    { numero: "9", capacidad: 1 },
    { numero: "2", capacidad: 2 },
    { numero: "5", capacidad: 2 },
    { numero: "8", capacidad: 2 },
    { numero: "3", capacidad: 3 },
    { numero: "4", capacidad: 3 },
  ];

  for (const habitacion of habitaciones) {
    await prisma.habitacion.upsert({
      where: {
        numero: habitacion.numero,
      },
      update: {
        capacidad: habitacion.capacidad,
        activa: true,
      },
      create: {
        numero: habitacion.numero,
        capacidad: habitacion.capacidad,
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