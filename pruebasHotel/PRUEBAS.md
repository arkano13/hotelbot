# Plan de pruebas completo de HotelBot

## Regla de seguridad

Nunca ejecutes `test:db:integration` usando la base del hotel. Esa prueba elimina todos los registros de la base indicada. El script se niega a comenzar si no recibe `TEST_DATABASE_URL`, si el nombre de la base no contiene `test`, o si `ALLOW_TEST_DATABASE_RESET` no vale `SI`.

La auditoría `test:db:audit` es de solo lectura y sí puede ejecutarse sobre la base de desarrollo o producción.

## Pruebas automáticas

Instalación y validaciones que no usan la base:

```bash
npm ci
npm test
npx prisma validate
npm audit --omit=dev
```

Auditoría de datos existentes, sin modificar nada:

```bash
npm run test:db:audit
```

Integración sobre una base exclusiva de pruebas:

Windows PowerShell:

```powershell
$env:TEST_DATABASE_URL="postgresql://usuario:clave@localhost:5432/hotelbot_test"
$env:ALLOW_TEST_DATABASE_RESET="SI"
$env:DATABASE_URL=$env:TEST_DATABASE_URL
npx prisma migrate deploy
npm run test:db:integration
```

Git Bash, Linux o macOS:

```bash
export TEST_DATABASE_URL="postgresql://usuario:clave@localhost:5432/hotelbot_test"
export ALLOW_TEST_DATABASE_RESET=SI
export DATABASE_URL="$TEST_DATABASE_URL"
npx prisma migrate deploy
npm run test:db:integration
```

La integración comprueba:

- asignación de habitaciones 1–3, 4–6 y 7–8;
- expiración de reserva y pago;
- aprobación y cancelación sin reembolso;
- walk-in y checkout;
- dos clientes compitiendo por la última habitación;
- pago tardío con reasignación;
- pago tardío sin cupo;
- grupo de cuatro personas en varias habitaciones.

## Preparación de las pruebas manuales

Usa cuatro números:

- BOT: número conectado a Baileys;
- JEFE: valor de `OWNER_PHONE`;
- CLIENTE A;
- CLIENTE B para concurrencia.

Antes de cada bloque anota:

- hora;
- teléfono usado;
- mensajes enviados;
- respuesta recibida;
- estado de Reserva, Pago y Conversation en Prisma Studio;
- error completo de la terminal si falla.

No reutilices una conversación vieja cuando el caso diga “cliente nuevo”. Puedes usar `iniciar_nueva_reserva` mediante una frase natural o limpiar únicamente la base de pruebas.

## 1. Inicio y despliegue

| ID | Acción | Resultado esperado |
|---|---|---|
| PRE-01 | Ejecutar `npm ci` | Instalación y `prisma generate` terminan sin error. |
| PRE-02 | Ejecutar `npx prisma validate` | El esquema es válido. |
| PRE-03 | Ejecutar `npx prisma migrate status` | Ninguna migración pendiente. |
| PRE-04 | Ejecutar el seed en base de prueba | Habitaciones 1–3 capacidad 1; 4–6 capacidad 2; 7–8 capacidad 3. |
| PRE-05 | Ejecutar `npm start` en Linux/Railway | Arranca sin `ERR_MODULE_NOT_FOUND`. |
| PRE-06 | Reiniciar el proceso tres veces | DB, HTTP, WhatsApp y cuatro schedulers inician una sola vez. |
| PRE-07 | Apagar con Ctrl+C | Se detienen schedulers, HTTP y Prisma sin quedar proceso colgado. |

## 2. API y seguridad

| ID | Acción | Resultado esperado |
|---|---|---|
| API-01 | `GET /` | HTTP 200. |
| API-02 | `GET /api/health` | HTTP 200 y `status: OK`. |
| API-03 | Consultar `/api/tarifas` sin `x-api-key` | HTTP 401. |
| API-04 | Consultar con API key incorrecta | HTTP 401. |
| API-05 | Consultar con API key correcta | Respuesta normal, sin filtrar secretos. |
| API-06 | Enviar JSON inválido | HTTP 400; el servidor no cae. |
| API-07 | Superar 100 solicitudes en 15 minutos | HTTP 429. |
| API-08 | Pedir una ruta inexistente | HTTP 404. |
| API-09 | Intentar `/uploads/../.env` | Nunca entrega `.env`. |

## 3. Conversación e inteligencia

| ID | Mensaje del cliente | Resultado esperado |
|---|---|---|
| BOT-01 | “Hola” | Saludo breve y una sola pregunta. |
| BOT-02 | “¿Dónde están?” | Envía mapa y dirección correcta. |
| BOT-03 | “¿Cuánto cuesta?” | Consulta tarifa; no inventa precio. |
| BOT-04 | “¿Aceptan mascotas?” | Responde exactamente según política. |
| BOT-05 | Pregunta desconocida | Admite que debe confirmarlo; no inventa. |
| BOT-06 | “Quiero otra reserva” | Limpia los datos anteriores y empieza de nuevo. |
| BOT-07 | “Me equivoqué, cambia solo las personas” | Cambia ese dato y vuelve a consultar; no mezcla datos viejos. |
| BOT-08 | Enviar cinco mensajes rápidos separados | Los agrupa sin responder cinco veces. |
| BOT-09 | Repetir exactamente el mismo mensaje de WhatsApp | El ID duplicado se procesa una sola vez. |

