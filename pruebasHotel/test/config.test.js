import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { hotelInfo } from "../../src/config/hotelInfo.js";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("el checkout automático está configurado para las 11:00", () => {
  assert.equal(
    hotelInfo.horarios.horaCheckOut,
    11,
    "El requisito acordado es checkout a las 11:00; hotelInfo tiene otra hora",
  );
});

test("la política comunicada al cliente indica que no hay reembolso", () => {
  assert.match(
    hotelInfo.politicas.cancelacion,
    /no\s+(?:se\s+)?reembols|no\s+reembolsable/i,
    "El bot está comunicando una política de cancelación distinta a 'sin reembolso'",
  );
});

test("la información pública del hotel no conserva valores de ejemplo", () => {
  assert.notEqual(hotelInfo.nombre, "Hotel Ejemplo");
  assert.doesNotMatch(hotelInfo.telefonoContacto, /X/i);
});

test("el seed no asigna capacidad 3 a las ocho habitaciones", () => {
  const seed = fs.readFileSync(path.join(ROOT, "prisma", "seed.js"), "utf8");
  const asignaTresATodas =
    /const habitaciones\s*=\s*\["1",\s*"2",\s*"3",\s*"4",\s*"5",\s*"6",\s*"7",\s*"8"\][\s\S]*?capacidad:\s*3[\s\S]*?create:\s*\{[\s\S]*?capacidad:\s*3/;

  assert.equal(
    asignaTresATodas.test(seed),
    false,
    "El seed destruye el mapa real: 1-3=1 persona, 4-6=2, 7-8=3",
  );
});
