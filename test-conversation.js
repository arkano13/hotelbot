import { prisma } from "./src/lib/prisma.js";
import {
  obtenerOCrearConversacion,
  obtenerConversacionConHistorial,
} from "./src/conversations/service.js";
import { guardarMensaje } from "./src/messages/service.js";

async function main() {
  const conversation = await obtenerOCrearConversacion(
    "50499998888"
  );

  await guardarMensaje({
    conversationId: conversation.id,
    role: "USER",
    content: "Hola, quiero reservar una habitación",
  });

  const resultado = await obtenerConversacionConHistorial(
    "50499998888"
  );

  console.dir(resultado, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });