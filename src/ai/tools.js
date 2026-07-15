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
          required: [
            "fechaEntrada",
            "fechaSalida",
            "personas",
          ],
        },
      },
      {
        name: "crear_reserva",
        description:
          "Crea la reserva temporal únicamente después de que el cliente haya confirmado claramente los datos y haya proporcionado su nombre.",
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
    ],
  },
];