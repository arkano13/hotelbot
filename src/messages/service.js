import { prisma } from "../lib/prisma.js";

const ROLES_VALIDOS = ["USER", "ASSISTANT", "TOOL"];

export async function guardarMensaje({
  conversationId,
  role,
  content,
  toolName = null,
  toolData = null,
}) {
  if (!conversationId) {
    throw new Error("conversationId es obligatorio");
  }

  if (!ROLES_VALIDOS.includes(role)) {
    throw new Error("El rol del mensaje no es válido");
  }

  const contenido = String(content ?? "").trim();

  if (!contenido) {
    throw new Error("El contenido del mensaje es obligatorio");
  }

  return prisma.message.create({
    data: {
      conversationId,
      role,
      content: contenido,
      toolName,
      toolData,
    },
  });
}