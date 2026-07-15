import "dotenv/config";

import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { iniciarWhatsApp } from "./whatsapp/client.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log(
      "✅ Conexión a PostgreSQL establecida"
    );

    app.listen(PORT, async () => {
      console.log(
        `✅ Servidor ejecutándose en http://localhost:${PORT}`
      );

      try {
        await iniciarWhatsApp();
      } catch (error) {
        console.error(
          "❌ Error iniciando WhatsApp:",
          error
        );
      }
    });
  } catch (error) {
    console.error(
      "❌ No se pudo iniciar el servidor:",
      error
    );

    process.exit(1);
  }
}

startServer();