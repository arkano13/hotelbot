import {
  obtenerTarifas,
  obtenerTarifaPorPersonas,
} from "./service.js";

export async function listarTarifas(req, res) {
  try {
    const tarifas = await obtenerTarifas();

    return res.json({
      success: true,
      data: tarifas,
    });
  } catch (error) {
    console.error("Error obteniendo tarifas:", error);

    return res.status(500).json({
      success: false,
      message: "No se pudieron obtener las tarifas",
    });
  }
}

export async function consultarTarifa(req, res) {
  try {
    const tarifa = await obtenerTarifaPorPersonas(
      req.params.personas
    );

    return res.json({
      success: true,
      data: tarifa,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}