  // Chat de prueba por terminal — usa la MISMA lógica que WhatsApp
// (mismo Gemini, mismo prompt, misma base de datos), solo que en vez de
// mandar y recibir por WhatsApp, escribes y lees directo en la consola.
// Así puedes probar conversaciones completas en segundos, no minutos.
//
// Uso:
//   node scripts-test/chat-cli.mjs
//   node scripts-test/chat-cli.mjs 99998888     (para usar otro teléfono de prueba)
//
// Comandos especiales dentro del chat:
//   /reset   -> borra la conversación de prueba y empieza de cero
//   /comprobante <ruta>  -> simula subir esa imagen local como comprobante
//   /salir   -> termina el script

import readline from "readline";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  obtenerOCrearConversacion,
  obtenerConversacionConHistorial,
  actualizarEstadoConversacion,
} from "../src/conversations/service.js";
import { guardarMensaje } from "../src/messages/service.js";
import { generarRespuestaGemini } from "../src/ai/gemini.js";
import { obtenerConfiguracionBot } from "../src/configuracion/service.js";
import { registrarComprobantes } from "../src/pagos/service.js";
import { prisma } from "../src/lib/prisma.js";

const telefono = process.argv[2] || "99990000";

// Simula el socket de WhatsApp: en vez de mandar el mensaje de verdad,
// solo lo imprime. Esto es lo que usan herramientas como enviar_ubicacion.
const socketFalso = {
  sendMessage: async (jid, contenido) => {
    if (contenido.text) {
      console.log(`\n📍 [mensaje directo de una herramienta]: ${contenido.text}\n`);
    } else {
      console.log(`\n📍 [la herramienta mandó algo que no es texto: ${JSON.stringify(Object.keys(contenido))}]\n`);
    }
  },
};

const jidFalso = `${telefono}@s.whatsapp.net`;

async function borrarConversacionDePrueba() {
  const conversacion = await prisma.conversation.findFirst({
    where: { telefono },
  });

  if (!conversacion) {
    console.log("(no había ninguna conversación previa con este número)");
    return;
  }

  await prisma.message.deleteMany({
    where: { conversationId: conversacion.id },
  });
  await prisma.conversation.delete({
    where: { id: conversacion.id },
  });

  console.log("✅ Conversación de prueba borrada. Empezando de cero.\n");
}

async function enviarMensaje(texto) {
  const conversacion = await obtenerOCrearConversacion(telefono);

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: texto,
  });

  if (conversacion.mode === "HUMANO") {
    console.log("👤 (esta conversación está en modo HUMANO — el bot no respondería nada aquí)");
    return;
  }

  const configuracionBot = await obtenerConfiguracionBot();

  if (!configuracionBot.activo) {
    console.log("🔌 (el bot está apagado globalmente — no respondería nada)");
    return;
  }

  const conversacionConHistorial = await obtenerConversacionConHistorial(
    telefono,
    15,
  );

  let respuesta;

  try {
    respuesta = await generarRespuestaGemini({
      messages: conversacionConHistorial?.messages ?? [],
      step: conversacionConHistorial?.step ?? conversacion.step,
      telefono,
      conversationId: conversacion.id,
      socket: socketFalso,
      jid: jidFalso,
    });
  } catch (error) {
    console.error("❌ Error generando respuesta con Gemini:", error.message);
    return;
  }

  if (!respuesta?.trim()) {
    respuesta = "(respuesta vacía)";
  }

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "ASSISTANT",
    content: respuesta,
  });

  console.log(`\n🤖 Bot: ${respuesta}\n`);
}

async function simularComprobante(rutaLocal) {
  const rutaAbsoluta = path.resolve(rutaLocal);

  if (!fs.existsSync(rutaAbsoluta)) {
    console.log(`❌ No encontré el archivo: ${rutaAbsoluta}`);
    return;
  }

  const conversacion = await obtenerOCrearConversacion(telefono);

  const reservaIds = Array.isArray(conversacion.reservaIds)
    ? conversacion.reservaIds.filter(Boolean)
    : conversacion.reservaId
      ? [conversacion.reservaId]
      : [];

  if (reservaIds.length === 0) {
    console.log("❌ Esta conversación de prueba no tiene ninguna reserva activa todavía. Primero completa una reserva.");
    return;
  }

  const extension = path.extname(rutaAbsoluta).replace(".", "") || "jpg";
  const carpeta = path.join(process.cwd(), "uploads", "comprobantes");
  await fs.promises.mkdir(carpeta, { recursive: true });

  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;
  const rutaDestino = path.join(carpeta, nombreArchivo);
  await fs.promises.copyFile(rutaAbsoluta, rutaDestino);

  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const comprobanteUrl = `${baseUrl}/uploads/comprobantes/${nombreArchivo}`;

  const pagos = await registrarComprobantes({ reservaIds, comprobanteUrl });

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "USER",
    content: "[Envió comprobante de pago]",
  });

  const textoRespuesta =
    `Recibí tu comprobante ✅\n` +
    `${pagos.length === 1 ? "Código de revisión" : "Códigos de revisión"}: ${pagos
      .map((pago) => pago.codigo)
      .join(", ")}\n` +
    `En cuanto el hotel lo confirme, te aviso por aquí.`;

  console.log(`\n🤖 Bot: ${textoRespuesta}\n`);

  await guardarMensaje({
    conversationId: conversacion.id,
    role: "ASSISTANT",
    content: textoRespuesta,
  });

  await actualizarEstadoConversacion(conversacion.id, {
    step: "COMPLETADO",
  });

  console.log(`(guardado en ${rutaDestino}, y en la base con URL ${comprobanteUrl})`);
}

console.log(`💬 Chat de prueba — teléfono: ${telefono}`);
console.log(`   Escribe normal para chatear. Comandos: /reset  /comprobante <ruta>  /salir\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Tú: ",
});

rl.prompt();

rl.on("line", async (linea) => {
  const texto = linea.trim();

  if (!texto) {
    rl.prompt();
    return;
  }

  if (texto === "/salir") {
    rl.close();
    return;
  }

  if (texto === "/reset") {
    await borrarConversacionDePrueba();
    rl.prompt();
    return;
  }

  if (texto.startsWith("/comprobante ")) {
    const ruta = texto.slice("/comprobante ".length).trim();
    try {
      await simularComprobante(ruta);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
    rl.prompt();
    return;
  }

  try {
    await enviarMensaje(texto);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("\n👋 Chat de prueba terminado.");
  process.exit(0);
});
