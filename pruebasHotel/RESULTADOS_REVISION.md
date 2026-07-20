# Resultados de la revisión inicial

Fecha: 17 de julio de 2026.

## Comprobaciones ejecutadas

- Instalación limpia de dependencias: completada.
- Generación de Prisma Client: completada.
- Sintaxis de todos los `.js`: correcta.
- `prisma validate`: correcto.
- Arranque real sobre Linux: falló antes de conectar a la base.
- Suite automática: 17 pruebas ejecutadas; 7 correctas y 10 fallidas.
- Auditoría de dependencias: 3 avisos moderados, ninguno alto o crítico.

## Fallos confirmados en la versión revisada

### Bloqueantes

1. El servidor no arranca en Railway/Linux. El archivo se llama `src/reportes/Scheduler.js`, pero `src/server.js` importa `./reportes/scheduler.js`. Linux distingue mayúsculas de minúsculas.
2. `prisma/seed.js` asigna capacidad 3 a las ocho habitaciones. Una instalación nueva queda distinta al requisito: 1–3=1, 4–6=2 y 7–8=3.
3. Las reservas múltiples guardan `Conversation.reservaIds`, pero el comprobante solo lee `Conversation.reservaId`. Un grupo no puede completar correctamente el pago por comprobante.
4. La cadena de migraciones contiene una migración que agrega `codigo TEXT NOT NULL` sin rellenar conversaciones existentes y la siguiente elimina la tabla `conversations`. Una actualización con conversaciones previas puede fallar o perderlas.

### Altos

5. `hotelInfo.horarios.horaCheckOut` vale 13, aunque el requisito acordado es 11. El log del scheduler dice 11, pero la ejecución usa 13.
6. La política del prompt dice cancelación gratis hasta 24 horas y cobro de primera noche después. El requisito acordado es que no existen devoluciones.
7. La creación múltiple no guarda ni exige una consulta de disponibilidad reciente ni comprueba `ESPERANDO_CONFIRMACION`, a diferencia de la reserva individual.
8. Dos solicitudes simultáneas de atención humana usan la misma entrada del `Map`; la última puede reemplazar la primera.

### Medios

9. `hotelInfo.js` conserva “Hotel Ejemplo”, teléfono con `X` y dirección de ejemplo.
10. `readme.md` pide copiar `.env.example`, pero ese archivo no existe.
11. El audio se limita por duración, pero no por bytes, y pasa el MIME de WhatsApp sin normalizar `; codecs=opus`.
12. `npm audit` reportó tres avisos moderados transitivos relacionados con Prisma/@hono. No se debe aplicar el cambio mayor sugerido automáticamente sin comprobar compatibilidad.

## Estado

La aplicación todavía no está lista para Railway. Primero deben corregirse los tres bloqueantes y volver a ejecutar toda la suite.