## 4. Fechas y disponibilidad

| ID | Mensaje | Resultado esperado |
|---|---|---|
| FEC-01 | “Mañana, una noche, una persona” | Calcula entrada/salida correctas. |
| FEC-02 | “Pasado mañana por dos noches” | Fechas correctas en Honduras. |
| FEC-03 | “Este sábado” | Interpreta la fecha futura correcta. |
| FEC-04 | Fecha pasada | La rechaza. |
| FEC-05 | “3 días y 4 noches” | Pide aclaración; no adivina. |
| FEC-06 | Fecha de salida igual a entrada | La rechaza. |
| FEC-07 | Solo proporciona día del mes ya pasado | Pregunta si se refiere al mes siguiente. |
| FEC-08 | Cambia fechas después del resumen | Reconsulta disponibilidad. |
| FEC-09 | Confirma después de más de 10 minutos | Obliga a consultar disponibilidad otra vez. |

## 5. Reservas individuales

| ID | Caso | Resultado esperado |
|---|---|---|
| RES-01 | 1 persona | Asigna únicamente habitación 1, 2 o 3. |
| RES-02 | 2 personas | Asigna únicamente habitación 4, 5 o 6. |
| RES-03 | 3 personas | Asigna únicamente habitación 7 u 8. |
| RES-04 | Dice “sí” antes de ver resumen | No crea reserva todavía. |
| RES-05 | Confirma sin nombre | Pide nombre y apellido. |
| RES-06 | Confirma y da nombre | Crea una sola reserva PENDIENTE_PAGO y un Pago NO_GENERADO. |
| RES-07 | Escribe “sí” dos veces | No crea dos reservas. |
| RES-08 | Cambia de idea antes de pagar | Puede iniciar otra reserva sin reutilizar fechas/nombre. |
| RES-09 | Dos clientes piden la última habitación simultáneamente | Solo uno obtiene la reserva. |
| RES-10 | Habitación en mantenimiento | Nunca aparece disponible. |

## 6. Comprobantes y pagos

| ID | Caso | Resultado esperado |
|---|---|---|
| PAG-01 | Imagen sin reserva activa | Explica que primero debe reservar. |
| PAG-02 | Comprobante dentro de 30 minutos | Pago PENDIENTE, `expiraEn=null`, llega aviso al jefe. |
| PAG-03 | Jefe aprueba | Pago APROBADO y reserva CONFIRMADA; cliente recibe aviso. |
| PAG-04 | Jefe intenta aprobar otra vez | Se rechaza sin duplicar datos. |
| PAG-05 | Jefe rechaza con motivo | Pago RECHAZADO, cliente ve el motivo, obtiene 30 minutos. |
| PAG-06 | Cliente reenvía comprobante | Mismo pago vuelve a PENDIENTE; no crea otra reserva. |
| PAG-07 | Reserva expira sin comprobante | Reserva EXPIRADA y pago VENCIDO. |
| PAG-08 | Comprobante después de expirar, habitación libre | Puede aprobarse y confirmar. |
| PAG-09 | Comprobante tarde, habitación original ocupada pero existe otra igual | Reasigna y confirma. |
| PAG-10 | Comprobante tarde sin ninguna habitación igual | No permite aprobarlo. |
| PAG-11 | Cancelar reserva pagada | Reserva CANCELADA; pago continúa APROBADO; mensaje sin reembolso. |
| PAG-12 | Archivo que no es imagen | No se acepta como comprobante. |

## 7. Grupos y varias habitaciones

| ID | Caso | Resultado esperado |
|---|---|---|
| GRP-01 | 4 personas | Distribución 3+1. |
| GRP-02 | 5 personas | Distribución 3+2. |
| GRP-03 | 6 personas | Distribución 3+3. |
| GRP-04 | 7 personas | Distribución 3+3+1. |
| GRP-05 | No hay suficientes habitaciones | No crea ninguna reserva parcial. |
| GRP-06 | Dos grupos simultáneos | No comparten habitación ni dejan grupo a medias. |
| GRP-07 | Enviar comprobante de un grupo | Debe asociarlo a todas las reservas del grupo y al total correcto. |
| GRP-08 | Rechazar/aprobar pago grupal | Todas las reservas cambian de forma atómica y coherente. |

## 8. Audios

| ID | Caso | Resultado esperado |
|---|---|---|
| AUD-01 | Audio claro: reserva para mañana | Transcribe fechas/personas correctamente y responde. |
| AUD-02 | Audio con ruido | Pide repetir o escribir; no inventa. |
| AUD-03 | Audio vacío/silencio | Responde “no entendido”. |
| AUD-04 | Audio de 179 segundos | Se procesa. |
| AUD-05 | Audio de 181 segundos | Se rechaza antes de descargar/enviar a Gemini. |
| AUD-06 | Audio seguido inmediatamente por texto | Se agrupan de forma coherente. |
| AUD-07 | Audio con nombres y números | Conserva nombre, fechas y cantidades. |
| AUD-08 | Audio en modo HUMANO | El bot no responde automáticamente. |

