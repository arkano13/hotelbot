// El servidor (Railway) corre en UTC, pero el hotel opera en hora de
// Honduras (UTC-6, sin horario de verano — el desfase es siempre el
// mismo). Cualquier fecha de reserva ("2026-07-23") debe interpretarse
// como la medianoche de ESE día en Honduras, no en UTC — si no, todo
// queda guardado 6 horas antes de lo que debería, y procesos como el
// checkout automático (que compara contra el fin del día en Honduras)
// terminan marcando reservas de salida "mañana" como si fuera "hoy".

// Convierte una fecha simple ("YYYY-MM-DD") en la medianoche real de ese
// día en Honduras, expresada como instante UTC. Úsala SIEMPRE que se
// reciba una fecha de entrada/salida de una reserva — nunca hagas
// `new Date(fecha + "T00:00:00")` directo, eso usa la hora del servidor.
export function crearFechaHonduras(fecha) {
  return new Date(`${fecha}T06:00:00Z`);
}

export function obtenerRangoHoyHonduras() {
  const fechaHondurasHoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const inicio = crearFechaHonduras(fechaHondurasHoy);
  const fin = new Date(inicio);
  fin.setUTCDate(fin.getUTCDate() + 1);

  return { inicio, fin };
}