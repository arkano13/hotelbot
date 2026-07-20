import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { hotelTools } from "../../src/ai/tools.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ejecutarTool = fs.readFileSync(
  path.join(ROOT, "src", "ai", "executeTool.js"),
  "utf8",
);
const messageHandler = fs.readFileSync(
  path.join(ROOT, "src", "whatsapp", "messageHandler.js"),
  "utf8",
);

test("cada herramienta declarada en Gemini tiene implementación", () => {
  const declaradas = hotelTools
    .flatMap((grupo) => grupo.functionDeclarations ?? [])
    .map((herramienta) => herramienta.name)
    .sort();
  const implementadas = Array.from(
    ejecutarTool.matchAll(/case\s+["']([^"']+)["']\s*:/g),
    (coincidencia) => coincidencia[1],
  ).sort();

  assert.deepEqual(implementadas, declaradas);
});

test("el comprobante admite conversaciones con reservas múltiples", () => {
  const inicio = messageHandler.indexOf("async function procesarComprobante");
  const fin = messageHandler.indexOf("async function transcribirNotaDeVoz", inicio);
  const funcion = messageHandler.slice(inicio, fin);

  assert.match(
    funcion,
    /reservaIds/,
    "crear_reservas_multiples guarda reservaIds, pero procesarComprobante solo lee reservaId",
  );
});

test("la disponibilidad múltiple queda guardada en la conversación", () => {
  const inicio = ejecutarTool.indexOf('case "buscar_disponibilidad_multiple"');
  const fin = ejecutarTool.indexOf('case "crear_reservas_multiples"', inicio);
  const bloque = ejecutarTool.slice(inicio, fin);

  assert.match(
    bloque,
    /actualizarEstadoConversacion/,
    "La consulta múltiple no guarda fechas/personas ni la hora de disponibilidad",
  );
});

test("crear reservas múltiples exige una disponibilidad reciente confirmada", () => {
  const inicio = ejecutarTool.indexOf('case "crear_reservas_multiples"');
  const fin = ejecutarTool.indexOf("default:", inicio);
  const bloque = ejecutarTool.slice(inicio, fin);

  assert.match(
    bloque,
    /ultimaDisponibilidadAt/,
    "La creación múltiple acepta fechas directas sin comprobar una consulta reciente",
  );
  assert.match(
    bloque,
    /ESPERANDO_CONFIRMACION/,
    "La creación múltiple no verifica que el cliente haya llegado al paso de confirmación",
  );
});
