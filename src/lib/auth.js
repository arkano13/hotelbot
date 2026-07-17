export function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!process.env.API_KEY) {
    return res.status(500).json({
      success: false,
      message: "API_KEY no está configurada en el servidor",
    });
  }

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  return next();
}