## 9. Fotos y ubicación

| ID | Caso | Resultado esperado |
|---|---|---|
| IMG-01 | “Enséñame habitaciones” | Solo envía imágenes tipo HABITACION activas. |
| IMG-02 | “Fotos del hotel” | Solo envía imágenes GENERAL activas. |
| IMG-03 | No existen imágenes del tipo pedido | Explica que no hay; no cae. |
| IMG-04 | URL de imagen rota | Registra error y continúa atendiendo mensajes posteriores. |
| IMG-05 | Cliente no pidió fotos | Nunca las envía por iniciativa propia. |
| UBI-01 | “Mándame la ubicación” | Envía coordenadas y nombre correctos. |

## 10. Escalamiento BOT/HUMANO

| ID | Caso | Resultado esperado |
|---|---|---|
| HUM-01 | Cliente pide una persona | Jefe recibe código, teléfono, motivo y opciones 1/2. |
| HUM-02 | Jefe elige 1 | Conversación pasa a HUMANO; bot deja de responder. |
| HUM-03 | Jefe elige 2 | Continúa en BOT. |
| HUM-04 | Jefe responde algo distinto | Vuelve a pedir 1 o 2. |
| HUM-05 | Dos clientes escalan antes de responder | Las dos solicitudes permanecen disponibles; ninguna se reemplaza. |
| HUM-06 | Reiniciar servidor con conversación HUMANO | El modo continúa HUMANO en la base. |
| HUM-07 | `/C#### bot` | Vuelve a BOT. |
| HUM-08 | `/C#### historial` | Muestra historial correcto y ordenado. |

## 11. Menú del jefe

| ID | Acción | Resultado esperado |
|---|---|---|
| MEN-01 | `/menu` | Muestra exactamente opciones 1–6. |
| MEN-02 | Opción 1, `Nombre | 1 | 2` | Ocupa automáticamente habitación 1–3 y crea CHECK_IN con efectivo aprobado. |
| MEN-03 | Opción 2 | Solo lista reservas CONFIRMADAS que pueden entrar. |
| MEN-04 | Opción 3 | Lista cualquier habitación CHECK_IN y la desocupa. |
| MEN-05 | Opción 4 | Lista conversaciones activas y sus modos. |
| MEN-06 | Opción 5 | Cancela futura confirmada sin cambiar pago APROBADO. |
| MEN-07 | Opción 6 sobre habitación libre | Entra/sale de mantenimiento. |
| MEN-08 | Opción 6 sobre habitación con reserva activa | Impide mantenimiento. |
| MEN-09 | Número inexistente en una lista | No ejecuta otra operación por accidente. |
| MEN-10 | `/menu` a mitad de un flujo | Cancela el flujo anterior y vuelve al menú. |

## 12. Schedulers y reinicios

| ID | Caso | Resultado esperado |
|---|---|---|
| SCH-01 | Reserva vencida | Se marca en menos de dos minutos. |
| SCH-02 | Comprobante recibido y pendiente de jefe | No expira mientras espera revisión. |
| SCH-03 | CHECK_IN con salida hoy a las 10:59 | Sigue CHECK_IN. |
| SCH-04 | CHECK_IN con salida hoy después de las 11:00 | Pasa a CHECK_OUT. |
| SCH-05 | Reserva CONFIRMADA sin check-in | Checkout automático no la toca. |
| SCH-06 | Reiniciar después de las 7:00 | No repite reporte diario ya enviado. |
| SCH-07 | Primer día del mes | Envía un solo reporte mensual del mes anterior. |
| SCH-08 | Conversación inactiva | Se finaliza al tiempo configurado. |
| SCH-09 | Fallo temporal de DB | Scheduler registra error y vuelve a intentarlo; proceso no cae. |
| SCH-10 | Backup dominical | Se genera y envía una sola vez. |

## 13. Persistencia en Railway

| ID | Caso | Resultado esperado |
|---|---|---|
| RLY-01 | Desplegar desde cero | Ejecuta migraciones y arranca en Linux. |
| RLY-02 | Reiniciar servicio | No pide QR otra vez. |
| RLY-03 | Reiniciar después de recibir comprobante | La imagen sigue disponible. |
| RLY-04 | Reiniciar después de reporte | Conserva `scheduler-reportes.json`. |
| RLY-05 | Cambiar réplica o redeploy | `DATA_DIR`, sesión, uploads y estado usan volumen persistente. |
| RLY-06 | DB reinicia | El bot reconecta sin crear reservas duplicadas. |

## Criterio para subir a producción

No desplegar hasta que:

- no haya fallos en `npm test`;
- Prisma valide y todas las migraciones estén aplicadas;
- la integración pase en una base de prueba vacía;
- la auditoría real reporte cero errores;
- pasen PAG-08, PAG-09, PAG-10, RES-09, GRP-07, HUM-05, SCH-04 y RLY-01;
- reiniciar el servidor no pierda sesión, comprobantes ni estado de reportes.
