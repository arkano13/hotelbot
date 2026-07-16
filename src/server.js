import "dotenv/config";

import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { iniciarWhatsApp } from "./whatsapp/client.js";

import {
  iniciarSchedulerConversaciones,
  detenerSchedulerConversaciones,
} from "./conversations/scheduler.js";
const PORT = Number(process.env.PORT) || 3000;

let servidor = null;
let cerrando = false;

async function iniciarServidor() {
  try {
    await prisma.$connect();

    console.log("✅ Base de datos conectada");

    servidor = app.listen(PORT, () => {
      console.log(
        `✅ Servidor ejecutándose en http://localhost:${PORT}`
      );
    });

    iniciarSchedulerConversaciones();

    await iniciarWhatsApp();
  } catch (error) {
    console.error(
      "❌ Error iniciando el servidor:",
      error
    );

    detenerSchedulerConversaciones();

    await prisma.$disconnect().catch(() => {});

    process.exit(1);
  }
}

async function cerrarServidor(signal) {
  if (cerrando) {
    return;
  }

  cerrando = true;

  console.log(
    `\n🛑 Cerrando servidor por ${signal}...`
  );

  detenerSchedulerConversaciones();

  if (servidor) {
    await new Promise((resolve) => {
      servidor.close(() => {
        console.log("✅ Servidor HTTP cerrado");
        resolve();
      });
    });
  }

  await prisma.$disconnect().catch((error) => {
    console.error(
      "❌ Error desconectando Prisma:",
      error
    );
  });

  console.log("✅ Servidor cerrado");

  process.exit(0);
}

process.on("SIGINT", () => {
  cerrarServidor("SIGINT");
});

process.on("SIGTERM", () => {
  cerrarServidor("SIGTERM");
});

process.on("unhandledRejection", (error) => {
  console.error(
    "❌ Promesa no controlada:",
    error
  );
});

process.on("uncaughtException", (error) => {
  console.error(
    "❌ Error no controlado:",
    error
  );

  cerrarServidor("uncaughtException");
});

iniciarServidor();