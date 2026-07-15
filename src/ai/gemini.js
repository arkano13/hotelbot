import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

import { SYSTEM_PROMPT } from "./prompt.js";
import { hotelTools } from "./tools.js";
import { ejecutarTool } from "./executeTool.js";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY no está configurada en el archivo .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function convertirHistorial(messages = []) {
  return messages
    .filter(
      (message) => message.role === "USER" || message.role === "ASSISTANT",
    )
    .map((message) => ({
      role: message.role === "ASSISTANT" ? "model" : "user",

      parts: [
        {
          text: message.content,
        },
      ],
    }));
}

function obtenerContenidoModelo(response) {
  return response.candidates?.[0]?.content ?? null;
}

export async function generarRespuestaGemini({
  messages,
  step,
  telefono,
  conversationId,
}) {
  const contents = convertirHistorial(messages);

  if (contents.length === 0) {
    throw new Error("No hay mensajes para enviar a Gemini");
  }

  const ahora = new Date();

  const fechaActual = new Intl.DateTimeFormat("es-HN", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);

  const config = {
    systemInstruction: `
${SYSTEM_PROMPT}

FECHA ACTUAL:
- Hoy es ${fechaActual}.
- Zona horaria: America/Tegucigalpa.

ESTADO ACTUAL:
- Paso de reserva: ${step}
- Teléfono del cliente: ${telefono}

REGLAS PARA CREAR RESERVAS:
- Después de buscar disponibilidad, muestra un resumen con fechas, personas, noches y precio total.
- Pregunta claramente si el cliente desea confirmar.
- No uses crear_reserva hasta que el cliente responda claramente que sí desea confirmar.
- Antes de usar crear_reserva, asegúrate de tener el nombre del cliente.
- Si el cliente confirma pero no tienes su nombre, pregúntale su nombre.
- La tool crear_reserva solo necesita el nombre; las fechas y personas se toman de la base de datos.
- Nunca llames crear_reserva dos veces para la misma confirmación.

REGLAS PARA TOOLS:
- Usa consultar_tarifas cuando el cliente pregunte precios.
- Usa buscar_disponibilidad cuando tengas fecha de entrada, fecha de salida y cantidad de personas.
- Nunca inventes resultados de las tools.
- No muestres al cliente el número interno de habitación.
- Si falta algún dato para buscar disponibilidad, pregúntalo.
    `.trim(),

    tools: hotelTools,
    temperature: 0.2,
    maxOutputTokens: 500,
  };

  const primeraRespuesta = await ai.models.generateContent({
    model: MODEL,
    contents,
    config,
  });

  const llamadas = primeraRespuesta.functionCalls ?? [];

  if (llamadas.length === 0) {
    const texto = primeraRespuesta.text?.trim();

    if (!texto) {
      throw new Error("Gemini no generó una respuesta");
    }

    return texto;
  }

  const contenidoModelo = obtenerContenidoModelo(primeraRespuesta);

  if (contenidoModelo) {
    contents.push(contenidoModelo);
  }

  const respuestasTools = [];

  for (const llamada of llamadas) {
    try {
      console.log(`🛠️ Tool: ${llamada.name}`, llamada.args);

      const resultado = await ejecutarTool(llamada.name, llamada.args, {
        conversationId,
        telefono,
      });

      respuestasTools.push({
        functionResponse: {
          name: llamada.name,
          response: {
            success: true,
            data: resultado,
          },
        },
      });
    } catch (error) {
      console.error(`❌ Error ejecutando ${llamada.name}:`, error);

      respuestasTools.push({
        functionResponse: {
          name: llamada.name,
          response: {
            success: false,
            error: error.message,
          },
        },
      });
    }
  }

  contents.push({
    role: "user",
    parts: respuestasTools,
  });

  const respuestaFinal = await ai.models.generateContent({
    model: MODEL,
    contents,
    config,
  });

  const textoFinal = respuestaFinal.text?.trim();

  if (!textoFinal) {
    throw new Error(
      "Gemini no generó una respuesta después de ejecutar la tool",
    );
  }

  return textoFinal;
}
