import { listarHabitacionesConEstado } from "../habitaciones/service.js";

import {
  listarReservasParaCheckIn,
  listarReservasParaCheckout,
  listarReservasParaCancelar,
  registrarCheckInPorHabitacion,
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
    const datos = await registrarCheckInPorHabitacion(req.params.habitacionId);
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

export async function crearWalkIn(req, res) {
  try {
    const datos = await crearReservaWalkIn(req.body);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}