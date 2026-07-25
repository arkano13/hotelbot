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

// ¿Ya es de madrugada en Honduras (antes de las 6 AM)? Se usa para la
// regla de walk-in: alguien que llega ya tan tarde que prácticamente
// amaneció no debería "empezar" una noche nueva — esa madrugada sigue
// perteneciendo a la noche de ayer, y por eso le toca salir HOY a la
// hora de checkout, no mañana.
export function esMadrugadaHonduras(limiteHora = 6) {
  const horaHonduras = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Tegucigalpa",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date())
  );

  return horaHonduras < limiteHora;
}

// Si es de madrugada (antes de las 6 AM) y la entrada que se está
// registrando es "hoy", la recorre a "ayer" — así la noche que ya
// terminó de vivirse cuenta como la de ayer, y sale hoy a la hora de
// checkout en vez de mañana.
export function ajustarEntradaWalkInMadrugada(fechaEntradaTexto, fechaSalidaTexto) {
  if (!esMadrugadaHonduras()) {
    return { fechaEntrada: fechaEntradaTexto, fechaSalida: fechaSalidaTexto };
  }

  const fechaHoyHonduras = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
  }).format(new Date());

  if (fechaEntradaTexto !== fechaHoyHonduras) {
    return { fechaEntrada: fechaEntradaTexto, fechaSalida: fechaSalidaTexto };
  }

  const restarUnDia = (texto) => {
    const fecha = new Date(`${texto}T12:00:00Z`); // mediodía, para no toparse con el borde del día al restar
    fecha.setUTCDate(fecha.getUTCDate() - 1);
    return fecha.toISOString().slice(0, 10);
  };

  return {
    fechaEntrada: restarUnDia(fechaEntradaTexto),
    fechaSalida: restarUnDia(fechaSalidaTexto),
  };
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