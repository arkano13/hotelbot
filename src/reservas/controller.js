import {
  crearReservaTemporal,
  obtenerReservaPorCodigo,
} from "./service.js";

export async function crearReserva(req, res) {
  try {
    const reserva = await crearReservaTemporal(req.body);

    return res.status(201).json({
      success: true,
      message: "Reserva temporal creada correctamente",
      data: reserva,
    });
  } catch (error) {
    console.error("Error creando reserva:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function consultarReserva(req, res) {
  try {
    const reserva = await obtenerReservaPorCodigo(
      req.params.codigo
    );

    return res.json({
      success: true,
      data: reserva,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}