# Hotel WhatsApp IA

Bot de WhatsApp para gestión hotelera: reservas, disponibilidad, pagos, check-in/check-out, reportes y backups automáticos.

## Requisitos

- Node.js 20+
- PostgreSQL
- Un número de WhatsApp dedicado para el bot (se conecta escaneando QR)
- Una API key de Gemini
- Una cuenta de Gmail con contraseña de aplicación (para correos de reportes/alertas/backups)

## Instalación

```bash
npm install
cp .env.example .env
```

Llena `.env` con tus valores (ver más abajo).

```bash
npm run prisma:migrate
npm run seed
npm run dev
```

Al iniciar por primera vez va a mostrar un código QR en la terminal — escanéalo desde WhatsApp en el teléfono que va a operar el bot (Dispositivos vinculados).

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión a PostgreSQL |
| `GEMINI_API_KEY` | Sí | API key de Google Gemini |
| `OWNER_PHONE` | Sí | Número de WhatsApp del jefe, solo dígitos con código de país (ej. `504XXXXXXXX`) |
| `API_KEY` | Sí | Clave para proteger las rutas `/api/*` |
| `PORT` | No | Puerto del servidor (default `3000`) |
| `BASE_URL` | No | URL pública del servidor, usada para links de comprobantes |
| `CORS_ORIGINS` | No | Orígenes permitidos separados por coma, si vas a construir un panel web |
| `GEMINI_MODEL` | No | Modelo de Gemini a usar (default `gemini-3.1-flash-lite`) |
| `HOTEL_NOMBRE` | No | Nombre del hotel, aparece en PDFs y mensajes |
| `EMAIL_USER` | Sí (si usas reportes/backups) | Correo de Gmail que envía los correos |
| `EMAIL_APP_PASSWORD` | Sí (si usas reportes/backups) | Contraseña de aplicación de Gmail |
| `ALERTA_EMAIL_TO` | No | Correo que recibe alertas de fallas del sistema |
| `BACKUP_EMAIL_TO` | No | Correo que recibe el backup semanal |
| `REPORT_HOUR` | No | Hora (24h) en que se envían los reportes diarios (default `7`) |
| `DATA_DIR` | No | Carpeta donde se guarda la sesión de WhatsApp, uploads y estado del scheduler. Configúrala si usas un volumen persistente en producción |

La hora de checkout **no** se configura por variable de entorno — se edita en `src/config/hotelInfo.js` (`horarios.horaCheckOut`), junto con el resto de políticas del hotel.

## Comandos del jefe (por WhatsApp)

Escribe `/menu` desde el número configurado en `OWNER_PHONE` para ver las opciones disponibles.

## Scripts útiles

```bash
npm run prisma:studio                          # explorar la base de datos
node scripts/auditarReservasDuplicadas.js      # detectar dobles reservas
node scripts/corregirHabitaciones.js           # corregir datos de habitaciones
```