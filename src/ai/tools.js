export const hotelTools = [
  {
    functionDeclarations: [
      {
        name: "consultar_tarifas",
        description:
          "Consulta el precio real por noche para 1, 2 o 3 personas.",
        parameters: {
          type: "OBJECT",
          properties: {
            personas: {
              type: "NUMBER",
              description: "Cantidad de personas: 1, 2 o 3.",
            },
          },
          required: ["personas"],
        },
      },
      {
        name: "buscar_disponibilidad",
        description:
          "Busca habitaciones disponibles para unas fechas y cantidad de personas.",
        parameters: {
          type: "OBJECT",
          properties: {
            fechaEntrada: {
              type: "STRING",
              description: "Fecha de entrada en formato YYYY-MM-DD.",
            },
            fechaSalida: {
              type: "STRING",
              description: "Fecha de salida en formato YYYY-MM-DD.",
            },
            personas: {
              type: "NUMBER",
              description: "Cantidad de personas: 1, 2 o 3.",
            },
          },
          required: ["fechaEntrada", "fechaSalida", "personas"],
        },
      },
      {
        name: "crear_reserva",
        description:
          "Crea una reserva temporal únicamente cuando el cliente ya confirmó que desea reservar y proporcionó su nombre completo.",
        parameters: {
          type: "OBJECT",
          properties: {
            nombre: {
              type: "STRING",
              description:
                "Nombre completo del cliente que confirmó la reserva.",
            },
          },
          required: ["nombre"],
        },
      },
      {
        name: "iniciar_nueva_reserva",
        description:
          "Limpia los datos anteriores cuando el cliente quiere iniciar otra reserva o corregir completamente una reserva anterior.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "enviar_fotos",
        description:
          "Envía las fotografías de las habitaciones únicamente cuando el cliente las solicita.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "buscar_disponibilidad_multiple",
        description:
          "Busca varias habitaciones para grupos de 4 personas o más.",
        parameters: {
          type: "OBJECT",
          properties: {
            fechaEntrada: {
              type: "STRING",
              description: "Fecha interna de entrada en formato YYYY-MM-DD.",
            },
            fechaSalida: {
              type: "STRING",
              description: "Fecha interna de salida en formato YYYY-MM-DD.",
            },
            personas: {
              type: "NUMBER",
              description: "Cantidad total de personas, mínimo 4.",
            },
          },
          required: ["fechaEntrada", "fechaSalida", "personas"],
        },
      },
      {
  name: "crear_reservas_multiples",
  description:
    "Crea varias reservas para un grupo de 4 personas o más, después de confirmar disponibilidad, recibir confirmación y obtener nombre y apellido.",
  parameters: {
    type: "OBJECT",
    properties: {
      nombre: {
        type: "STRING",
        description: "Nombre y apellido del cliente.",
      },
      fechaEntrada: {
        type: "STRING",
      },
      fechaSalida: {
        type: "STRING",
      },
      personas: {
        type: "NUMBER",
      },
    },
    required: [
      "nombre",
      "fechaEntrada",
      "fechaSalida",
      "personas",
    ],
  },
},
    ],
  },
];
