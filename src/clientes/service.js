import { prisma } from "../lib/prisma.js";

export async function crearOActualizarCliente({
  nombre,
  telefono,
  correo,
  documento,
}) {
  const nombreLimpio = String(nombre ?? "").trim();
  const telefonoLimpio = String(telefono ?? "").trim();

  if (!nombreLimpio) {
    throw new Error("El nombre es obligatorio");
  }

  if (!telefonoLimpio) {
    return prisma.cliente.create({
      data: {
        nombre: nombreLimpio,
        telefono: null,
        correo: correo ? String(correo).trim() : null,
        documento: documento ? String(documento).trim() : null,
      },
    });
  }

  return prisma.cliente.upsert({
    where: {
      telefono: telefonoLimpio,
    },
    update: {
      nombre: nombreLimpio,
      correo: correo ? String(correo).trim() : null,
      documento: documento ? String(documento).trim() : null,
    },
    create: {
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
      correo: correo ? String(correo).trim() : null,
      documento: documento ? String(documento).trim() : null,
    },
  });
}

export async function obtenerClientePorTelefono(telefono) {
  const telefonoLimpio = String(telefono ?? "").trim();

  if (!telefonoLimpio) {
    throw new Error("El teléfono es obligatorio");
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      telefono: telefonoLimpio,
    },
  });

  if (!cliente) {
    throw new Error("Cliente no encontrado");
  }

  return cliente;
}
