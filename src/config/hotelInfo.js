// Estos valores pueden personalizarse desde .env.
// No requieren migraciones. Reinicia el servidor después de cambiarlos.

function leerHora(nombre, valorPredeterminado) {
  const valorConfigurado = process.env[nombre];
  const hora = valorConfigurado === undefined
    ? valorPredeterminado
    : Number(valorConfigurado);

  if (!Number.isInteger(hora) || hora < 0 || hora > 23) {
    throw new Error(`${nombre} debe ser una hora entera entre 0 y 23`);
  }

  return hora;
}

function formatearHora(hora) {
  const periodo = hora >= 12 ? "PM" : "AM";
  const hora12 = hora % 12 === 0 ? 12 : hora % 12;

  return `${hora12}:00 ${periodo}`;
}

const horaInicioJornada = leerHora("HOTEL_START_HOUR", 6);
const horaCheckOut = leerHora("HOTEL_CHECKOUT_HOUR", 12);

export const hotelInfo = {
  nombre: process.env.HOTEL_NOMBRE || "Hotel",

  direccion: process.env.HOTEL_DIRECCION || "Configura HOTEL_DIRECCION",

  ubicacion: {
    latitud: 14.0723,
    longitud: -87.1921,
  },

  telefonoContacto: process.env.HOTEL_TELEFONO || "50400000000",

  horarios: {
    ingreso:
      process.env.HOTEL_INGRESO ||
      "El huésped puede ingresar a cualquier hora; no existe una hora fija de check-in.",
    horaInicioJornada,
    horaCheckOut,
    atencion:
      process.env.HOTEL_ATENCION ||
      "El hotel está abierto y recibe huéspedes las 24 horas, todos los días.",
    reglaEstadia:
      process.env.HOTEL_REGLA_ESTADIA ||
      `La jornada inicia a las ${formatearHora(horaInicioJornada)} y la salida máxima es a las ${formatearHora(horaCheckOut)} del día de salida.`,
  },

  pagos: {
    banco: process.env.HOTEL_BANK_NAME || "Banco de ejemplo",
    titular: process.env.HOTEL_BANK_ACCOUNT_HOLDER || "Titular de ejemplo",
    tipoCuenta: process.env.HOTEL_BANK_ACCOUNT_TYPE || "Cuenta de ahorro",
    numeroCuenta:
      process.env.HOTEL_BANK_ACCOUNT_NUMBER || "0000-0000-0000",
  },

  politicas: {
    cancelacion:
      "Las reservas pagadas pueden cancelarse, pero el pago es no reembolsable.",
    entradaAnticipada:
      "No existe una hora fija de entrada; el huésped puede llegar a cualquier hora durante su fecha reservada.",
    salidaTardia:
      "La salida tardía depende de disponibilidad y puede tener un costo adicional.",
    mascotas: "No se permiten mascotas.",
    fumado: "Está prohibido fumar dentro de las habitaciones.",
    fiestas: "No se permiten fiestas ni eventos dentro de las habitaciones.",
    visitas:
      "Las visitas deben registrarse en recepción y no pueden quedarse a dormir.",
    ninos:
      "Los niños son bienvenidos. Menores de 5 años no pagan si comparten cama con un adulto.",
    personasAdicionales:
      "Cada persona adicional a la capacidad de la habitación tiene un cargo extra, hay que preguntar el monto en recepción.",
    danos:
      "Cualquier daño a la habitación o al mobiliario será cobrado según el costo de reparación.",
    llavesPerdidas: "La pérdida de llaves tiene un cargo de L. 200.",
    objetosOlvidados:
      "El hotel no se hace responsable por objetos olvidados en la habitación, pero se intentará contactar al huésped si se encuentra algo.",
  },

  servicios: {
    wifi: "Wifi gratis en todas las habitaciones y áreas comunes.",
    parqueo: "Parqueo gratuito dentro de las instalaciones.",
    aireAcondicionado: "Todas las habitaciones cuentan con aire acondicionado.",
    aguaCaliente: "Agua caliente las 24 horas.",
    television: "TV por cable en todas las habitaciones.",
    accesibilidad:
      "Consultar con recepción sobre accesibilidad para sillas de ruedas.",
  },
};

export function obtenerHoraCheckOutTexto() {
  return formatearHora(hotelInfo.horarios.horaCheckOut);
}

export function obtenerHoraInicioJornadaTexto() {
  return formatearHora(hotelInfo.horarios.horaInicioJornada);
}
