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
          "Envía fotografías al cliente únicamente cuando las solicita. Usa tipo 'habitacion' para fotos de los cuartos, o 'general' para fotos del hotel en general (fachada, recepción, áreas comunes).",
        parameters: {
          type: "OBJECT",
          properties: {
            tipo: {
              type: "STRING",
              description:
                "'habitacion' o 'general'. Si el cliente no especifica, usa 'habitacion'.",
            },
          },
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
      {
        name: "enviar_ubicacion",
        description:
          "Envía la ubicación exacta del hotel como un mapa dentro de WhatsApp. Úsala cuando el cliente pregunte cómo llegar, dónde está el hotel, o pida la dirección/ubicación.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "escalar_a_humano",
        description:
          "Notifica al jefe para que decida si toma el control de la conversación. Úsala cuando: el cliente pida explícitamente hablar con una persona, el cliente esté siendo grosero/irrespetuoso, o la situación se salga de lo que puedes resolver tú (quejas, negociaciones, casos fuera de lo normal). No cambias el modo tú solo — el jefe decide si acepta o rechaza.",
        parameters: {
          type: "OBJECT",
          properties: {
            motivo: {
              type: "STRING",
              description:
                "Resume en una frase breve por qué se necesita escalar, para que el jefe entienda la situación de un vistazo.",
            },
          },
          required: ["motivo"],
        },
      },
      {
        name: "consultar_reserva",
        description:
          "Consulta el estado de la reserva del cliente: si está confirmada, cuánto debe pagar, sus fechas, o su código. Úsala cuando el cliente pregunte por su reserva, su pago, o su código de reserva.",
        parameters: {
          type: "OBJECT",
          properties: {
            codigo: {
              type: "STRING",
              description:
                "Código de reserva si el cliente lo proporciona (ej. R1234). Si no lo da, deja este campo vacío y se buscará por su número de teléfono.",
            },
          },
        },
      },
    ],
  },
];