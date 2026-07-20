import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

process.env.DATABASE_URL ||= "postgresql://test:test@127.0.0.1:5432/hotelbot_test";
process.env.GEMINI_API_KEY ||= "gemini-test-key";
process.env.OWNER_PHONE ||= "50499999999";
process.env.API_KEY ||= "hotelbot-test-key";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function listarJavaScript(directorio) {
  return fs.readdirSync(directorio, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) return listarJavaScript(ruta);
    return entrada.isFile() && entrada.name.endsWith(".js") ? [ruta] : [];
  });
}

test("los módulos de src cargan sin imports/exports incompatibles", async () => {
  const archivos = listarJavaScript(path.join(ROOT, "src")).filter(
    (archivo) => path.relative(ROOT, archivo) !== path.join("src", "server.js"),
  );
  const errores = [];

  for (const archivo of archivos) {
    try {
      await import(pathToFileURL(archivo));
    } catch (error) {
      errores.push(`${path.relative(ROOT, archivo)}: ${error.message}`);
    }
  }

  assert.deepEqual(errores, [], errores.join("\n"));
});
