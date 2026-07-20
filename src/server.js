import "dotenv/config";

const advertenciaOriginal = console.warn;
console.warn = (...args) => {
  if (args[0] === "Decrypted message with closed session.") {
    return;
  }
  advertenciaOriginal(...args);
};

import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { iniciarWhatsApp } from "./whatsapp/client.js";

import {
  iniciarSchedulerConversaciones,
  detenerSchedulerConversaciones,
} from "./conversations/scheduler.js";

import {
  iniciarSchedulerReportes,
  detenerSchedulerReportes,
} from "./reportes/Scheduler.js";

import {
  iniciarSchedulerBackups,
  detenerSchedulerBackups,
} from "./backups/scheduler.js";

import {
  iniciarExpiracionReservas,
  detenerExpiracionReservas,
} from "./reservas/expirationScheduler.js";

const PORT = Number(process.env.PORT) || 3000;

let servidor = null;
let cerrando = false;

function iniciarSchedulers() {
  iniciarExpiracionReservas();
  iniciarSchedulerConversaciones();
  iniciarSchedulerReportes();
  iniciarSchedulerBackups();
}

function detenerSchedulers() {
  detenerExpiracionReservas();
  detenerSchedulerConversaciones();
  detenerSchedulerReportes();
  detenerSchedulerBackups();
}

async function iniciarServidor() {
  try {
    await prisma.$connect();

    console.log("✅ Base de datos conectada");

    servidor = app.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    });

    await iniciarWhatsApp();

    iniciarSchedulers();
  } catch (error) {
    console.error("❌ Error iniciando el servidor:", error);

    detenerSchedulers();

    if (servidor) {
      servidor.close();
      servidor = null;
    }

    await prisma.$disconnect().catch(() => {});

    process.exit(1);
  }
}

async function cerrarServidor(signal) {
  if (cerrando) {
    return;
  }

  cerrando = true;

  console.log(`\n🛑 Cerrando servidor por ${signal}...`);

  detenerSchedulers();

  if (servidor) {
    await new Promise((resolve) => {
      servidor.close(() => {
        console.log("✅ Servidor HTTP cerrado");

        resolve();
      });
    });
  }

  await prisma.$disconnect().catch((error) => {
    console.error("❌ Error desconectando Prisma:", error);
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
  console.error("❌ Promesa no controlada:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Error no controlado:", error);

  cerrarServidor("uncaughtException");
});

iniciarServidor();
