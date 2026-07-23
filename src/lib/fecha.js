
// El servidor (Railway) corre en UTC, pero el hotel opera en hora de
// Honduras (UTC-6). "Hoy" siempre debe calcularse según Honduras, no según
// la hora del servidor — si no, entre medianoche y las 6am UTC (que
// todavía es la noche anterior en Honduras) el sistema cree que ya es
// "mañana" y las reservas de "hoy" desaparecen de la app.
export function obtenerRangoHoyHonduras() {
  const inicio = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Tegucigalpa",
    }),
  );

  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  return { inicio, fin };
}