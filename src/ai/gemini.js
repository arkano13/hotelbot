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

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generarConReintentos(payload, intentosMaximos = 4) {
  let ultimoError;

  for (let intento = 1; intento <= intentosMaximos; intento++) {
    try {
      return await ai.models.generateContent(payload);
    } catch (error) {
      ultimoError = error;

      const reintentable =
        error?.status === 408 ||
        error?.status === 429 ||
        error?.status === 500 ||
        error?.status === 502 ||
        error?.status === 503 ||
        error?.status === 504;

      if (!reintentable || intento === intentosMaximos) {
        throw error;
      }

      const esperaBase = 1000 * 2 ** (intento - 1);

      const variacion = Math.floor(Math.random() * 500);

      const esperaMs = esperaBase + variacion;

      console.log(
        `⏳ Gemini no disponible. Reintento ${intento}/${intentosMaximos} en ${esperaMs} ms`,
      );

      await esperar(esperaMs);
    }
  }

  throw ultimoError;
}

function convertirHistorial(messages = []) {
  return messages
    .filter(
      (message) =>
        (message.role === "USER" || message.role === "ASSISTANT") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .map((message) => ({
      role: message.role === "ASSISTANT" ? "model" : "user",
      parts: [
        {
          text: message.content.trim(),
        },
      ],
    }));
}

function respuestaTieneContenido(response) {
  const texto = response.text?.trim();
  const llamadas = response.functionCalls ?? [];

  return Boolean(texto) || llamadas.length > 0;
}

async function generarConRespuestaValida(payload, intentosMaximos = 5) {
  let ultimaRespuesta;

  for (let intento = 1; intento <= intentosMaximos; intento++) {
    const response = await generarConReintentos(payload);
    ultimaRespuesta = response;

    if (respuestaTieneContenido(response)) {
      return response;
    }

    const motivo = response.candidates?.[0]?.finishReason ?? "DESCONOCIDO";

    if (intento < intentosMaximos) {
      const esperaMs = 500 * intento;

      console.warn(
        `⚠️ Gemini respondió vacío (${motivo}). Reintento ${intento}/${intentosMaximos} en ${esperaMs} ms`,
      );

      await esperar(esperaMs);
    }
  }

  console.dir(ultimaRespuesta?.candidates?.[0], {
    depth: null,
  });

  const error = new Error(
    "Gemini no generó texto ni solicitó una herramienta después de varios intentos",
  );
  error.code = "GEMINI_EMPTY_RESPONSE";
  throw error;
}

function obtenerFechaActual() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function generarRespuestaGemini({
  messages,
  step,
  telefono,
  conversationId,
  socket,
  jid,
}) {
  const contents = convertirHistorial(messages);

  if (contents.length === 0) {
    throw new Error("No hay mensajes para enviar a Gemini");
  }

  const fechaActual = obtenerFechaActual();

  const config = {
    systemInstruction: `
${SYSTEM_PROMPT}

FECHA ACTUAL:
- Hoy es ${fechaActual}.
- Zona horaria: America/Tegucigalpa.

ESTADO ACTUAL:
- Paso de reserva: ${step}
- Teléfono del cliente: ${telefono}

REGLAS PARA INTERPRETAR FECHAS:
- Nunca pidas al cliente fechas en formato YYYY-MM-DD.
- YYYY-MM-DD es únicamente para las herramientas internas.
- Permite expresiones naturales como:
  "mañana",
  "pasado mañana",
  "el 15 de noviembre",
  "este sábado",
  "el próximo fin de semana",
  "por 2 noches".
- Si el cliente indica una fecha de entrada y una cantidad de noches, calcula internamente la fecha de salida.
- Si dice "una noche", la salida es el día siguiente.
- Si menciona cantidades contradictorias, como "3 días y 4 noches", pide aclaración.
- Nunca uses fechas pasadas.
- "Este mes" significa el mes y año actuales.
- Si el cliente da solo un día y ese día ya pasó, pregunta si se refiere al próximo mes.
- No reutilices fechas anteriores cuando el cliente empieza una reserva nueva.
- Nunca inventes fechas.

REGLAS PARA CONSULTAR DISPONIBILIDAD:
- Usa buscar_disponibilidad solamente cuando tengas:
  1. fecha de entrada,
  2. fecha de salida,
  3. cantidad de personas.
- Si falta un dato, pregunta únicamente por el siguiente dato necesario.
- No muestres al cliente el número interno de la habitación.
- Después de consultar disponibilidad, muestra:
  fecha de entrada,
  fecha de salida,
  personas,
  noches,
  precio por noche,
  precio total.
- Luego pregunta si desea confirmar la reserva.

REGLAS PARA CREAR RESERVAS:
- Usa crear_reserva únicamente después de:
  1. consultar disponibilidad,
  2. mostrar el resumen,
  3. recibir una confirmación clara,
  4. conocer el nombre completo del cliente.
- Si el cliente confirma pero no conoces su nombre, pregúntalo.
- crear_reserva solamente recibe el nombre.
- Las fechas y personas se toman del estado guardado en la base de datos.
- Nunca llames crear_reserva dos veces para la misma reserva.
- Nunca digas que una reserva fue creada si la herramienta no lo confirmó.

REGLAS PARA TARIFAS:
- Usa consultar_tarifas cuando el cliente pregunte el precio.
- Nunca inventes precios.
- La moneda es HNL.

REGLAS GENERALES:
- Nunca inventes disponibilidad, reservas ni pagos.
- Si una herramienta devuelve un error, explícalo brevemente y pide el dato necesario.
- No menciones herramientas, funciones, base de datos, Gemini ni detalles técnicos.
    `.trim(),

    tools: hotelTools,
    temperature: 0.2,
    maxOutputTokens: 1000,
  };

  const MAX_RONDAS = 5;

  for (let ronda = 1; ronda <= MAX_RONDAS; ronda++) {
    const response = await generarConRespuestaValida({
      model: MODEL,
      contents,
      config,
    });

    const llamadas = response.functionCalls ?? [];

    if (llamadas.length === 0) {
      const texto = response.text?.trim();

      if (texto) {
        return texto;
      }

      throw new Error("Gemini devolvió una respuesta sin contenido utilizable");
    }

    const contenidoModelo = response.candidates?.[0]?.content;

    if (contenidoModelo) {
      contents.push(contenidoModelo);
    }

    const respuestasTools = [];

    for (const llamada of llamadas) {
      try {
        console.log(`🛠️ Tool: ${llamada.name}`, llamada.args);

   const resultado = await ejecutarTool(
  llamada.name,
  llamada.args,
  {
    conversationId,
    telefono,
    socket,
    jid,
  }
);

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
  }

  throw new Error("Gemini superó el máximo de rondas de herramientas");
}

export async function transcribirAudio(buffer, mimetype) {
  const response = await generarConReintentos({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: mimetype,
              data: buffer.toString("base64"),
            },
          },
          {
            text:
              "Transcribe este audio de WhatsApp a texto en español. " +
              "Responde únicamente con la transcripción, sin comentarios ni explicaciones adicionales. " +
              "Si no se entiende nada, responde solamente con: [audio no entendido]",
          },
        ],
      },
    ],
    config: {
      temperature: 0,
      maxOutputTokens: 300,
    },
  });

  return response.text?.trim() || "[audio no entendido]";
}