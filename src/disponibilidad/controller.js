import { consultarDisponibilidad } from "./service.js";

export async function consultar(req, res) {
  try {
    const resultado = await consultarDisponibilidad(req.body);

    return res.json({
      success: true,
      data: resultado,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}