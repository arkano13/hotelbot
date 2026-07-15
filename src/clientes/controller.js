import {
  crearOActualizarCliente,
  obtenerClientePorTelefono,
} from "./service.js";

export async function guardarCliente(req, res) {
  try {
    const cliente = await crearOActualizarCliente(req.body);

    return res.status(201).json({
      success: true,
      message: "Cliente guardado correctamente",
      data: cliente,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function consultarCliente(req, res) {
  try {
    const cliente = await obtenerClientePorTelefono(
      req.params.telefono
    );

    return res.json({
      success: true,
      data: cliente,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}