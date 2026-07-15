import {
  actualizarEstadoPago,
  crearPago,
  generarLinkPagoSimulado,
  obtenerPago,
} from "./service.js";

export async function crear(req, res) {
  try {
    const pago = await crearPago(req.body.reservaId);

    return res.status(201).json({
      success: true,
      data: pago,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function generarLink(req, res) {
  try {
    const pago = await generarLinkPagoSimulado(req.params.id);

    return res.json({
      success: true,
      message: "Link de pago generado",
      data: pago,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function obtener(req, res) {
  try {
    const pago = await obtenerPago(req.params.id);

    return res.json({
      success: true,
      data: pago,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function cambiarEstado(req, res) {
  try {
    const resultado = await actualizarEstadoPago(
      req.params.id,
      req.body.estado
    );

    return res.json({
      success: true,
      message: "Estado actualizado correctamente",
      data: resultado,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}