// Edita estos valores con la información real del hotel.
// No requiere migración de base de datos ni reiniciar nada más
// que el servidor (npm run dev) después de guardar los cambios.

export const hotelInfo = {
  nombre: process.env.HOTEL_NOMBRE || "Hotel",

  direccion: process.env.HOTEL_DIRECCION || "Configura HOTEL_DIRECCION",

  ubicacion: {
    latitud: 14.0723,
    longitud: -87.1921,
  },

  telefonoContacto: process.env.HOTEL_TELEFONO || "50400000000",

  horarios: {
    checkIn: "2:00 PM",
    horaCheckOut: 11,
    atencion: "24 horas",
  },

  politicas: {
    cancelacion:
      "Las reservas pagadas pueden cancelarse, pero el pago es no reembolsable.",
    entradaAnticipada:
      "La entrada anticipada depende de disponibilidad, hay que preguntar el día de la llegada.",
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
  const hora = hotelInfo.horarios.horaCheckOut;
  const periodo = hora >= 12 ? "PM" : "AM";
  const hora12 = hora % 12 === 0 ? 12 : hora % 12;

  return `${hora12}:00 ${periodo}`;
}
