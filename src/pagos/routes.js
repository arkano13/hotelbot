import { Router } from "express";
import {
  cambiarEstado,
  crear,
  generarLink,
  obtener,
} from "./controller.js";

const router = Router();

router.post("/", crear);
router.get("/:id", obtener);
router.post("/:id/generar-link", generarLink);
router.patch("/:id/estado", cambiarEstado);

export default router;