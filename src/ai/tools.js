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
          "Crea una reserva temporal únicamente cuando el cliente ya confirmó que desea reservar, proporcionó su nombre completo, su número de identidad (DNI/tarjeta de identidad) y eligió método de pago (efectivo o transferencia).",
        parameters: {
          type: "OBJECT",
          properties: {
            nombre: {
              type: "STRING",
              description:
                "Nombre completo del cliente que confirmó la reserva.",
            },
            documento: {
              type: "STRING",
              description:
                "Número de identidad (DNI/tarjeta de identidad) del cliente. Es obligatorio para registrar la reserva.",
            },
            metodo_pago: {
              type: "STRING",
              enum: ["efectivo", "transferencia"],
              description:
                "Método de pago elegido por el cliente: 'efectivo' (paga al llegar, tiene 24 horas) o 'transferencia' (debe enviar comprobante).",
            },
          },
          required: ["nombre", "documento", "metodo_pago"],
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
        name: "buscar_disponibilidad_multiple",
        description:
          "Busca varias habitaciones para un grupo, repartiendo personas entre ellas. Úsala para grupos de 4 o más personas, o como respaldo cuando 2 o 3 personas no caben en una sola habitación (buscar_disponibilidad no encontró nada) y el cliente acepta repartirse en varias habitaciones.",
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
              description: "Cantidad total de personas, mínimo 2.",
            },
          },
          required: ["fechaEntrada", "fechaSalida", "personas"],
        },
      },
      {
  name: "crear_reservas_multiples",
  description:
    "Crea varias reservas para repartir a un grupo en distintas habitaciones (grupos de 4+, o de 2-3 personas cuando no cupieron en una sola habitación), después de confirmar disponibilidad, recibir confirmación, obtener nombre, apellido, número de identidad y método de pago.",
  parameters: {
    type: "OBJECT",
    properties: {
      nombre: {
        type: "STRING",
        description: "Nombre y apellido del cliente.",
      },
      documento: {
        type: "STRING",
        description:
          "Número de identidad (DNI/tarjeta de identidad) del cliente responsable del grupo. Es obligatorio.",
      },
      metodo_pago: {
        type: "STRING",
        enum: ["efectivo", "transferencia"],
        description:
          "Método de pago elegido: 'efectivo' (paga al llegar, tiene 24 horas) o 'transferencia' (debe enviar comprobante).",
      },
    },
    required: ["nombre", "documento", "metodo_pago"],
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