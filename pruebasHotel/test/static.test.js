import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const DIRECTORIOS = ["src", "scripts", "prisma"];

function listarJavaScript(directorio) {
  const resultado = [];

  for (const entrada of fs.readdirSync(directorio, { withFileTypes: true })) {
    const ruta = path.join(directorio, entrada.name);

    if (entrada.isDirectory()) {
      resultado.push(...listarJavaScript(ruta));
    } else if (entrada.isFile() && entrada.name.endsWith(".js")) {
      resultado.push(ruta);
    }
  }

  return resultado;
}

function obtenerImportsLocales(contenido) {
  const imports = [];
  const patrones = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["'](\.[^"']+)["']/g,
    /import\(\s*["'](\.[^"']+)["']\s*\)/g,
  ];

  for (const patron of patrones) {
    for (const coincidencia of contenido.matchAll(patron)) {
      imports.push(coincidencia[1]);
    }
  }

  return imports;
}

test("todos los archivos JavaScript tienen sintaxis válida", () => {
  const archivos = DIRECTORIOS.flatMap((directorio) =>
    listarJavaScript(path.join(ROOT, directorio)),
  );
  const errores = [];

  for (const archivo of archivos) {
    const resultado = spawnSync(process.execPath, ["--check", archivo], {
      encoding: "utf8",
    });

    if (resultado.status !== 0) {
      errores.push(`${path.relative(ROOT, archivo)}\n${resultado.stderr}`);
    }
  }

  assert.deepEqual(errores, [], errores.join("\n"));
});

test("todos los imports locales existen respetando mayúsculas y minúsculas", () => {
  const archivos = listarJavaScript(path.join(ROOT, "src"));
  const faltantes = [];

  for (const archivo of archivos) {
    const contenido = fs.readFileSync(archivo, "utf8");

    for (const importado of obtenerImportsLocales(contenido)) {
      const rutaBase = path.resolve(path.dirname(archivo), importado);
      const candidatos = path.extname(rutaBase)
        ? [rutaBase]
        : [`${rutaBase}.js`, path.join(rutaBase, "index.js")];

      if (!candidatos.some((candidato) => fs.existsSync(candidato))) {
        faltantes.push(
          `${path.relative(ROOT, archivo)} -> ${importado}`,
        );
      }
    }
  }

  assert.deepEqual(
    faltantes,
    [],
    `Imports rotos en Linux:\n${faltantes.join("\n")}`,
  );
});

test("la documentación no referencia archivos inexistentes", () => {
  const readme = fs.readFileSync(path.join(ROOT, "readme.md"), "utf8");

  if (readme.includes(".env.example")) {
    assert.ok(
      fs.existsSync(path.join(ROOT, ".env.example")),
      "readme.md pide copiar .env.example, pero el archivo no existe",
    );
  }
});

test("las migraciones no destruyen conversaciones ni exigen columnas sin migrar datos", () => {
  const directorio = path.join(ROOT, "prisma", "migrations");
  const migraciones = fs
    .readdirSync(directorio, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory())
    .map((entrada) => ({
      nombre: entrada.name,
      sql: fs.readFileSync(
        path.join(directorio, entrada.name, "migration.sql"),
        "utf8",
      ),
    }));
  const peligros = [];

  for (const migracion of migraciones) {
    if (/DROP TABLE\s+"conversations"/i.test(migracion.sql)) {
      peligros.push(`${migracion.nombre}: elimina la tabla conversations`);
    }

    if (/ADD COLUMN\s+"codigo"\s+TEXT\s+NOT NULL(?!\s+DEFAULT)/i.test(migracion.sql)) {
      peligros.push(
        `${migracion.nombre}: agrega codigo obligatorio sin valor para filas existentes`,
      );
    }
  }

  assert.deepEqual(
    peligros,
    [],
    `Migraciones destructivas o no actualizables:\n${peligros.join("\n")}`,
  );
});
