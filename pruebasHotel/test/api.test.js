import assert from "node:assert/strict";
import test, { after, before } from "node:test";

process.env.DATABASE_URL ||= "postgresql://test:test@127.0.0.1:5432/hotelbot_test";
process.env.API_KEY = "hotelbot-test-key";

let servidor;
let baseUrl;

before(async () => {
 const { app } = await import("../../src/app.js");
 
  await new Promise((resolve) => {
    servidor = app.listen(0, "127.0.0.1", resolve);
  });

  const direccion = servidor.address();
  baseUrl = `http://127.0.0.1:${direccion.port}`;
});

after(async () => {
  if (servidor) {
    await new Promise((resolve, reject) => {
      servidor.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET / responde sin consultar la base", async () => {
  const respuesta = await fetch(`${baseUrl}/`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.success, true);
});

test("GET /api/health responde OK", async () => {
  const respuesta = await fetch(`${baseUrl}/api/health`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.status, "OK");
});

test("las rutas privadas rechazan solicitudes sin API key", async () => {
  const respuesta = await fetch(`${baseUrl}/api/tarifas`);

  assert.equal(respuesta.status, 401);
});

test("una ruta inexistente devuelve 404", async () => {
  const respuesta = await fetch(`${baseUrl}/ruta-inexistente`);

  assert.equal(respuesta.status, 404);
});
