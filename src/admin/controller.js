import {
  listarHabitacionesConEstado,
  listarHabitacionesPorCapacidadConEstado,
} from "../habitaciones/service.js";

import {
  listarReservasParaCheckIn,
  listarReservasParaCheckout,
  listarReservasParaCancelar,
  registrarCheckInPorHabitacion,
  listarAlternativasParaCheckIn,
  registrarCheckoutPorHabitacion,
  cancelarReservaPorId,
  listarHabitacionesParaMantenimiento,
  alternarMantenimientoHabitacion,
  crearReservaWalkIn,
  listarHabitacionesDisponiblesWalkIn,
} from "../reservas/service.js";

import {
  listarPagosPendientes,
  aprobarPagoPorCodigo,
  rechazarPagoPorCodigo,
} from "../pagos/service.js";

import {
  obtenerConfiguracionBot,
  establecerBotActivo,
} from "../configuracion/service.js";

import {
  listarEscalacionesPendientes,
  listarConversacionesEnModoHumano,
  cambiarModoConversacion,
  actualizarEstadoConversacion,
} from "../conversations/service.js";

import { registrarDispositivo } from "../notificaciones/service.js";

function manejarError(res, error) {
  return res.status(400).json({
    success: false,
    message: error.message || "Ocurrió un error",
  });
}

export async function habitaciones(req, res) {
  try {
    const datos = await listarHabitacionesConEstado();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasParaCheckIn(req, res) {
  try {
    const datos = await listarReservasParaCheckIn();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasParaCheckout(req, res) {
  try {
    const datos = await listarReservasParaCheckout();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasParaCancelar(req, res) {
  try {
    const datos = await listarReservasParaCancelar();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function hacerCheckIn(req, res) {
  try {
    const datos = await registrarCheckInPorHabitacion(
      req.params.habitacionId,
      req.body?.metodoPago,
      req.body?.nuevaHabitacionId
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function alternativasCheckIn(req, res) {
  try {
    const datos = await listarAlternativasParaCheckIn(req.params.habitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function hacerCheckout(req, res) {
  try {
    const datos = await registrarCheckoutPorHabitacion(req.params.habitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function cancelarReserva(req, res) {
  try {
    const datos = await cancelarReservaPorId(req.params.reservaId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesMantenimiento(req, res) {
  try {
    const datos = await listarHabitacionesParaMantenimiento();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function alternarMantenimiento(req, res) {
  try {
    const datos = await alternarMantenimientoHabitacion(req.params.habitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function pagosPendientes(req, res) {
  try {
    const datos = await listarPagosPendientes();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function aprobarPago(req, res) {
  try {
    const datos = await aprobarPagoPorCodigo(req.params.codigo);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function rechazarPago(req, res) {
  try {
    const motivo = req.body?.motivo ?? "";
    const datos = await rechazarPagoPorCodigo(req.params.codigo, motivo);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesDisponiblesWalkIn(req, res) {
  try {
    const { fechaEntrada, fechaSalida, personas } = req.query;
    const datos = await listarHabitacionesDisponiblesWalkIn({
      fechaEntrada,
      fechaSalida,
      personas,
    });
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesPorCapacidadConEstado(req, res) {
  try {
    const { fechaEntrada, fechaSalida, personas } = req.query;
    const datos = await listarHabitacionesPorCapacidadConEstado({
      fechaEntrada,
      fechaSalida,
      personas,
    });
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function crearWalkIn(req, res) {
  try {
    const datos = await crearReservaWalkIn(req.body);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function estadoBot(req, res) {
  try {
    const datos = await obtenerConfiguracionBot();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function cambiarEstadoBot(req, res) {
  try {
    const datos = await establecerBotActivo(req.body?.activo);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function escalacionesPendientes(req, res) {
  try {
    const datos = await listarEscalacionesPendientes();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function aceptarEscalacion(req, res) {
  try {
    const datos = await cambiarModoConversacion(
      req.params.conversationId,
      "HUMANO"
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function rechazarEscalacion(req, res) {
  try {
    const datos = await actualizarEstadoConversacion(
      req.params.conversationId,
      { necesitaHumano: false, motivoEscalar: null }
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function registrarDispositivoPush(req, res) {
  try {
    const datos = await registrarDispositivo(req.body?.token);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function conversacionesEnModoHumano(req, res) {
  try {
    const datos = await listarConversacionesEnModoHumano();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function devolverABot(req, res) {
  try {
    const datos = await cambiarModoConversacion(
      req.params.conversationId,
      "BOT"
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}