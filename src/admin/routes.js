    import { Router } from "express";
import {
  habitaciones,
  reservasParaCheckIn,
  reservasParaCheckout,
  reservasParaCancelar,
  hacerCheckIn,
  hacerCheckout,
  cancelarReserva,
  habitacionesMantenimiento,
  alternarMantenimiento,
  pagosPendientes,
  aprobarPago,
  rechazarPago,
  habitacionesDisponiblesWalkIn,
  crearWalkIn,
} from "./controller.js";

const router = Router();

// Dashboard
router.get("/habitaciones", habitaciones);

// Check-in / checkout / cancelar
router.get("/reservas/checkin", reservasParaCheckIn);
router.get("/reservas/checkout", reservasParaCheckout);
router.get("/reservas/cancelar", reservasParaCancelar);
router.post("/checkin/:habitacionId", hacerCheckIn);
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
router.post("/walkin", crearWalkIn);

export default router;