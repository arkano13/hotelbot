import { Router } from "express";
import {
  crearReserva,
  consultarReserva,
} from "./controller.js";

const router = Router();

router.post("/", crearReserva);
router.get("/:codigo", consultarReserva);

export default router;