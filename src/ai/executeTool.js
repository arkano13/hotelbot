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

function calcularNoches(fechaEntrada, fechaSalida) {
  const entrada = new Date(`${fechaEntrada}T00:00:00`);
  const salida = new Date(`${fechaSalida}T00:00:00`);

  return Math.round(
    (salida.getTime() - entrada.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

export async function ejecutarTool(
  nombre,
  argumentos = {},
  contexto = {}
) {
  const { conversationId, telefono } = contexto;

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
      const fechaEntrada = argumentos.fechaEntrada;
      const fechaSalida = argumentos.fechaSalida;
      const personas = Number(argumentos.personas);

      const resultado = await consultarDisponibilidad({
        fechaEntrada,
        fechaSalida,
        personas,
      });

      const cantidadNoches = calcularNoches(
        fechaEntrada,
        fechaSalida
      );

      let precioPorNoche = null;
      let precioTotal = null;

      if (resultado.disponible) {
        const tarifa = await obtenerTarifaPorPersonas(personas);

        precioPorNoche = Number(tarifa.precio);
        precioTotal = precioPorNoche * cantidadNoches;
      }

      if (conversationId) {
        await actualizarEstadoConversacion(conversationId, {
          fechaEntrada: new Date(
            `${fechaEntrada}T00:00:00`
          ),
          fechaSalida: new Date(
            `${fechaSalida}T00:00:00`
          ),
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
        throw new Error(
          "No se encontró la conversación actual"
        );
      }

      if (!telefono) {
        throw new Error(
          "No se encontró el teléfono del cliente"
        );
      }

      const conversacion =
        await obtenerConversacionPorId(conversationId);

      if (!conversacion.ultimaDisponibilidadAt) {
        throw new Error(
          "Primero debes consultar disponibilidad para las fechas actuales"
        );
      }

      const minutosDesdeConsulta =
        (Date.now() -
          conversacion.ultimaDisponibilidadAt.getTime()) /
        (1000 * 60);

      if (minutosDesdeConsulta > 10) {
        throw new Error(
          "La consulta de disponibilidad venció. Debemos revisar nuevamente las fechas"
        );
      }

      if (
        !conversacion.fechaEntrada ||
        !conversacion.fechaSalida ||
        !conversacion.cantidadPersonas
      ) {
        throw new Error(
          "Faltan las fechas o la cantidad de personas"
        );
      }

      if (
        conversacion.step !== "ESPERANDO_CONFIRMACION"
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

      const fechaEntrada = formatearFecha(
        conversacion.fechaEntrada
      );

      const fechaSalida = formatearFecha(
        conversacion.fechaSalida
      );

      const reserva = await crearReservaTemporal({
        nombre,
        telefono,
        fechaEntrada,
        fechaSalida,
        personas: conversacion.cantidadPersonas,
      });

      await actualizarEstadoConversacion(
        conversationId,
        {
          nombreCliente: nombre,
          reservaId: reserva.id,
          step: "ESPERANDO_PAGO",
          ultimaDisponibilidadAt: null,
        }
      );

      return {
        codigo: reserva.codigo,
        nombreCliente: nombre,
        fechaEntrada: formatearFecha(
          reserva.fechaEntrada
        ),
        fechaSalida: formatearFecha(
          reserva.fechaSalida
        ),
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
      throw new Error(`Tool no reconocida: ${nombre}`);
  }
}