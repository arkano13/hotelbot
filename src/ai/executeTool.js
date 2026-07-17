import { hotelInfo } from "../config/hotelInfo.js";

import { obtenerTarifaPorPersonas } from "../tarifas/service.js";
import {
  consultarDisponibilidad,
  consultarDisponibilidadMultiple,
} from "../disponibilidad/service.js";
import {
  crearReservaTemporal,
  crearReservasMultiples,
  obtenerReservaMasRecientePorTelefono,
  obtenerReservaPorCodigo,
} from "../reservas/service.js";
import { obtenerImagenesHabitacion } from "../imagenes/service.js";

import { flujosJefe } from "../lib/flujosJefe.js";

import {
  actualizarEstadoConversacion,
  obtenerConversacionPorId,
  reiniciarDatosReserva,
} from "../conversations/service.js";

function formatearFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

function calcularNoches(fechaEntrada, fechaSalida) {
  const entrada = new Date(`${fechaEntrada}T00:00:00`);
  const salida = new Date(`${fechaSalida}T00:00:00`);

  return Math.round(
    (salida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export async function ejecutarTool(nombre, argumentos = {}, contexto = {}) {
  const { conversationId, telefono, socket, jid } = contexto;

  switch (nombre) {
    case "consultar_tarifas": {
      const tarifa = await obtenerTarifaPorPersonas(argumentos.personas);

      return {
        personas: tarifa.personas,
        precioPorNoche: Number(tarifa.precio),
        moneda: "HNL",
      };
    }

    case "buscar_disponibilidad": {
      const fechaEntrada = argumentos.fechaEntrada;
      const fechaSalida = argumentos.fechaSalida;
      const personas = Number(argumentos.personas);

      const resultado = await consultarDisponibilidad({
        fechaEntrada,
        fechaSalida,
        personas,
      });

      const cantidadNoches = calcularNoches(fechaEntrada, fechaSalida);

      let precioPorNoche = null;
      let precioTotal = null;

      if (resultado.disponible) {
        const tarifa = await obtenerTarifaPorPersonas(personas);

        precioPorNoche = Number(tarifa.precio);
        precioTotal = precioPorNoche * cantidadNoches;
      }

      if (conversationId) {
        await actualizarEstadoConversacion(conversationId, {
          fechaEntrada: new Date(`${fechaEntrada}T00:00:00`),
          fechaSalida: new Date(`${fechaSalida}T00:00:00`),
          cantidadPersonas: personas,
          ultimaDisponibilidadAt: new Date(),
          nombreCliente: null,
          reservaId: null,
          step: resultado.disponible
            ? "ESPERANDO_CONFIRMACION"
            : "PIDIENDO_FECHAS",
        });
      }

      return {
        disponible: resultado.disponible,
        totalDisponibles: resultado.totalDisponibles,
        fechaEntrada,
        fechaSalida,
        personas,
        cantidadNoches,
        precioPorNoche,
        precioTotal,
        moneda: "HNL",
      };
    }

    case "crear_reserva": {
      if (!conversationId) {
        throw new Error("No se encontró la conversación actual");
      }

      if (!telefono) {
        throw new Error("No se encontró el teléfono del cliente");
      }

      const conversacion = await obtenerConversacionPorId(conversationId);

      if (!conversacion.ultimaDisponibilidadAt) {
        throw new Error(
          "Primero debemos revisar la disponibilidad para las fechas actuales",
        );
      }

      const minutosDesdeConsulta =
        (Date.now() - conversacion.ultimaDisponibilidadAt.getTime()) /
        (1000 * 60);

      if (minutosDesdeConsulta > 10) {
        throw new Error(
          "La consulta de disponibilidad venció. Debemos revisar nuevamente",
        );
      }

      if (
        !conversacion.fechaEntrada ||
        !conversacion.fechaSalida ||
        !conversacion.cantidadPersonas
      ) {
        throw new Error("Faltan las fechas o la cantidad de personas");
      }

      if (conversacion.step !== "ESPERANDO_CONFIRMACION") {
        throw new Error("La reserva todavía no está lista para confirmarse");
      }

      const nombre = String(argumentos.nombre ?? "").trim();

      if (!nombre) {
        throw new Error("El nombre y apellido son obligatorios");
      }

      const fechaEntrada = formatearFecha(conversacion.fechaEntrada);

      const fechaSalida = formatearFecha(conversacion.fechaSalida);

      const reserva = await crearReservaTemporal({
        nombre,
        telefono,
        fechaEntrada,
        fechaSalida,
        personas: conversacion.cantidadPersonas,
      });

      await actualizarEstadoConversacion(conversationId, {
        nombreCliente: nombre,
        reservaId: reserva.id,
        step: "ESPERANDO_PAGO",
        ultimaDisponibilidadAt: null,
      });

      return {
        codigo: reserva.codigo,
        nombreCliente: nombre,
        fechaEntrada: formatearFecha(reserva.fechaEntrada),
        fechaSalida: formatearFecha(reserva.fechaSalida),
        personas: reserva.cantidadPersonas,
        noches: reserva.cantidadNoches,
        precioPorNoche: Number(reserva.precioPorNoche),
        precioTotal: Number(reserva.precioTotal),
        moneda: "HNL",
        estado: reserva.estado,
      };
    }

    case "enviar_ubicacion": {
      if (!socket || !jid) {
        throw new Error("No se pudo acceder al chat de WhatsApp");
      }

      await socket.sendMessage(jid, {
        location: {
          degreesLatitude: hotelInfo.ubicacion.latitud,
          degreesLongitude: hotelInfo.ubicacion.longitud,
          name: hotelInfo.nombre,
          address: hotelInfo.direccion,
        },
      });

      return {
        enviada: true,
      };
    }

    case "escalar_a_humano": {
      if (!socket) {
        throw new Error("No se pudo acceder a WhatsApp");
      }

      const motivo =
        String(argumentos?.motivo ?? "").trim() ||
        "El cliente necesita atención humana.";

      const ownerPhone = String(process.env.OWNER_PHONE || "")
        .replace(/\D/g, "")
        .trim();

      if (!ownerPhone) {
        throw new Error("No hay un número de dueño configurado");
      }

      let codigoConversacion = null;

      if (conversationId) {
        try {
          const conversacionInfo = await obtenerConversacionPorId(
            conversationId
          );
          codigoConversacion = conversacionInfo?.codigo ?? null;
        } catch {
          codigoConversacion = null;
        }
      }

      const ownerJid = `${ownerPhone}@s.whatsapp.net`;

      flujosJefe.set(ownerJid, {
        tipo: "ESCALAR_CONFIRMACION",
        conversationId,
        telefonoCliente: telefono,
      });

      await socket.sendMessage(ownerJid, {
        text:
          `🙋 Un cliente necesita atención humana` +
          `${codigoConversacion ? ` (${codigoConversacion})` : ""}\n` +
          `Cliente: ${telefono}\n` +
          `Motivo: ${motivo}\n\n` +
          `1. Aceptar (tomo la conversación)\n` +
          `2. Rechazar (que el bot siga atendiendo)`,
      });

      return {
        escalado: true,
        mensaje:
          "Se notificó al jefe. Avísale al cliente que en un momento lo atienden, con paciencia y buena actitud sin importar cómo se haya comportado.",
      };
    }

    case "consultar_reserva": {
      if (!telefono) {
        throw new Error("No se encontró el teléfono del cliente");
      }

      const codigoReserva = String(argumentos?.codigo ?? "").trim();

      const reserva = codigoReserva
        ? await obtenerReservaPorCodigo(codigoReserva)
        : await obtenerReservaMasRecientePorTelefono(telefono);

      if (!reserva) {
        return {
          encontrada: false,
          mensaje: "No encontré ninguna reserva asociada a este número.",
        };
      }

      return {
        encontrada: true,
        codigo: reserva.codigo,
        nombreCliente: reserva.cliente?.nombre ?? null,
        fechaEntrada: formatearFecha(reserva.fechaEntrada),
        fechaSalida: formatearFecha(reserva.fechaSalida),
        personas: reserva.cantidadPersonas,
        noches: reserva.cantidadNoches,
        habitacion: reserva.habitacion?.numero ?? null,
        precioTotal: Number(reserva.precioTotal),
        moneda: "HNL",
        estadoReserva: reserva.estado,
        estadoPago: reserva.pago?.estado ?? "NO_GENERADO",
        codigoPago: reserva.pago?.codigo ?? null,
        motivoRechazoPago: reserva.pago?.motivoRechazo ?? null,
      };
    }

    case "iniciar_nueva_reserva": {
      if (!conversationId) {
        throw new Error("No se encontró la conversación actual");
      }

      await reiniciarDatosReserva(conversationId);

      return {
        reiniciada: true,
        mensaje:
          "Los datos anteriores fueron eliminados. Podemos comenzar una nueva reserva.",
      };
    }

    case "enviar_fotos": {
      if (!socket || !jid) {
        throw new Error("No se pudo acceder al chat de WhatsApp");
      }

      const tipoSolicitado = String(
        argumentos?.tipo ?? "habitacion"
      ).toLowerCase();

      const tipo = tipoSolicitado.startsWith("general")
        ? "GENERAL"
        : "HABITACION";

      const imagenes = await obtenerImagenesHabitacion(tipo);

      for (let i = 0; i < imagenes.length; i++) {
        const imagen = imagenes[i];

        await socket.sendMessage(jid, {
          image: {
            url: imagen.url,
          },
          caption:
            i === 0
              ? tipo === "GENERAL"
                ? "Estas son algunas fotos de nuestro hotel."
                : "Estas son algunas fotos de nuestras habitaciones."
              : undefined,
        });
      }

      return {
        enviadas: true,
        cantidad: imagenes.length,
        tipo,
      };
    }
    case "buscar_disponibilidad_multiple": {
      const fechaEntrada = argumentos.fechaEntrada;
      const fechaSalida = argumentos.fechaSalida;
      const personas = Number(argumentos.personas);

      const resultado = await consultarDisponibilidadMultiple({
        fechaEntrada,
        fechaSalida,
        personas,
      });

      const cantidadNoches = calcularNoches(fechaEntrada, fechaSalida);

      let precioTotalPorNoche = 0;

      if (resultado.disponible) {
        for (const capacidad of resultado.distribucion) {
          const tarifa = await obtenerTarifaPorPersonas(capacidad);

          precioTotalPorNoche += Number(tarifa.precio);
        }
      }

      return {
        disponible: resultado.disponible,
        personas,
        distribucion: resultado.distribucion,
        totalHabitaciones: resultado.totalHabitaciones,
        cantidadNoches,
        precioTotalPorNoche: resultado.disponible ? precioTotalPorNoche : null,
        precioTotal: resultado.disponible
          ? precioTotalPorNoche * cantidadNoches
          : null,
        moneda: "HNL",
      };
    }
    case "crear_reservas_multiples": {
      if (!conversationId || !telefono) {
        throw new Error("No se encontró la conversación actual");
      }

      const nombre = String(argumentos.nombre ?? "").trim();

      if (!nombre) {
        throw new Error("El nombre y apellido son obligatorios");
      }

      const reservas = await crearReservasMultiples({
        nombre,
        telefono,
        fechaEntrada: argumentos.fechaEntrada,
        fechaSalida: argumentos.fechaSalida,
        personas: Number(argumentos.personas),
      });

      await actualizarEstadoConversacion(conversationId, {
        nombreCliente: nombre,
        reservaIds: reservas.map((reserva) => reserva.id),
        step: "ESPERANDO_PAGO",
      });

      return {
        cantidadReservas: reservas.length,
        codigos: reservas.map((reserva) => reserva.codigo),
        distribucion: reservas.map((reserva) => reserva.cantidadPersonas),
        precioTotal: reservas.reduce(
          (total, reserva) => total + Number(reserva.precioTotal),
          0,
        ),
        moneda: "HNL",
      };
    }

    default:
      throw new Error(`Herramienta no reconocida: ${nombre}`);
  }
}