import { Router } from "express";
import {
  habitaciones,
  reservasParaCheckIn,
  reservasParaCheckout,
  reservasParaCancelar,
  hacerCheckIn,
  alternativasCheckIn,
  hacerCheckout,
  cancelarReserva,
  habitacionesMantenimiento,
  alternarMantenimiento,
  pagosPendientes,
  aprobarPago,
  rechazarPago,
  habitacionesDisponiblesWalkIn,
  habitacionesPorCapacidadConEstado,
  crearWalkIn,
  estadoBot,
  cambiarEstadoBot,
  escalacionesPendientes,
  aceptarEscalacion,
  rechazarEscalacion,
  conversacionesEnModoHumano,
  devolverABot,
  reservasQueRequierenAprobacion,
  aprobarHabitacion,
  rechazarHabitacion,
  registrarDispositivoPush,
} from "./controller.js";

const router = Router();

// Dashboard
router.get("/habitaciones", habitaciones);

// Check-in / checkout / cancelar
router.get("/reservas/checkin", reservasParaCheckIn);
router.get("/reservas/checkout", reservasParaCheckout);
router.get("/reservas/cancelar", reservasParaCancelar);
router.post("/checkin/:habitacionId", hacerCheckIn);
router.get("/checkin/:habitacionId/alternativas", alternativasCheckIn);
router.post("/checkout/:habitacionId", hacerCheckout);
router.post("/cancelar/:reservaId", cancelarReserva);

// Mantenimiento
router.get("/mantenimiento", habitacionesMantenimiento);
router.post("/mantenimiento/:habitacionId", alternarMantenimiento);

// Pagos
router.get("/pagos-pendientes", pagosPendientes);
router.post("/pagos/:codigo/aprobar", aprobarPago);
router.post("/pagos/:codigo/rechazar", rechazarPago);

// Walk-in
router.get("/walkin/disponibles", habitacionesDisponiblesWalkIn);
router.get("/walkin/habitaciones", habitacionesPorCapacidadConEstado);
router.post("/walkin", crearWalkIn);

// Encendido/apagado del bot
router.get("/bot-estado", estadoBot);
router.post("/bot-estado", cambiarEstadoBot);

// Escalar a humano
router.get("/escalaciones", escalacionesPendientes);
router.post("/escalaciones/:conversationId/aceptar", aceptarEscalacion);
router.post("/escalaciones/:conversationId/rechazar", rechazarEscalacion);

// Conversaciones actualmente en modo humano (para poder devolverlas al bot)
router.get("/conversaciones-humano", conversacionesEnModoHumano);
router.post("/conversaciones-humano/:conversationId/devolver-a-bot", devolverABot);

// Aprobación de habitación más grande de la pedida
router.get("/reservas-requieren-aprobacion", reservasQueRequierenAprobacion);
router.post("/reservas-requieren-aprobacion/:reservaId/aprobar", aprobarHabitacion);
router.post("/reservas-requieren-aprobacion/:reservaId/rechazar", rechazarHabitacion);

// Notificaciones push
router.post("/dispositivos", registrarDispositivoPush);

export default router;