import { obtenerTarifaPorPersonas } from "../tarifas/service.js";
import { consultarDisponibilidad } from "../disponibilidad/service.js";
import { crearReservaTemporal } from "../reservas/service.js";

import {
  actualizarEstadoConversacion,
  obtenerConversacionPorId,
} from "../conversations/service.js";

function formatearFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

export async function ejecutarTool(
  nombre,
  argumentos = {},
  contexto = {}
) {
  const {
    conversationId,
    telefono,
  } = contexto;

  switch (nombre) {
    case "consultar_tarifas": {
      const tarifa = await obtenerTarifaPorPersonas(
        argumentos.personas
      );

      return {
        personas: tarifa.personas,
        precioPorNoche: Number(tarifa.precio),
        moneda: "HNL",
      };
    }

    case "buscar_disponibilidad": {
      const resultado = await consultarDisponibilidad({
        fechaEntrada: argumentos.fechaEntrada,
        fechaSalida: argumentos.fechaSalida,
        personas: argumentos.personas,
      });

      if (conversationId) {
        await actualizarEstadoConversacion(conversationId, {
          fechaEntrada: new Date(
            `${argumentos.fechaEntrada}T00:00:00`
          ),
          fechaSalida: new Date(
            `${argumentos.fechaSalida}T00:00:00`
          ),
          cantidadPersonas: Number(argumentos.personas),
          step: resultado.disponible
            ? "ESPERANDO_CONFIRMACION"
            : "PIDIENDO_FECHAS",
        });
      }

      const tarifa = resultado.disponible
        ? await obtenerTarifaPorPersonas(argumentos.personas)
        : null;

      const entrada = new Date(
        `${argumentos.fechaEntrada}T00:00:00`
      );

      const salida = new Date(
        `${argumentos.fechaSalida}T00:00:00`
      );

      const noches = Math.round(
        (salida.getTime() - entrada.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        disponible: resultado.disponible,
        totalDisponibles: resultado.totalDisponibles,
        fechaEntrada: argumentos.fechaEntrada,
        fechaSalida: argumentos.fechaSalida,
        personas: Number(argumentos.personas),
        cantidadNoches: noches,
        precioPorNoche: tarifa
          ? Number(tarifa.precio)
          : null,
        precioTotal: tarifa
          ? Number(tarifa.precio) * noches
          : null,
        moneda: "HNL",
      };
    }

    case "crear_reserva": {
      if (!conversationId) {
        throw new Error(
          "No se encontró la conversación actual"
        );
      }

      const conversacion =
        await obtenerConversacionPorId(conversationId);

      if (
        !conversacion.fechaEntrada ||
        !conversacion.fechaSalida ||
        !conversacion.cantidadPersonas
      ) {
        throw new Error(
          "Faltan fechas o cantidad de personas para crear la reserva"
        );
      }

      if (
        conversacion.step !==
        "ESPERANDO_CONFIRMACION"
      ) {
        throw new Error(
          "La reserva todavía no está lista para confirmarse"
        );
      }

      const nombre = String(
        argumentos.nombre ?? ""
      ).trim();

      if (!nombre) {
        throw new Error(
          "El nombre del cliente es obligatorio"
        );
      }

      const reserva = await crearReservaTemporal({
        nombre,
        telefono,
        fechaEntrada: formatearFecha(
          conversacion.fechaEntrada
        ),
        fechaSalida: formatearFecha(
          conversacion.fechaSalida
        ),
        personas:
          conversacion.cantidadPersonas,
      });

      await actualizarEstadoConversacion(
        conversationId,
        {
          nombreCliente: nombre,
          reservaId: reserva.id,
          step: "ESPERANDO_PAGO",
        }
      );

      return {
        codigo: reserva.codigo,
        nombreCliente: nombre,
        fechaEntrada:
          formatearFecha(reserva.fechaEntrada),
        fechaSalida:
          formatearFecha(reserva.fechaSalida),
        personas: reserva.cantidadPersonas,
        noches: reserva.cantidadNoches,
        precioPorNoche: Number(
          reserva.precioPorNoche
        ),
        precioTotal: Number(
          reserva.precioTotal
        ),
        moneda: "HNL",
        estado: reserva.estado,
      };
    }

    default:
      throw new Error(
        `Tool no reconocida: ${nombre}`
      );
  }
}