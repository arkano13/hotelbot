import { prisma } from "../src/lib/prisma.js";

async function main() {
  await prisma.habitacion.updateMany({
    where: { numero: { in: ["1", "2", "3"] } },
    data: { capacidad: 1 },
  });

  await prisma.habitacion.updateMany({
    where: { numero: { in: ["4", "5", "6"] } },
    data: { capacidad: 2 },
  });

  await prisma.habitacion.updateMany({
    where: { numero: { in: ["7", "8"] } },
    data: { capacidad: 3 },
  });

  console.log("Habitaciones actualizadas correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
